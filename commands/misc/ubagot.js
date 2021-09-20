import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, addLati } from '../../ekonomija.js'
import { embedTemplate } from '../../embeds/embeds.js'
import { latsOrLati } from '../../helperFunctions.js'

export default {
  title: 'Ubagot',
  description: '',
  maxArgs: 0,
  callback: async (message) => {
    const guildId = message.guildId
    const userId = message.author.id

    // 30% iespēja ka ubagojot ir iespēja dabūt 1 lietu no bomžošanas
    const item = Math.random() <= 0.3 ? chance(itemList.atkritumi) : null

    // izvēlās cik naudu var dabūt no ubagošanas
    const lati = Math.floor((Math.random() * 5) + 3)

    // rezultāts
    message.reply(embedTemplate('Ubagot',
      `Tu noubagoji ${lati} ${latsOrLati(lati)} ${item ? 'un ' + stringifyItems([item]) : ''}`,
      'ubagot'))

    await addLati(guildId, userId, lati)
    if (item) await addItems(guildId, userId, [item], 1)

    return 1
  },
}