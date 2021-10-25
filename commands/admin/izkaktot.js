import { getUserId } from "../../helperFunctions.js"
import { embedError, embedTemplate } from '../../embeds/embeds.js'
import mongo from '../../mongo.js'
import mutesSchema from '../../schemas/mutes-schema.js'
import { kaktsRole } from '../../index.js'
import { settingsCache } from './iestatijumi.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Izkaktot',
  description: 'Izņemt kādu laukā no kakta\n(tikai moderātoriem)',
  commands: ['izkaktot', 'atkaktot'],
  cooldown: 0,
  expectedArgs: '<@lietotājs>',
  minArgs: 1,
  maxArgs: 1,
  modCommand: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const targetId = getUserId(args[0])

    if (!settingsCache[guildId]?.kaktsRole) {
      message.reply(embedError(message, 'Kakts', 'Šajā serverī nevar izmantot kaktu, jo nav iestatīta kakta loma\n' +
        'Kakta lomu var noteikt servera istatījumos ar komandu `.iestatījumi`'))
      return 2
    }

    if (!targetId) return 0

    return await mongo().then(async mongoose => {
      try {
        const previousMutes = await mutesSchema.find({ userId: targetId })

        const target = await message.guild.members.fetch(targetId)

        const hasRole = await target.roles.cache.get(settingsCache[guildId].kaktsRole)

        if (!hasRole || !previousMutes) {
          message.reply(embedError(message, 'Kakts', `<@${targetId}> nav kaktā`))
          return 2
        }

        if (hasRole) {
          await kaktsRole(guildId, targetId, 1)
        }

        if (previousMutes) {
          await mutesSchema.findOneAndUpdate({ userId: targetId, guildId }, { current: false }, {})
        }

        message.reply(embedTemplate(message, 'Kakts', `<@${targetId}> veiksmīgi izkaktots`, imgLinks.kakts))

        return 1
      } catch (e) {
        console.error(e)
      }
    })
  }
}