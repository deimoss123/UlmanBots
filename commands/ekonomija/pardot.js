import { itemList } from '../../itemList.js'
import { addItems, findUser, addLati, addData } from '../../ekonomija.js'
import {
  stringifyItems,
  latsOrLati,
  stringifyItems2,
  stringifyItemsList2, findItemById, findItem,
} from '../../helperFunctions.js'
import { embedError, embedSaraksts, embedTemplate, noPing } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const sellOptions = {
  a: 'atkritumi',
  z: 'zivis',
  visu: 'visu',
}

export default {
  title: 'Pārdot',
  description: 'Pārdot mantu no inventāra\n' +
    'Pārdot neizmantojamos atkritumus - `.pardot a`\n' +
    'Pārdot neizmantojamās zivis - `.pardot z`\n' +
    'Pārdot visu inventāru - `.pardot visu`',
  commands: ['pardot'],
  cooldown: 1000,
  expectedArgs: '<lietas id> <daudzums>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, _a, _b, isText = 0) => {
    let userId = message.author.id
    const { guildId } = message

    let newItems = {}
    let total = 0

    const { lati, items } = await findUser(guildId, userId)

    if (!Object.keys(items).length) {
      message.reply(noPing('Tev nav ko pārdot'))
      return 2
    }

    // pārdot atsevišķu mantu
    if (!Object.keys(sellOptions).includes(args[0])) {

      const amount = args[1] ? parseInt(args[1]) : 1

      // pārbaudīt vai ievadītais daudzums nav mazāks par 1
      if (amount < 1) {
        message.reply(noPing(`Tu nevari pārdot ${amount} lietas, ļoti smieklīgi`))
        return 2
      }

      const item = findItemById(args[0])

      if (!item) {
        message.reply(noPing('Šada lieta neeksistē'))
        return 2
      }

      const { key: resultKey } = item

      newItems[resultKey] = amount

      // pārbauda vai lietotājam ir tik daudz itemu
      if (items[resultKey] < amount || !items[resultKey]) {
        message.reply(embedSaraksts(message, '', '', [{
          name: 'Tavā inventārā nav',
          value: stringifyItemsList2(newItems)
        }]))
        return 2
      }

      const { price } = findItem(resultKey)
      total = price * amount

    } else {

      // pārdot visus nelietojamos atkritumus vai zivis
      const type = sellOptions[args[0]]

      // pārdot visu
      if (type === 'visu') {
        Object.keys(items).forEach(item => {
          Object.keys(itemList).forEach(category => {
            if (itemList[category][item]) {
              newItems[item] = items[item]
              total += itemList[category][item].price * items[item]
            }
          })
        })
      } else { // pārdot zivis/atkritumus
        Object.keys(items).map(key => {
          if (itemList[type][key]) if (!itemList[type][key]?.use) {
            newItems[key] = items[key]
            total += itemList[type][key].price * items[key]
          }
        })
      }

      // pārbauda vai ir ko pārdot
      if (!Object.keys(newItems).length) {
        message.reply(noPing(`Tev nav ${type} ko pārdot`))
        return 2
      }
    }

    const cmdInfo = {
      itemStr: stringifyItemsList2(newItems),
      latiSold: `${total.toFixed(2)} latus`,
      latiTotal: `${(lati + total).toFixed(2)} ${latsOrLati(lati + total)}`,
    }

    Object.keys(newItems).map(item => newItems[item] *= -1)

    await addLati(guildId, userId, total)
    await addLati(guildId, process.env.ULMANISID, total * 0.1)

    await addItems(guildId, userId, newItems)
    await addData(guildId, userId, { soldAmount: total, taxPaid: total * 0.1 })

    if (isText) return cmdInfo

    message.reply(embedSaraksts(message, '', '', [
      {
        name: 'Tu pārdevi',
        value: cmdInfo.itemStr,
      }, {
        name: 'Tu ieguvi',
        value: cmdInfo.latiSold,
        inline: true,
      }, {
        name: 'Tev tagad ir',
        value: cmdInfo.latiTotal,
        inline: true,
      },
    ], '', 0x52030c))

    return 1
  },
}