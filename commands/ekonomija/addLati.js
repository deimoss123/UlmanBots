import { Permissions } from 'discord.js'
import { addLati } from '../../ekonomija.js'

export default {
  title: 'addLati',
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: '<@lietotājs> <daudzums>',
  permissionError: 'Tev vajag būt administrātoram lai lietotu šo komandu',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  callback: async (message, args) => {

    const mention = message.mentions.users.first()

    // pārbauda vai ir izvēlēts lietotājs
    if (!mention) return 0

    const lati = args[1]

    // pārbauda vai daudzums ir numurs
    if (isNaN(lati)) return 0

    const guildId = message.guildId
    const userId = mention.id

    const newLati = await addLati(guildId, userId, lati)
    message.reply(`Tu iedevi <@${userId}> ${lati} latus. Viņam tagad ir ${newLati} lati`)
    return 1
  }
}