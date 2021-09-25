import { chance, getUserId } from '../../helperFunctions.js'
import { addLati, findUser } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'

const zagtChange = {
  win: { chance: '*' }, // 0.39 },
  lose: { chance: 0.55 },
  win50: { chance: 0.02 },
  lose50: { chance: 0.02 },
  win100: { chance: 0.01 },
  lose100: { chance: 0.01 },
}

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Zagt',
  description: 'Apzagt kādu lietotāju',
  commands: ['zagt', 'apzagt'],
  cooldown: 1000,
  expectedArgs: '<@lietotājs>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    let targetId = getUserId(args[0])
    if (!targetId) return 0

    const user = await findUser(guildId, userId)
    const target = await findUser(guildId, targetId)

    if (user.lati <= 30 || user.lati <= 30) {
      message.reply(embedError('Zagt', 'Gan tev, gan lietotājam no kā tu zagsi ir jābūt vismaz 30 latiem'))
      return 2
    }

    let maxSteal

    if (target.lati > user.lati) maxSteal = user.lati
    else maxSteal = target.lati

    let randChance = floorTwo((( Math.random() * 0.7 ) + 0.2 ))

    let stolen = 0
    let resultText = ''
    switch (chance(zagtChange)) {
      case 'win':
        stolen = randChance * maxSteal
        resultText = `Tu nozagi ${floorTwo(stolen)} latus <@${targetId}> `
        break
      case 'lose':
        stolen = randChance * maxSteal * -1
        resultText = `Zogot no <@${targetId}> tu pazaudēji ${floorTwo(stolen * -1)} latus`
        break
      case 'win50':
        stolen = target.lati * 0.5
        resultText = `Tu nozagi pusi no <@${targetId}> naudas`
        break
      case 'lose50':
        stolen = user.lati * 0.5 * -1
        resultText = `Zogot no <@${targetId}> tu pazaudēji pusi no savas naudas`
        break
      case 'win100':
        stolen = target.lati
        resultText = `Tu nozagi visu <@${targetId}> naudu`
        break
      case 'lose100':
        stolen = user.lati * -1
        resultText = `Zogot no <@${targetId}> tu pazaudēji visu savu naudu`
        break
    }

    message.reply(embedTemplate('Zagšana', resultText, 'zivis'))
    await addLati(guildId, userId, stolen)
    await addLati(guildId, targetId, stolen * -1)
    return 1
  }
}