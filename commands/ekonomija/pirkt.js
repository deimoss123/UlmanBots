import { addItems, findUser, addLati } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import { stringifyItems, latsOrLati } from '../../helperFunctions.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Pirkt',
  description: 'Nopirkt preci no veikala',
  commands: ['pirkt'],
  cooldown: 2000,
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
      return 1
    }

    // pārbaudīt vai ievadītais daudzums nav mazāks par 1
    if (amount < 1) {
      message.reply(embedError(message, 'pirkt', `Tu nevari nopirkt ${amount} preces, ļoti smieklīgi`))
      return 1
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
    const { lati } = await findUser(guildId, userId)

    if (lati < total) {
      message.reply(embedError(message, 'pirkt',
        `Tev nepietiek naudas lai nopirktu ${stringifyItems(item)}\nCena: ${total} ${
          latsOrLati(total)}\nTev ir ${floorTwo(lati).toFixed(2)} ${latsOrLati(lati)}`))
      return 1
    }

    // veiksmīgs pirkums
    message.reply(embedTemplate(message, 'Pirkt',
      `Tu nopirkti ${stringifyItems(item)} par ${total} latiem\nTev palika ${floorTwo
      (lati - total).toFixed(2)} ${latsOrLati(lati - total)}`,
      itemList.veikals[key].url))

    await addItems(guildId, userId, item, 1)
    await addLati(guildId, userId, total * -1)
    // pvn valsts bankai
    await addLati(guildId, process.env.ULMANISID, total * 0.21)

    return 1
  },
}