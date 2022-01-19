import { itemList } from '../../itemList.js'
import { addItems, findUser } from '../../ekonomija.js'
import { embedError, embedSaraksts, embedTemplate, noPing } from '../../embeds/embeds.js'
import { findItem, findItemById } from '../../helperFunctions.js'
import { getEmoji } from '../../reakcijas/atbildes.js'

export default {
  title: 'Izmantot',
  description: 'Izmantot kādu lietu no inventāra',
  commands: ['izmantot', 'lietot'],
  cooldown: 1000,
  expectedArgs: '<lietas id>',
  maxArgs: 2,
  minArgs: 1,
  callback: async (message, args, _, _1, i, itemToUse = null, isReply = 1) => {

    const { guildId } = message
    const userId = message.author.id

    const { items } = await findUser(guildId, userId)

    let itemName
    let item

    if (itemToUse) {
      item = findItem(itemToUse)
      itemName = itemToUse
    } else {
      const tempItem = findItemById(args[0])
      item = tempItem?.item
      itemName = tempItem?.key
    }

    if (!item) {
      message.reply(noPing('Šāda lieta nepastāv'))
      return 2
    }

    if (!items[itemName]) {
      message.reply(noPing(`Tavā inventārā nav ${getEmoji([`_${itemName}`])} **${item.nameNomVsk}**`))
      return 2
    }

    if (!item.use) {
      message.reply(noPing(`${getEmoji([`_${itemName}`])} **${item.nameNomVsk}** nav izmantojams`))
      return 2
    }

    if (!item.notRemovedOnUse) {
      let itemToRemove = {}
      itemToRemove[itemName] = -1
      await addItems(guildId, userId, itemToRemove)
    }

    const resultText = await item.use(message)

    message.reply(embedSaraksts(message, '', '',[{
      name: `Izmantot: ${getEmoji([`_${itemName}`])} ${item.nameNomVsk}`,
      value: resultText
    }], '', 0x94cf42))

    return 1
  },
}