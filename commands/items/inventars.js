import { findUser } from '../../ekonomija.js'
import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { embedSaraksts } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'

export default {
  title: 'Inventārs',
  description: 'Apskatīt savu, vai kāda cita lietotāja inventāru',
  commands: ['inv', 'i', 'inventars'],
  cooldown: 2000,
  expectedArgs: '<@lietotājs>',
  maxArgs: 1,
  callback: async (message, args, a, client) => {
    const guildId = message.guildId
    let targetId = message.author.id

    // pārbauda vai ir ievadīts lietotājs, ja nav tad izvēlāts tad lietotājs būs ziņas autors
    if (args[0]) {
      const resultId = getUserId(args[0])

      if (resultId) targetId = resultId
      else return 0
    }

    const { items } = await findUser(guildId, targetId)
    const avatarUrl = await client.users.cache.find(user => user.id === targetId).avatarURL()

    // pārbauda vai inventārs nav tukšs
    if (Object.keys(items).length) {
      let embedFieldArr = []
      let i = 0
      for (const key of Object.keys(items)) {
        let item // categorija (veikals, atkritumi utt)
        for (const keydb of Object.keys(itemList)) {
          if (itemList[keydb][key]) {
            item = itemList[keydb][key]
            break
          }
        }

        // izveido inventāra embed sarakstu
        embedFieldArr.push({
          name: `[${embedFieldArr.length + 1}] ${
            item.nameNomVsk.charAt(0).toUpperCase() + item.nameNomVsk.slice(1)}`,
          value: `daudzums - ${items[key]}\nvērtība - ${item.price} ${latsOrLati(
            item.price)}\nlietojams - ${item.use ? 'jā' : 'nē'}`,
          inline: true,
        })
        i++
      }
      message.reply(embedSaraksts('Inventārs', `<@${targetId}>`, embedFieldArr, avatarUrl))
    } else { // inventārs tukšs
      message.reply(embedSaraksts('Inventārs',
        `<@${targetId}>`, [{ name: 'Tukšs inventārs', value: 'izmanto komandu .bomžot' }],
        avatarUrl))
    }

    return 1
  },
}