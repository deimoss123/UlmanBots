import { checkStatus, addLati } from "../../ekonomija.js"
import { embedError, embedTemplate } from "../../embeds/embeds.js"

export default {
  title: 'Strādāt',
  description: 'Strādāt veikalā',
  commands: ['stradat', 'darbs'],
  cooldown: 3600000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    if (!await checkStatus(guildId, userId, 'vakcinets')) {
      message.reply(embedError(message, 'Strādāt',
      'Lai strādātu tev vajag būt vakcinētam, vakcīnu vai sertifikātu var atrast atkritumos'))
      return 2
    } else {
      const lati = Math.floor((Math.random() * 20) + 15) 
      message.reply(embedTemplate(message, 'Strādāt', `Tu pastrādāji veikalā un nopelnīji **${lati}** latus`))
      await addLati(guildId, userId, lati)
      return 1
    }
  }
}