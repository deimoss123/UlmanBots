import { itemList } from '../../itemList.js'
import { addItems, findUser } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Izmantot',
  description: 'Izmantot kādu lietu no inventāra',
  commands: ['izmantot', 'lietot'],
  cooldown: 1000,
  expectedArgs: '<lietas numurs>',
  maxArgs: 2,
  minArgs: 1,
  callback: async (message, args, _, _1, i = 0, itemToUse) => {
    const guildId = message.guildId
    const userId = message.author.id

    if (isNaN(args[0])) return 0
    args[0] = Math.floor(args[0])

    const result = await findUser(guildId, userId)

    if (args[0] <= 0 || Object.keys(result.items).length < args[0]) {
      message.reply(embedError(message, 'Izmantot', 'Tavā inventārā nav šāda lieta'))
      return 2
    }

    let selectedItem
    if (!itemToUse) selectedItem = Object.keys(result.items)[args[0] - 1]
    else selectedItem = itemToUse

    for (const key in itemList) {
      if (itemList[key][selectedItem]) {
        if (!itemList[key][selectedItem].use) {
          message.reply(
            embedError(message, 'Izmantot',
              `${itemList[key][selectedItem].nameNomVsk} nav izmantojams`,
              itemList[key][selectedItem].url))
          return 2
        } else {
          let item = {}
          item[selectedItem] = -1
          const text = await itemList[key][selectedItem].use(message, result, args)

          const reply = embedTemplate(message, `Izmantot - ${itemList[key][selectedItem].nameAkuVsk}`, text,
            itemList[key][selectedItem].url)

          if (i) i.reply(reply)
          else message.reply(reply)

          await addItems(guildId, userId, item)
          return 1
        }
      }
    }
  },
}