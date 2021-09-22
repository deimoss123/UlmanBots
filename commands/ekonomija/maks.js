import { findUser } from '../../ekonomija.js'
import { getUserId } from '../../helperFunctions.js'
import { embedTemplate } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Maks',
  description: 'Apskatīt savu, vai kāda cita lietotāja latu daudzumu',
  commands: ['maks', 'm'],
  cooldown: 2000,
  maxArgs: 1,
  expectedArgs: '<@lietotājs>',
  callback: async (message, args) => {
    const guildId = message.guildId
    let targetId = message.author.id

    // pārbauda vai ir ievadīts lietotājs, ja nav tad izvēlāts tad lietotājs būs ziņas autors
    if (args[0]) {
      const resultId = getUserId(args[0])
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

    message.reply(embedTemplate('Maks', `<@${targetId}> ir ${lati.toFixed(2)} lati`, imgLinks.maks[img]))
    return 1
  },
}