import { embedTemplate } from './embeds/embeds.js'
import { kaktsRole } from './index.js'
import { addKakts } from './ekonomija.js'

const limit = 10
const timeframe = 15000


const msgCache = {}

export const antispam = async message => {
  const guildId = message.guildId
  const userId = message.author.id

  if (!msgCache[`${guildId}-${userId}`]) {
    msgCache[`${guildId}-${userId}`] = 1
    setTimeout(() => {
      delete msgCache[`${guildId}-${userId}`]
    }, timeframe)
  } else {
    msgCache[`${guildId}-${userId}`] += 1
    if (msgCache[`${guildId}-${userId}`] >= limit) {
      message.reply(embedTemplate(message,'Spams', 'Ej dirst, spamotāj, pasēdi kaktā stundu'))
      await kaktsRole(guildId, userId)
      await addKakts(guildId, userId, 3600000)
      delete msgCache[`${guildId}-${userId}`]
    }
  }
}