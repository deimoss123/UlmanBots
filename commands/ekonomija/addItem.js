import { Permissions } from 'discord.js'
import { addItems } from '../../ekonomija.js'

export default {
  title: 'AddItem',
  description: 'iedod itemu (testesanai)',
  commands: ['additem'],
  minArgs: 2,
  expectedArgs: '<@lietotājs> <item>',
  permissionError: 'Tev vajag būt administrātoram lai lietotu šo komandu',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  callback: async (message, args) => {
    const mention = message.mentions.users.first()

    if (!mention) return 0

    args.shift()
    const temp = parseInt(args.shift())
    let items = []

    args.map(item => {
      items.push(item)
    })

    console.log(items)

    const guildId = message.guildId
    const userId = mention.id


    console.log(temp)

    await addItems(guildId, userId, items, temp)
    message.reply(`Tu iedevi <@${userId}> ${items}`)
    return 1
  }
}
