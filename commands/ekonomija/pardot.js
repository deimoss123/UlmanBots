import { itemList } from '../../itemList.js'
import { addItems, findUser, addLati } from '../../ekonomija.js'
import { stringifyItems, latsOrLati } from '../../helperFunctions.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Pārdot',
  description: 'Pārdot preci no inventāra\nPārdot neizmantojamos atkritumus - `.pardot a`\n' +
    'Pārdot neizmantojamās zivis - `.pardot z`\nPārdot visu inventāru - `.pardot visu`',
  commands: ['pardot'],
  cooldown: 1000,
  expectedArgs: '<preces numurs> <daudzums>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, _, _1, i = 0) => {
    let userId = message.author.id
    const guildId = message.guildId

    let items = {}
    let total = 0

    // pārdot visus nelietojamos atkritumus vai zivis
    if (!args[1] && (args[0] === 'a' || args[0] === 'z' || args[0] ===  'visu')) {
      let type
      if (args[0] === 'a') type = 'atkritumi'
      else if (args[0] === 'z') type = 'zivis'
      else if (args[0] === 'visu') type = 'visu'

      const result = await findUser(guildId, userId)

      if (!Object.keys(result.items).length) {
        message.reply(embedError(message, 'pārdot', 'Tev nav ko pārdot'))
        return 2
      }

      if (type !== 'visu') {
        // pārbauda vai ir zivis/atkritumi ko izmantot
        Object.keys(result.items).map(key => {
          if (itemList[type][key]) {
            if (!itemList[type][key].use) {
              items[key] = result.items[key]
              total += itemList[type][key].price * items[key]
            }
          }
        })
      } else {
        Object.keys(result.items).map(key => {
          Object.keys(itemList).map(category => {
            if (itemList[category][key]) {
              items[key] = result.items[key]
              total += itemList[category][key].price * items[key]
            }
          })
        })
      }


      // pārbauda vai ir ko pārdot
      if (Object.keys(items).length) {
        const reply = embedTemplate(message, 'Pārdot', `Tu pārdevi ${stringifyItems(
          items)}, un ieguvi **${floorTwo(total).toFixed(2)}** latus\nTev tagad ir ${(result.lati +
          total).toFixed(
          2)} ${latsOrLati(result.lati + total)}`, type === 'visu' ? null : type)

        //if (i) i.reply(reply)
        message.reply(reply)

      } else {
        message.reply(embedTemplate(message, 'Pārdot', `Tev nav ${type} ko pārdot`,
          `${type === 'zivis' ? imgLinks.zivis[11] : type}`))
        return 2
      }
    } else { // pārdot atsevišķu preci

      // pārbaudīt sintaksi
      if (isNaN(parseInt(args[0])) || (isNaN(parseInt(args[1])) && args[1])) return 0

      const amount = args[1] ? parseInt(args[1]) : 1
      const index = parseInt(args[0]) - 1

      // pārbaudīt vai ievadītais daudzums nav mazāks par 1
      if (amount < 1) {
        message.reply(
          embedError(message, 'pārdot', `Tu nevari pārdot ${amount} lietas, ļoti smieklīgi`))
        return 2
      }

      const result = await findUser(guildId, userId)

      if (index >= Object.keys(result.items).length || index < 0) {
        message.reply(embedError(message, 'pārdot', 'Ko tu vēlies pārdot?'))
        return 2
      }

      let resultKey, imgurl, i = 0

      Object.keys(result.items).map(key => {
        if (i === index) {
          Object.keys(itemList).map(keydb => {
            if (itemList[keydb][key]) {
              total = itemList[keydb][key].price * amount
              items[key] = amount
              resultKey = key

              imgurl = itemList[keydb][key].url
            }
          })
        }
        i++
      })

      // pārbauda vai lietotājam ir tik daudz itemu
      if (result.items[resultKey] < amount) {
        message.reply(
          embedTemplate(message, 'Pārdot', `Tavā inventārā nav ${stringifyItems(items)}`, imgurl))
        return 2
      } else {
        message.reply(embedTemplate(message, 'Pārdot',
          `Tu pārdevi ${stringifyItems(items)} par **${total}** latiem\nTev tagad ir ${
            (result.lati + total).toFixed(2)} ${latsOrLati(result.lati + total)}`, imgurl))
      }
    }

    Object.keys(items).map(item => items[item] *= -1)

    await addLati(guildId, userId, total)
    await addItems(guildId, userId, items)
    return 1
  },
}