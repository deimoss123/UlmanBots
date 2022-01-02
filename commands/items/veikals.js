import { itemList } from '../../itemList.js'
import { buttonEmbed } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'
import pirkt from '../ekonomija/pirkt.js'
import redis from '../../redis.js'
import { getEmoji } from '../../reakcijas/atbildes.js'
import { redisEnabled } from '../../index.js'
import { findItem } from '../../helperFunctions.js'
import { getComponents } from './rimiComponents.js'

export const calculateDiscounts = async () => {

  const maxItems = 2
  const minDiscount = 5
  const maxDiscount = 20

  let discountedItems = {}

  for (let i = 0; i < maxItems; i++) {
    if (Math.random() < 0.5) {
      const disc = Math.floor(Math.random() * (maxDiscount / 5) + (minDiscount / 5)) * 0.05
      const item = Object.keys(itemList.veikals)[Math.floor(
        Math.random() * Object.keys(itemList.veikals).length)]
      if (!findItem(item)?.disableDiscount) discountedItems[item] = Math.floor((1 - disc) * 100) / 100
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
  if (!redisEnabled) return
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
    const { guildId } = message
    const userId = message.author.id

    const discounts = await getDiscounts()

    const rand = Math.floor(Math.random() * 100000)

    let chosenItem = ''
    let amount = '1'

    let resultArr = Object.keys(itemList.veikals).map(key => {
      let discount = 1
      if (discounts) if (discounts[key]) discount = discounts[key]
      const { nameNomVsk, price, ids } = itemList.veikals[key]
      return {
        name: `${getEmoji([`_${key}`])} ${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)}${
          discount < 1 ? `  **-${Math.round((1 - discount) * 100)}%**` : ''}`,
        value: `id: \`${ids[0]}\` | Cena: ${discount < 1
          ? `~~${price * 2}~~ **${price * 2 * discount}**`
          : `**${price * 2}**`} lati`,
      }
    })

    await buttonEmbed({
      message,
      title: 'Veikals',
      commandTitle: 'Veikals',
      description:
        'Lai nopirktu preci izmanto\n`.pirkt <preces id> <daudzums>`\n\n' +
        'Atlaides restartējas katru dienu plkst. `00:00`',
      imgUrls: imgLinks.rimi,
      fields: resultArr,
      color: 0xf50707,
      row: await getComponents(rand, guildId, userId, chosenItem, amount, discounts),
      cb: async i => {
        if (i.customId === `list ${rand}`) {
          chosenItem = i.values[0]
          return {
            id: `list ${rand}`,
            editComponents: await getComponents(rand, guildId, userId, chosenItem, amount, discounts),
          }
        }

        if (i.customId === `amount ${rand}`) {
          amount = i.values[0]
          return {
            id: `amount ${rand}`,
            editComponents: await getComponents(rand, guildId, userId, chosenItem, amount, discounts),
          }
        }

        if (i.customId === `pirkt ${rand}` && chosenItem) {
          const item = {}
          item[chosenItem] = parseInt(amount)
          return {
            id: `pirkt ${rand}`,
            all: true,
            deactivate: true,
            after: async () => {
              await pirkt.callback(message, [itemList.veikals[chosenItem].ids[0], amount])
            }
          }
        }
      }
    })

    return 1
  },
}