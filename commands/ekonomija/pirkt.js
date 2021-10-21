import { addItems, findUser, addLati } from '../../ekonomija.js'
import { buttonEmbed, embedError, embedTemplate } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import { stringifyItems, latsOrLati } from '../../helperFunctions.js'
import izmantot from '../items/izmantot.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Pirkt',
  description: 'Nopirkt preci no veikala',
  commands: ['pirkt'],
  cooldown: 1000,
  expectedArgs: '<preces numurs> <daudzums>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    // pārbaudīt sintaksi
    if (isNaN(args[0]) || (isNaN(parseInt(args[1])) && args[1])) return 0

    // izveidot daudzumu un indeksu
    const amount = args[1] ? parseInt(args[1]) : 1
    const index = parseInt(args[0]) - 1

    // pārbaudīt vai prece eksistē
    if (index >= Object.keys(itemList.veikals).length || index < 0) {
      message.reply(embedError(message, 'pirkt', 'Šāda prece neeksistē'))
      return 2
    }

    // pārbaudīt vai ievadītais daudzums nav mazāks par 1
    if (amount < 1) {
      message.reply(
        embedError(message, 'pirkt', `Tu nevari nopirkt ${amount} preces, ļoti smieklīgi`))
      return 2
    }

    // atrod veikalā preci un tai nosaka indeksu
    let i = 0
    let item = {}
    let key
    for (key in itemList.veikals) {
      if (index == i) {
        item[key] = amount
        break
      }
      i++
    }

    // totālā cena
    const total = itemList.veikals[key].price * 2 * amount

    // pārbaudīt vai pietiek nauda
    const { lati, itemCount, itemCap } = await findUser(guildId, userId)

    if (lati < total) {
      message.reply(embedError(message, 'Pirkt',
        `Tev nepietiek naudas lai nopirktu ${stringifyItems(item)}\nCena: **${total}** ${
          latsOrLati(total)}\nTev ir ${floorTwo(lati).toFixed(2)} ${latsOrLati(lati)}`,
        itemList.veikals[key].url))
      return 2
    }

    if (itemCap - itemCount < amount) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(embedError(message, 'Pirkt',
        `Tev inventārā nepietiek vietas lai nopirktu ${stringifyItems(item)}\n` +
        `Tev inventarā ir **${vietas}** brīvas vietas `))
      return 2
    }

    // veiksmīgs pirkums
    if (itemList.veikals[Object.keys(item)[0]].use) {

      const rand = Math.floor(Math.random() * 100000)
      const butons = [{
        label: 'Izmantot',
        style: 1,
        custom_id: `izman ${rand}`
      }]

      let count = amount

      await buttonEmbed(message, 'Pirkt',
        `Tu nopirki ${stringifyItems(item)} par ${total} latiem\nTev palika ${floorTwo
        (lati - total).toFixed(2)} ${latsOrLati(lati - total)}`,
        itemList.veikals[key].url, butons, async i => {
          if (i.customId === `izman ${rand}`) {
            await izmantot.callback(message, ['1'], null, null, i, Object.keys(item)[0])
            count--
            if (count <= 0) return { id: `izman ${rand}` }
          }
        })
    } else {
      message.reply(embedTemplate(message, 'Pirkt',
        `Tu nopirki ${stringifyItems(item)} par ${total} latiem\nTev palika ${floorTwo
        (lati - total).toFixed(2)} ${latsOrLati(lati - total)}`,
        itemList.veikals[key].url))
    }

    await addItems(guildId, userId, item, 1)
    await addLati(guildId, userId, total * -1)
    // pvn valsts bankai
    await addLati(guildId, process.env.ULMANISID, total * 0.21)

    return 1
  },
}