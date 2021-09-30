import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, checkStatus } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'

export default {
  title: 'Zvejot',
  description: 'Zvejot dižlatvijas ezeros',
  commands: ['zvejot', 'makskeret'],
  cooldown: 1000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    if (!await checkStatus(guildId, userId, 'zvejotajs')) {
      message.reply(embedError(message, 'Zvejot',
        'Lai zvejotu tev vajag būt zvejotājam, nopērc no veikala makšķeri un izmanto to'))
      return 2
    } else {
      let item = {}
      item[chance(itemList.zivis)] = 1
      message.reply(embedTemplate(message, 'Zvejošana', `Tu nozvejoji ${stringifyItems(item)}`))
      await addItems(guildId, userId, item)
    }
  },
}