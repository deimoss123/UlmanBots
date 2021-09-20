import { addItems, findUser, addLati } from '../../ekonomija.js'
import { embedError, itemTemplate } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import { stringifyItems, latsOrLati } from '../../helperFunctions.js'

export default {
  title: 'Pirkt',
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
      message.reply(embedError('pirkt', 'Šāda prece neeksistē'))
      return 1
    }

    // pārbaudīt vai ievadītais daudzums nav mazāks par 1
    if (amount < 1) {
      message.reply(embedError('pirkt', `Tu nevari nopirkt ${amount} preces, ļoti smieklīgi`))
      return 1
    }

    // atrod veikalā preci un tai nosaka indeksu
    let i = 0
    let item
    for (const key in itemList.veikals) {
      if (index == i) {
        item = key
        break
      }
      i++
    }

    // totālā cena
    const total = itemList.veikals[item].price * 2 * amount

    const result = await findUser(guildId, userId)

    // saliek pērkamās preces itemArr
    let itemArr = []
    for (let i = 0; i < amount; i++) itemArr.push(item)

    // pārbaudīt vai pietiek nauda
    if (result.lati < total) {
      message.reply(embedError('pirkt',
        `Tev nepietiek naudas lai nopirktu ${stringifyItems(itemArr)}\nCena: ${total} ${
          latsOrLati(total)}\nTev ir ${result.lati} ${latsOrLati(result.lati)}`))
      return 1
    }

    // veiksmīgs pirkums
    message.reply(itemTemplate('Pirkt',
      `Tu nopirkti ${stringifyItems(itemArr)} par ${total} latiem\nTev palika ${
      (result.lati - total).toFixed(2)} ${latsOrLati(result.lati - total)}`,
      itemList.veikals[item].url))

    await addItems(guildId, userId, itemArr, 1)
    await addLati(guildId, userId, total * -1)

    return 1
  },
}