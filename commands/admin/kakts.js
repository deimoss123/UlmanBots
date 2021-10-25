import { embedError, embedTemplate } from "../../embeds/embeds.js"
import { timeToText, getUserId } from "../../helperFunctions.js"

import mutesSchema from '../../schemas/mutes-schema.js'
import mongo from '../../mongo.js'
import { kaktsRole } from '../../index.js'
import { settingsCache } from './iestatijumi.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Kaktot',
  description: 'Ielikt kādu kaktā\n(tikai moderātoriem)',
  commands: ['kakts', 'kaktot'],
  cooldown: 0,
  expectedArgs: '<@lietotājs> <laiks> <m/h/d/mūžība>',
  minArgs: 3,
  maxArgs: 3,
  modCommand: 1,
  callback: async (message, args) => {

    const guildId = message.guildId
    const userId = message.author.id
    const targetId = getUserId(args[0])

    if (!settingsCache[guildId].kaktsRole) {
      message.reply(embedError(message, 'Kakts', 'Šajā serverī nevar izmantot kaktu, jo nav iestatīta kakta loma\n' +
        'Kakta lomu var noteikt servera istatījumos ar komandu `.iestatījumi`'))
      return 2
    }


    const time = {
      m: 60000,
      h: 3600000,
      d: 86400000,
      muziba: -1 // smieklīgi es zinu
    }

    if (!targetId) {
      message.reply(embedError(message, 'Kakts', `Tāds lietotājs neeksistē`))
      return 2
    }

    if (args[1] < 1 || args[1] > 100) {
      message.reply(embedError(message, 'Kakts', `Nepareizi ievadīts skaitlis, maksimālais laika cipars ir 100`))
      return 2
    }

    if (!Object.keys(time).includes(args[2])) return 0

    const kaktsTime = Math.floor(args[1]) * time[args[2]]
    let expires = kaktsTime < 0 ? kaktsTime : Date.now() + kaktsTime

    await mongo().then(async mongoose => {
      try {
        const previousMutes = await mutesSchema.find({ userId: targetId })
        console.log(previousMutes)
        await kaktsRole(guildId, targetId)

        const kaktsObj = {
          _id: `${guildId}-${targetId}`,
          userId: targetId,
          guildId,
          adminId: userId,
          expires,
          current: true
        }

        if (!previousMutes.length){
          await new mutesSchema(kaktsObj).save()
        } else {
          await mutesSchema.findOneAndUpdate({ userId: targetId, guildId }, kaktsObj, {})
        }
      } catch (e) {
        console.error(e)
      }

    })

    message.reply(embedTemplate(message, 'Kakts',
      `<@${targetId}> tika ielikts kaktā uz ` +
      `${kaktsTime < 0 ? 'mūžību' : timeToText(kaktsTime, 2)}`, imgLinks.kakts))

    return 1
  }
}