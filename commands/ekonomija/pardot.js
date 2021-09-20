import { itemList } from '../../itemList.js'
import { addItems, findUser, addLati } from '../../ekonomija.js'
import { stringifyItems, latsOrLati } from '../../helperFunctions.js'
import { embedError, itemTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Pārdot',
  expectedArgs: '<preces numurs> <daudzums>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    let itemArr = []
    let total = 0

    // pārdot visus nelietojamos atkritumus
    if (args[0] === 'a' && !args[1]) {
      const result = await findUser(guildId, userId)

      // pārbauda vai katru atkritumu vai tas ir izmantojams
      for (const key in result.items) {
        if (itemList.atkritumi[key]) {
          if (!itemList.atkritumi[key].usable) {
            for (let i = 0; i < result.items[key]; i++) {
              itemArr.push(key)
              total += itemList.atkritumi[key].price
            }
          }
        }
      }

      // pārbauda vai ir ko pārdot
      if (itemArr.length) {
        message.reply(itemTemplate('Pārdot', `Tu pārdevi ${stringifyItems(
          itemArr)}, un ieguvi ${total} latus\nTev tagad ir ${(result.lati + total).toFixed(
          2)} ${latsOrLati(result.lati + total)}`))
      } else {
        message.reply(itemTemplate('Pārdot', 'Tev nav atkritumi ko pārdot'))
        return 1
      }
    } else { // pārdot atsevišķu preci

      // pārbaudīt sintaksi
      if (isNaN(parseInt(args[0])) || (isNaN(parseInt(args[1])) && args[1])) return 0

      console.log(args[0], args[1])

      const amount = args[1] ? parseInt(args[1]) : 1
      const index = parseInt(args[0]) - 1

      console.log('amount un index:')
      console.log(amount, index)

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

      let item, price
      let i = 0

      for (const key in result.items) {
        if (i === index) {
          for (const keydb in itemList) {
            if (itemList[keydb][key]) {
              item = key
              price = itemList[keydb][key].price
            }
          }
          break
        }
        i++
      }

      // izveido itemArr
      for (let i = 0; i < amount; i++) itemArr.push(item)

      total = price * amount

      // pārbauda vai lietotājam ir tik daudz itemu
      if (result.items[item] < amount) {
        message.reply(itemTemplate('Pārdot', `Tavā inventārā nav ${stringifyItems(itemArr)}`))
        return 1
      } else {
        message.reply(itemTemplate('Pārdot',
          `Tu pārdevi ${stringifyItems(itemArr)} par ${total} latiem\nTev tagad ir ${
          (result.lati + total).toFixed(2)} ${latsOrLati(result.lati + total)}`))
      }
    }

    await addLati(guildId, userId, total)
    await addItems(guildId, userId, itemArr, 0)
    return 1
  },
}