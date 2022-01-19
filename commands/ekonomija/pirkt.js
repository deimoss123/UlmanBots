import { addItems, findUser, addLati, addData } from '../../ekonomija.js'
import {
  buttonEmbed,
  embedSaraksts,
  noPing,
} from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import {
  stringifyItems,
  latsOrLati,
  stringifyItemsList2,
} from '../../helperFunctions.js'
import izmantot from './izmantot.js'
import { getDiscounts } from './veikals/veikals.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const updateIzmantotRow = (rand, count) => {
  return [{
    type: 1,
    components: [{
      type: 2,
      label: `Izmantot (${count})`,
      style: count <= 0 ? 2 : 1,
      custom_id: `izman ${rand}`,
      disabled: count <= 0
    }]
  }]
}

export default {
  title: 'Pirkt',
  description: 'Nopirkt preci no veikala',
  commands: ['pirkt'],
  cooldown: 0,
  expectedArgs: '<preces id> <daudzums>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, _, _1, item = {}) => {
    const { guildId } = message
    const userId = message.author.id

    // pārbaudīt sintaksi
    if (args[1] && isNaN(parseInt(args[1]))) return 0

    // izveidot daudzumu un indeksu
    const amount = args[1] ? parseInt(args[1]) : 1

    // pārbaudīt vai ievadītais daudzums nav mazāks par 1
    if (amount < 1) {
      message.reply(noPing(`Tu nevari nopirkt ${amount} preces, ļoti smieklīgi`))
      return 2
    }

    let key, total

    key = Object.keys(itemList.veikals).find(itemdb => {
      if (itemList.veikals[itemdb]) {
        if (itemList.veikals[itemdb].ids.includes(args[0])) {
          total = itemList.veikals[itemdb].price * 2 * amount
          item[itemdb] = amount
          return 1
        }
      }
    })


    // pārbaudīt vai prece eksistē
    if (!key) {
      message.reply(noPing('Šāda prece neeksistē'))
      return 2
    }

    // pārbauda vai ir atlaide
    const discounts = await getDiscounts()
    if (discounts) if (discounts[key]) total *= discounts[key]

    // pārbaudīt vai pietiek nauda
    const { lati, itemCount, itemCap } = await findUser(guildId, userId)

    if (lati < total) {
      message.reply(embedSaraksts(message, '', '',
        [{
          name: 'Tev nepietiek naudas lai nopirktu:',
          value: stringifyItemsList2(item),
        }, {
          name: 'Cena:',
          value: `${total} ${latsOrLati(total)}`,
          inline: true
        }, {
          name: 'Tev ir',
          value: `${floorTwo(lati).toFixed(2)} ${latsOrLati(lati)}`,
          inline: true
        }]
      , '', 0xffffff))
      return 2
    }

    if (itemCap - itemCount < amount) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(noPing(
        `Tev inventārā nepietiek vietas lai nopirktu ${stringifyItems(item)}\n` +
        `Tev inventarā ir **${vietas}** brīvas vietas `))
      return 2
    }

    let itemObj = {}
    itemObj[item] = amount

    const embedFields = [{
      name: 'Tu nopirki',
      value: stringifyItemsList2(item)
    }, {
      name: 'Tu iztērēji',
      value: `${total.toFixed(2)} latus`,
      inline: true
    }, {
      name: 'Tev palika',
      value: `${floorTwo(lati - total).toFixed(2)} ${latsOrLati(lati - total)}`,
      inline: true
    }]

    // veiksmīgs pirkums
    if (itemList.veikals[Object.keys(item)[0]].use) {

      const rand = Math.floor(Math.random() * 100000)
      let count = amount

      await buttonEmbed({
        message,
        row: updateIzmantotRow(rand, count),
        fields: embedFields,
        color: 0x477507,
        cb: async i => {
          if (i.customId === `izman ${rand}`) {
            return {
              id: `izman ${rand}`,
              editComponents: updateIzmantotRow(rand, --count),
              after: async () => {
                await izmantot.callback(message, ['1'], null, null, i, Object.keys(item)[0])
              }
            }
          }
        }
      })
    } else {
      message.reply(embedSaraksts(message, '', '', embedFields, '', 0x477507))
    }

    await addItems(guildId, userId, item, 1)
    await addLati(guildId, userId, total * -1)
    // pvn valsts bankai
    await addLati(guildId, process.env.ULMANISID, total * 0.1)

    await addData(guildId, userId, { spentShop: total, taxPaid: total * 0.1 })
    return 1
  },
}