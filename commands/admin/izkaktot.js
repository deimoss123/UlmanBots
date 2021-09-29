import { getUserId } from "../../helperFunctions.js"
import { addKakts } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import { kaktsRole } from '../../index.js'

export default {
  title: 'Izkaktot',
  description: 'Izņemt kādu laukā no kakta\n(tikai moderātoriem)',
  commands: ['izkaktot', 'atkaktot'],
  requiredRoles: ['842856307097731093', '859535871165333515', '797589274437353512', '884515007608537139'],
  cooldown: 0,
  expectedArgs: '<@lietotājs>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const targetId = getUserId(args[0])

    if (!targetId) return 0

    if (!await addKakts(guildId, targetId, 0, 0)) {
      message.reply(embedError(message, 'Izkaktot', `Nevar izkaktot <@${targetId}>, jo viņš nav kaktā`))
    } else {
      message.reply(embedTemplate(message, 'Izkaktot', `<@${targetId}> veiksmīgi izkaktots`))
    }

    await kaktsRole(guildId, targetId, 0)
    return 1
  }
}