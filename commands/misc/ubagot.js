import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, addLati } from '../../ekonomija.js'
import { embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Ubagot',
  description: 'Ubagot uz ielas',
  commands: ['ubagot', 'ubags'],
  cooldown: 10000,
  callback: async (message) => {
    const guildId = message.guildId
    const userId = message.author.id

    // 30% iespēja ka ubagojot ir iespēja dabūt 1 lietu no bomžošanas
    const item = Math.random() <= 0.3 ? chance(itemList.atkritumi) : null

    let itemObj = {}
    itemObj[item] = 1

    // izvēlās cik naudu var dabūt no ubagošanas
    const lati = Math.floor(((Math.random() * 5) + 3) * 100) / 100

    // rezultāts
    message.reply(embedTemplate(message, 'Ubagot',
      `Tu noubagoji **${lati.toFixed(2)}** latus${item ? ` un ${stringifyItems(itemObj)}` : ''}`,
      'ubagot'))


    await addLati(guildId, userId, lati)
    if (item) await addItems(guildId, userId, itemObj)

    return 1
  },
}