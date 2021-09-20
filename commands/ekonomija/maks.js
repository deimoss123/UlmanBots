import { findUser } from '../../ekonomija.js'
import { getUserId } from '../../helperFunctions.js'
import { embedTemplate } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Maks',
  maxArgs: 1,
  expectedArgs: '<@lietotājs>',
  callback: async (message, args) => {

    let targetId = message.author.id

    if (args[0]) {
      const resultId = getUserId(args[0])
      if (!resultId) {
        return 0
      } else {
        targetId = resultId
      }
    }

    const guildId = message.guildId
    const userId = targetId

    const info = await findUser(guildId, userId)

    let img = imgLinks.maks[0]

    // yandare dev type beat
    if (info.lati >= 100) {
      img = imgLinks.maks[1]
    }
    if (info.lati >= 500) {
      img = imgLinks.maks[2]
    }
    if (info.lati >= 1000) {
      img = imgLinks.maks[3]
    }
    if (info.lati >= 5000) {
      img = imgLinks.maks[4]
    }

    message.reply(embedTemplate('Maks', `<@${targetId}> ir ${info.lati.toFixed(2)} lati`, img))

    return 1
  },
}