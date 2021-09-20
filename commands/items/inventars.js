import { findUser } from '../../ekonomija.js'
import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { embedSaraksts } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'

export default {
  title: 'Inventārs',
  expectedArgs: '<lapa> <@lietotājs>',
  maxArgs: 2,
  callback: async (message, args, a, client) => {
    let targetId = message.author.id

    if (args[1]) {
      const resultId = getUserId(args[1])
      if (!resultId) {
        return 0
      } else {
        targetId = resultId
      }
    }

    const guildId = message.guildId

    let info = await findUser(guildId, targetId)

    const items = info.items
    console.log(items)

    const avatarUrl = await client.users.cache.find(user => user.id === targetId).avatarURL()
    console.log(avatarUrl)

    if (Object.keys(items).length) {
      let embedFieldArr = []
      let i = 0
      for (const key of Object.keys(items)) {
        let cat // categorija (veikals, atkritumi utt)
        for (const keydb of Object.keys(itemList)) {
          if (itemList[keydb][key]) cat = keydb
        }

        embedFieldArr.push({
          name: `[${embedFieldArr.length + 1}] ${itemList[cat][key].nameNomVsk.charAt(0).
            toUpperCase() +
          itemList[cat][key].nameNomVsk.slice(1)}`,

          value: `daudzums - ${items[key]}\nvērtība - ${itemList[cat][key].price} ${latsOrLati(
            itemList[cat][key].price)}\nlietojams - ${itemList[cat][key].usable ? 'jā' : 'nē'}`,
          inline: true,
        })
        i++
      }
      message.reply(embedSaraksts('Inventārs', `<@${targetId}>`, embedFieldArr, avatarUrl))
    } else {
      message.reply(embedSaraksts('Inventārs', `<@${targetId}>`, [{
          name: 'Tev inventārā nekā nav', value: 'izmanto komandu .bomžot',
        }], avatarUrl))
    }

    return 1
  },
}