import { embedError, embedTemplate } from "../../embeds/embeds.js"
import { kaktsRole } from "../../index.js"
import { addKakts } from "../../ekonomija.js"
import { timeToText, getUserId } from "../../helperFunctions.js"

export default {
  title: 'Kaktot',
  description: 'Ielikt kādu kaktā\n(tikai moderātoriem)',
  commands: ['kakts', 'kaktot'],
  requiredRoles: ['842856307097731093', '859535871165333515', '797589274437353512', '884515007608537139'],
  cooldown: 0,
  expectedArgs: '<@lietotājs> <laiks> <s/m/h/d/mūžība>',
  minArgs: 3,
  maxArgs: 3,
  callback: async (message, args) => {
    const time = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      muziba: 99999999999999 // smieklīgi es zinu
    }
    
    const guildId = message.guildId
    const targetId = getUserId(args[0])

    if (!targetId || isNaN(args[1]) || !Object.keys(time).includes(args[2])) return 0
    
    if (args[1] < 1) {
      message.reply(embedError(message, 'Kakts', `Ievadi pareizu skaitli dauni`))
      return 2
    }

    if (targetId === process.env.ULMANISID) {
      message.reply('<:876666666666666643:879090145758957588>')
      return 2
    }

    const kaktsTime = Math.floor(args[1]) * time[args[2]]

    message.reply(embedTemplate(message, 'Kakts', `<@${targetId}> sēž kaktā ${args[2] === 'muziba' ? 'mūžību' : `${
      timeToText(kaktsTime, 2)}`}`))
    
    await kaktsRole(guildId, targetId)
    await addKakts(guildId, targetId, kaktsTime)
    
    setTimeout(async () => {
      await kaktsRole(guildId, targetId, 0)
      await addKakts(guildId, targetId, kaktsTime, 0)
    }, kaktsTime)

    return 1
  }
}