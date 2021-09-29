import { getUserId } from "../../helperFunctions.js"
import { addKakts } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import { kaktsRole } from '../../index.js'

export default {
  title: 'Izkaktot (moderātoriem)',
  description: 'Izņemt kādu laukā no kakta',
  commands: ['izkaktot', 'atkaktot'],
  cooldown: 0,
  expectedArgs: '<@lietotājs>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const targetId = getUserId(args[0])

    if (!targetId) return 0

    if (!await addKakts(guildId, targetId, 0, 0)) {
      message.reply(embedError('Izkaktot', `Nevar izkaktot <@${targetId}>, jo viņš nav kaktā`))
    } else {
      message.reply(embedTemplate('Izkaktot', `<@${targetId}> veiksmīgi izkaktots`))
    }

    await kaktsRole(guildId, targetId, 0)
    return 1
  }
}