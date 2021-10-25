import mongo from '../../mongo.js'
import mutesSchema from '../../schemas/mutes-schema.js'
import { settingsCache } from './iestatijumi.js'
import { embedError, embedSaraksts } from '../../embeds/embeds.js'
import { timeToText } from '../../helperFunctions.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Kaktu saraksts',
  description: 'Apskatīt visus lietotājus, kas ir kaktā',
  commands: ['kakti'],
  cooldown: 0,
  callback: async (message, _, _1, client) => {
    const { guildId } = message

    if (!settingsCache[guildId]?.kaktsRole) {
      message.reply(embedError(message, 'Kakts',
        'Šajā serverī nevar izmantot kaktu, jo nav iestatīta kakta loma\n' +
        'Kakta lomu var noteikt servera istatījumos ar komandu `.iestatījumi`'))
      return 2
    }

    let kaktidb = await mutesSchema.find()
    kaktidb = kaktidb.filter(r => r.current && r.guildId === guildId)

    console.log(kaktidb.length)
    const resultArr = []

    if (kaktidb.length) {
      for (const mutedUser of kaktidb) {
        const user = await client.users.fetch(mutedUser.userId)
        console.log(user, 'user')
        resultArr.push({
          name: `${user.username}#${user.discriminator}`,
          value: `Kaktotājs - <@${mutedUser.adminId}>\n` +
            `Atlikušais laiks ${timeToText(mutedUser.expires - Date.now())}`,
        })
      }

      console.log(resultArr)
      message.reply(embedSaraksts(message, 'Kakti',
        !resultArr.length ? 'Kakts tukšs' : 'Šie lietotāji sēž kaktā', resultArr, imgLinks.kakts))
    }
  },
}