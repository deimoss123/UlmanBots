import { findUser } from '../../ekonomija.js'
import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { embedTemplate } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Maks',
  description: 'Apskatīt savu, vai kāda cita lietotāja latu daudzumu',
  commands: ['maks', 'm', 'makste', 'maksts'],
  cooldown: 1000,
  maxArgs: 1,
  expectedArgs: '<@lietotājs>',
  callback: async (message, args) => {
    const guildId = message.guildId
    let targetId = message.author.id
    const userId = targetId

    // pārbauda vai ir ievadīts lietotājs, ja nav tad izvēlāts tad lietotājs būs ziņas autors
    if (args[0]) {
      const resultId = await getUserId(args[0], message.guild)
      if (!resultId) {
        return 0
      } else {
        targetId = resultId
      }
    }

    const { lati } = await findUser(guildId, targetId)

    let img = 0

    // izvēlās embed bildi atkarībā no naudas daudzuma
    if (lati >= 100) img = 1
    if (lati >= 500) img = 2
    if (lati >= 1000) img = 3
    if (lati >= 5000) img = 4

    let user, maksImg
    if (targetId === process.env.ULMANISID) {
      user = 'Valsts bankai'
      maksImg = imgLinks.ulmanis
    } else if (targetId === userId) {
      user = 'Tev'
      maksImg = imgLinks.maks[img]
    } else {
      user = `<@${targetId}>`
      maksImg = imgLinks.maks[img]
    }

    message.reply(embedTemplate(message, 'Maks',
      ` ${user} ir **${floorTwo(lati).toFixed(2)}** ${latsOrLati(lati)}`, maksImg, 0x9d2235))
    return 1
  },
}