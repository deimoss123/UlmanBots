import { Permissions } from 'discord.js'
import { addItems } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import { stringifyItems } from '../../helperFunctions.js'
import { itemList } from '../../itemList.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'AddItem',
  description: 'Add item (testesanai)',
  commands: ['additem'],
  cooldown: 0,
  minArgs: 3,
  maxArgs: 4,
  expectedArgs: '<@lietotājs> <nosaukums> <daudzums>',
  permissionError: 'Tev vajag būt administrātoram lai lietotu šo komandu',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  callback: async (message, args) => {

    const mention = message.mentions.users.first()

    const addeditem = args[1]
    const addedcount = args[2]

    let guildId = message.guildId
    let userId
    if (args[3]) {
      userId = args[0]
      guildId = '797584379685240882'
    } else {
      userId = mention.id
    }

    let isValid = 0
    for (const category in itemList) {
      for (const item in itemList[category]) {
        if (item === addeditem) isValid = 1
      }
    }

    if (isNaN(addedcount)) {
      message.reply(embedError(message, 'Add items', `${addedcount} nav skaitlis`))
      return 2
    }

    if (!isValid) {
      message.reply(embedError(message, 'Add items', `${addeditem} nepastāv`))
      return 2
    }

    let newItems = {}
    newItems[addeditem] = parseInt(addedcount)

    message.reply(embedTemplate(message, 'Add items',
      `Tu pievienoji <@${userId}> ${stringifyItems(newItems)}`))

    await addItems(guildId, userId, newItems)
    return 1
  }
}