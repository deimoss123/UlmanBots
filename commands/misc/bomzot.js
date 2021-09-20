import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems } from '../../ekonomija.js'
import { embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Bomžot',
  description: '',
  maxArgs: 0,
  callback: async (message) => {
    const guildId = message.guildId
    const userId = message.author.id

    const itemCount = Math.floor((Math.random() * 5) + 1)

    let acquiredItems = []
    let acquiredItem

    for (let i = 0; i < itemCount; i++) {
      acquiredItem = chance(itemList.atkritumi)
      acquiredItems.push(acquiredItem)
    }

    const resultString = stringifyItems(acquiredItems)

    message.reply(embedTemplate('Bomžot', `Tu atradi ${resultString}`, 'atkritumi'))

    await addItems(guildId, userId, acquiredItems, 1)

    return 1
  },
}