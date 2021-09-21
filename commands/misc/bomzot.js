import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems } from '../../ekonomija.js'
import { embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Bomžot',
  description: 'Iet atkritumu meklējumos',
  commands: ['bomzot', 'bomzis'],
  callback: async (message) => {
    const guildId = message.guildId
    const userId = message.author.id

    let acquiredItems = []
    let acquiredItem

    // izvēlās atkritumu daudzumu
    const itemCount = Math.floor((Math.random() * 5) + 1)

    // izvēlās randomā noteiktu itemu daudzumu
    for (let i = 0; i < itemCount; i++) {
      acquiredItem = chance(itemList.atkritumi)
      acquiredItems.push(acquiredItem)
    }

    // beigu rezultāts
    const resultString = stringifyItems(acquiredItems)
    message.reply(embedTemplate('Bomžot', `Tu atradi ${resultString}`, 'atkritumi'))

    await addItems(guildId, userId, acquiredItems, 1)

    return 1
  },
}