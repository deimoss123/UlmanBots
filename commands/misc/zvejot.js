import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, checkStatus } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Zvejot',
  description: 'Zvejot dižLatvijas ezeros',
  commands: ['zvejot', 'makskeret', 'copet'],
  cooldown: 3600000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    if (!await checkStatus(guildId, userId, 'zvejotajs')) {
      message.reply(embedError(message, 'Zvejot',
        'Lai zvejotu tev vajag būt licencētam zvejniekam, nopērc no veikala zvejošanas licenci un izmanto to'))
      return 2
    } else {
      let item = {}
      item[chance(itemList.zivis)] = 1
      message.reply(embedTemplate(message, 'Zvejošana', `Tu nozvejoji ${stringifyItems(item)}`,
        imgLinks.zivis[11]))
      await addItems(guildId, userId, item)
      return 1
    }
  },
}