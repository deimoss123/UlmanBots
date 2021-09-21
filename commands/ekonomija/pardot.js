import { itemList } from '../../itemList.js'
import { addItems, findUser, addLati } from '../../ekonomija.js'
import { stringifyItems, latsOrLati } from '../../helperFunctions.js'
import { embedError, itemTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Pārdot',
  description: 'Pārdot preci no inventāra',
  commands: ['pardot'],
  expectedArgs: '<preces numurs> <daudzums>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    let items = {}
    let total = 0

    // pārdot visus nelietojamos atkritumus
    if (args[0] === 'a' && !args[1]) {
      const result = await findUser(guildId, userId)

      if (!Object.keys(result.items).length) return 1

      // pārbauda vai katru atkritumu vai tas ir izmantojams
      Object.keys(result.items).map(key => {
        if (itemList.atkritumi[key]) {
          if (!itemList.atkritumi[key].usable) {
            items[key] = result.items[key]
            total += itemList.atkritumi[key].price * items[key]
          }
        }
      })

      // pārbauda vai ir ko pārdot
      if (Object.keys(items).length) {
        message.reply(itemTemplate('Pārdot', `Tu pārdevi ${stringifyItems(
          items)}, un ieguvi ${total} latus\nTev tagad ir ${(result.lati + total).toFixed(
          2)} ${latsOrLati(result.lati + total)}`))
      } else {
        message.reply(itemTemplate('Pārdot', 'Tev nav atkritumi ko pārdot'))
        return 1
      }
    } else { // pārdot atsevišķu preci

      // pārbaudīt sintaksi
      if (isNaN(parseInt(args[0])) || (isNaN(parseInt(args[1])) && args[1])) return 0

      const amount = args[1] ? parseInt(args[1]) : 1
      const index = parseInt(args[0]) - 1

      // pārbaudīt vai ievadītais daudzums nav mazāks par 1
      if (amount < 1) {
        message.reply(embedError('pārdot', `Tu nevari pārdot ${amount} lietas, ļoti smieklīgi`))
        return 1
      }

      const result = await findUser(guildId, userId)

      if (index >= Object.keys(result.items).length || index < 0) {
        message.reply(embedError('pārdot', 'Ko tu vēlies pārdot?'))
        return 1
      }

      let i = 0
      let resultKey

      Object.keys(result.items).map(key => {
        if (i === index) {
          Object.keys(itemList).map(keydb => {
            if (itemList[keydb][key]) {
              total = itemList[keydb][key].price * amount
              items[key] = amount
              resultKey = key
            }
          })
        }
        i++
      })

      // pārbauda vai lietotājam ir tik daudz itemu
      if (result.items[resultKey] < amount) {
        message.reply(itemTemplate('Pārdot', `Tavā inventārā nav ${stringifyItems(items)}`))
        return 1
      } else {
        message.reply(itemTemplate('Pārdot',
          `Tu pārdevi ${stringifyItems(items)} par ${total} latiem\nTev tagad ir ${
          (result.lati + total).toFixed(2)} ${latsOrLati(result.lati + total)}`))
      }
    }

    Object.keys(items).map(item => items[item] *= -1)

    console.log(items, 'items')

    await addLati(guildId, userId, total)
    await addItems(guildId, userId, items)
    return 1
  },
}