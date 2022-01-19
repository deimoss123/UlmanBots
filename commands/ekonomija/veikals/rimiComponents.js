import { floorTwo } from '../../../helperFunctions.js'
import { itemList } from '../../../itemList.js'
import { emojiList } from '../../../reakcijas/atbildes.js'
import { findUser } from '../../../ekonomija.js'

export const getComponents = async (rand, guildId, userId, chosenItem, amount, discounts) => {

  const calcPrice = item => {
    return itemList.veikals[item].price * 2 * (discounts ? discounts[item] ? discounts[item] : 1 : 1)
  }

  amount = parseInt(amount)

  const user = await findUser(guildId, userId)

  const { lati, itemCount, itemCap } = user
  let price

  const freeItemSlots = itemCap - itemCount

  let pirktLabel = 'Pirkt'
  let placeholderList = `Izvēlies preci (tev ir ${floorTwo(lati)} lati)`

  if (chosenItem) {
    const { nameNomVsk } = itemList.veikals[chosenItem]
    placeholderList = `${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)} - ` +
      `${calcPrice(chosenItem)} lati`
    price = calcPrice(chosenItem)
    pirktLabel = `Pirkt (cena: ${price * amount})`
  }

  let row = [
    {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: `list ${rand}`,
          placeholder: placeholderList,
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
          placeholder: `Daudzums: ${amount}`,
          min_values: 1,
          max_values: 1,
          options: [],
          disabled: !chosenItem,
        },
      ],
    }, {
      type: 1,
      components: [
        {
          type: 2,
          style: !chosenItem || price * amount > lati || freeItemSlots < amount ? 2 : 1,
          label: pirktLabel,
          custom_id: `pirkt ${rand}`,
          disabled: !chosenItem || price * amount > lati || freeItemSlots < 1,
        },
      ],
    },
  ]

  for (let i = 1; i <= 10; i++) {
    row[1].components[0].options.push({ label: `${i}`, value: `${i}` })
  }

  row[0].components[0].options = Object.keys(itemList.veikals).map(key => {
    const { nameNomVsk } = itemList.veikals[key]
    return {
      label: `${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)} - ${calcPrice(key)} lati`,
      value: key,
      emoji: {
        name: `_${key}`,
        id: emojiList[`_${key}`].startsWith('a')
          ? emojiList[`_${key}`].slice(1)
          : emojiList[`_${key}`]
      }


    }
  })

  if (price * amount > lati) {
    row[2].components.push({
      type: 2,
      style: 4,
      custom_id: `${Math.random()}`,
      label: `Nepietiek naudas, tev ir ${lati} lati`,
      disabled: true
    })
  }

  if (freeItemSlots < amount) {
    row[2].components.push({
      type: 2,
      style: 4,
      custom_id: `${Math.random()}`,
      label: `Nepietiek vietas, brīvas vietas: ${freeItemSlots < 0 ? 0 : freeItemSlots}`,
      disabled: true
    })
  }

  return row
}