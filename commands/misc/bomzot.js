import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems } from '../../ekonomija.js'
import { embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Bomžot',
  description: 'Iet atkritumu meklējumos',
  commands: ['bomzot', 'bomzis'],
  cooldown: 10000,
  callback: async (message) => {
    const guildId = message.guildId
    const userId = message.author.id

    let items = {}

    // izvēlās atkritumu daudzumu
    const itemCount = Math.floor((Math.random() * 5) + 1)

    // izvēlās randomā noteiktu itemu daudzumu
    for (let i = 0; i < itemCount; i++) {
      const item = chance(itemList.atkritumi)
      items[item] = items[item] ? items[item] + 1 : 1
    }

    await addItems(guildId, userId, items)

    message.reply(embedTemplate('Bomžot', `Tu atradi ${stringifyItems(items)}`, 'atkritumi'))
    return 1
  },
}