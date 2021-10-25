import { embedTemplate } from './embeds/embeds.js'
import { kaktsRole } from './index.js'
import mongo from './mongo.js'
import mutesSchema from './schemas/mutes-schema.js'
import { settingsCache } from './commands/admin/iestatijumi.js'

const limit = 10
const sameMsgLimit = 3
const timeframe = 15000

const kaktsTime = 3600000

const msgCache = {}

export const antispam = async message => {
  const guildId = message.guildId
  const userId = message.author.id
  if (settingsCache[guildId]?.spamChannels?.length) {
    if (settingsCache[guildId].spamChannels.includes(message.channelId)) {
      return
    }
  }

  if (!msgCache[`${guildId}-${userId}`]) {
    msgCache[`${guildId}-${userId}`] = {
      count: 1,
      sameMsgCount: 1,
      lastMsg: message.content
    }
    setTimeout(() => {
      delete msgCache[`${guildId}-${userId}`]
    }, timeframe)
  } else {
    msgCache[`${guildId}-${userId}`].count += 1
    if (msgCache[`${guildId}-${userId}`].lastMsg === message.content)
      msgCache[`${guildId}-${userId}`].sameMsgCount++

    if (msgCache[`${guildId}-${userId}`] >= limit || msgCache[`${guildId}-${userId}`].sameMsgCount >= sameMsgLimit) {
      await mongo().then(async mongoose => {
        try {
          let kakti = await mutesSchema.find()

          kakti = kakti.filter(kakts => {
            return !kakts.current && kakts.userId === userId
          })

          if (kakti.length) {
            message.reply(embedTemplate(message,'Spams', 'Ej dirst, spamotāj, pasēdi kaktā stundu'))
            await kaktsRole(guildId, userId)
            await mutesSchema.findOneAndUpdate({ userId, guildId }, {
              adminId: process.env.ULMANISID,
              expires: kaktsTime + Date.now(),
              current: true,
            }, {})
          }
        } catch (e) {
          console.error(e)
        }
      })
    }
  }
}