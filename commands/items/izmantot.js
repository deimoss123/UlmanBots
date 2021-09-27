import { itemList } from '../../itemList.js'
import { addItems, findUser } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Izmantot',
  description: 'Izmantot kādu lietu no inventāra',
  commands: ['izmantot', 'lietot'],
  cooldown: 5000,
  expectedArgs: '<lietas numurs>',
  maxArgs: 2,
  minArgs: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    if (isNaN(args[0])) return 0
    args[0] = Math.floor(args[0])

    const result = await findUser(guildId, userId)

    if (args[0] <= 0 || Object.keys(result.items).length < args[0]) {
      message.reply(embedError('Izmantot', 'Tavā inventārā nav šāda lieta'))
      return 2
    }

    const selectedItem = Object.keys(result.items)[args[0] - 1]

    for (const key in itemList) {
      if (itemList[key][selectedItem]) {
        if (!itemList[key][selectedItem].use) {
          message.reply(
            embedError('Izmantot', `${itemList[key][selectedItem].nameNomVsk} nav izmantojams`))
          return 2
        } else {
          let item = {}
          item[selectedItem] = -1
          await addItems(guildId, userId, item)
          const text = await itemList[key][selectedItem].use(message, result, args)
          message.reply(
            embedTemplate(`Izmantot - ${itemList[key][selectedItem].nameAkuVsk}`, text, itemList[key][selectedItem].url))
          return 1
        }
      }
    }
  },
}