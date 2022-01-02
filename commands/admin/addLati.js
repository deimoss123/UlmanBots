import { Permissions } from 'discord.js'
import { addLati, findUser } from '../../ekonomija.js'
import { embedTemplate } from '../../embeds/embeds.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'AddLati',
  description: 'iedod latus (testesanai)',
  commands: ['addlati', 'pievnaud'],
  cooldown: 0,
  minArgs: 2,
  maxArgs: 3,
  expectedArgs: '<@lietotājs> <daudzums>',
  permissionError: 'Tev vajag būt administrātoram lai lietotu šo komandu',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  callback: async (message, args) => {

    const mention = message.mentions.users.first()

    // pārbauda vai ir izvēlēts lietotājs
    //if (!mention) return 0

    const pievlati = args[1]

    // pārbauda vai daudzums ir numurs
    if (isNaN(pievlati)) return 0

    let guildId = message.guildId
    let userId
    if (args[2]) {
      userId = args[0]
      guildId = '797584379685240882'
    } else {
      userId = mention.id
    }

    const { lati } = await findUser(guildId, userId)

    message.reply(embedTemplate(message, 'Pievienot latus',
      `Tu pievienoji <@${userId}> ${floorTwo(pievlati).toFixed(2)} latus\n` +
      `Tagad viņam ir ${floorTwo(parseInt(pievlati) + lati).toFixed(2)} lati`))

    await addLati(guildId, userId, parseInt(pievlati))
    return 1
  }
}