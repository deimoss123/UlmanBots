import { itemList } from '../../itemList.js'
import { buttonEmbed } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'
import pirkt from '../ekonomija/pirkt.js'
import redis from '../../redis.js'

export const calculateDiscounts = async () => {

  const maxItems = 2
  const minDiscount = 5
  const maxDiscount = 30

  let discountedItems = {}

  for (let i = 0; i < maxItems; i++) {
    if (Math.random() < 0.5) {
      const disc = Math.floor(Math.random() * (maxDiscount / 5) + (minDiscount / 5)) * 0.05
      const item = Object.keys(itemList.veikals)[Math.floor(Math.random() * Object.keys(itemList.veikals).length)]
      discountedItems[item] = Math.floor((1 - disc) * 100) / 100
    }
  }

  const redisClient = await redis()
  try {
    redisClient.del('discounts')
    if (Object.keys(discountedItems).length) {
      Object.keys(discountedItems).map(item => {
        redisClient.hset('discounts', item, discountedItems[item])
      })
    }
  } finally {
    redisClient.quit()
  }
}

export const getDiscounts = async () => {
  const redisClient = await redis()
  return new Promise((res, rej) => {
    redisClient.hgetall('discounts', (err, r) => {
      if (err) return rej(err)
      return res(r)
    })
  })
}

export default {
  title: 'Veikals',
  description: 'Apskatīt veikalu',
  commands: ['veikals', 'maksima', 'maxima', 'rimi'],
  cooldown: 1000,
  callback: async message => {

    const discounts = await getDiscounts()
    console.log(discounts)

    const rand = Math.floor(Math.random() * 100000)
    let row = [
      {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: `list ${rand}`,
            placeholder: 'Izvēlies preci',
            min_values: 1,
            max_values: 1,
            options: [],
          },
        ],
      }, {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: `amount ${rand}`,
            placeholder: 'Daudzums: 1',
            min_values: 1,
            max_values: 1,
            options: [],
            disabled: true,
          },
        ],
      }, {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: 'Pirkt',
            custom_id: `pirkt ${rand}`,
            disabled: true,
          },
        ],
      },
    ]

    for (let i = 1; i <= 10; i++) row[1].components[0].options.push(
      { label: `${i}`, value: `${i}` })

    let resultArr = []
    let i = 0

    row[0].components[0].options = Object.keys(itemList.veikals).map(key => {

      let discount = 1
      if (discounts) if (discounts[key]) discount = discounts[key]

      const { nameNomVsk, price } = itemList.veikals[key]

      resultArr.push({
        name: `\`[${i + 1}] ${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)}\`${
          discount < 1 ? `  **-${Math.round((1 - discount) * 100)}%**` : ''}`,
        value: `Cena: ${discount < 1 
          ? `~~${price * 2}~~ **${price * 2 * discount}**` 
          : `**${price * 2}**`} lati`,
      })
      i++

      return {
        label: `${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)} - ${
          price * 2 * (discount < 1 ? discount : 1)} lati`,
        value: key,
      }
    })

    let chosenItem
    let amount = '1'

    await buttonEmbed(message, 'Veikals',
      'Lai nopirktu preci izmanto\n`.pirkt <preces numurs> <daudzums>`\n\n' +
      'Atlaides restartējas katru dienu plkst. 00.00',
      imgLinks.rimi, row, async i => {
        if (i.customId === `list ${rand}`) {
          chosenItem = i.values[0]
          const tempRow = [...row]
          tempRow[1].components[0].disabled = false
          tempRow[2].components[0].disabled = false
          const { nameNomVsk, price } = itemList.veikals[i.values[0]]
          return {
            id: `list ${rand}`,
            editComponents: tempRow,
            value: `${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)} - ${
              price * 2 * (discounts ? discounts[chosenItem] ? discounts[chosenItem] : 1 : 1)} lati`,
          }
        }

        if (i.customId === `amount ${rand}`) {
          amount = i.values[0]
          return {
            id: `amount ${rand}`,
            value: `Daudzums: ${amount}`,
          }
        }

        if (i.customId === `pirkt ${rand}` && chosenItem) {
          const item = {}
          item[chosenItem] = parseInt(amount)
          await pirkt.callback(message, ['1', amount], 0, 0, item)
          return { id: `pirkt ${rand}`, all: true }
        }

      }, resultArr)
    return 1
  },
}