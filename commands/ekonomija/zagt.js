import { chance, getUserId } from '../../helperFunctions.js'
import { addData, addLati, addStatus, checkStatus, findUser } from '../../ekonomija.js'
import { embedTemplate, noPing } from '../../embeds/embeds.js'
import { statusList } from '../../itemList.js'

const zagtChange = {
  default: {
    win: { chance: '*' }, // 0.40 },
    lose: { chance: 0.60 },
  },
  nazis: {
    win: { chance: '*' }, // 0.60 },
    lose: { chance: 0.4 },
  },
}

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Zagt',
  description: 'Apzagt kādu lietotāju',
  commands: ['zagt', 'apzagt'],
  cooldown: 600000,
  expectedArgs: '<@lietotājs>',
  maxArgs: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    const maxLatiBanka = 1100

    const winCh = 1 -
      zagtChange.nazis.lose.chance

    if (!args[0]) {
      message.reply(embedTemplate(message, '',
        `**Zagt no bankas** \`.zagt @UlmaņBots\`\n` +
        `- Nav iespēja zaudēt naudu zogot no bankas\n` +
        `- Iespēja nozagt maksimāli **${maxLatiBanka}** latus\n` +
        `- Ja bankai ir mazāk par ${maxLatiBanka} latiem, tad tiks nozagta visa bankas nauda\n` +
        '- Nepieciešami visi statusi (`.status`), zogot no bankas visi statusi noņemsies\n\n' +

        '**Zagt no lietotāja** `.zagt @lietotājs`\n' +
        '**Procenti**\n40% nozagt\n60% pazaudēt naudu\n\n' +

        '**Procenti zogot ar laupītāja statusu (nazis)**\n' +
        `${Math.round(winCh * 100)}% nozagt\n` +
        `${zagtChange.nazis.lose.chance * 100}% pazaudēt naudu\n` +

        'Maksimālais nozagtais/pazaudētas latu daudzums ir atkarīgs no tā kuram ir vismazāk nauda\n\n' +
        '**Piemērs:** Jānim ir 20 lati un viņš grib zagt no Reiņa, kam ir 100 lati, šajā gadījumā maksimālais ko Jānis varēs nozagt vai pazaudēt būs 20 lati'
      ))
      return 2
    }

    let targetId = await getUserId(args[0], message.guild)
    if (!targetId) return 0

    if (await checkStatus(guildId, userId, 'aizsardziba') && targetId !== process.env.ULMANISID) {
      message.reply(noPing('Tu nevari zagt kamēr tev ir aizsardzība'))
      return 2
    }

    if (targetId === userId) {
      message.reply(noPing('Tu nevari nozagt no sevis'))
      return 2
    }

    if (await checkStatus(guildId, targetId, 'aizsardziba') && targetId !== process.env.ULMANISID) {
      message.reply(noPing(`Tu nevari zagt no <@${targetId}>, jo viņam ir aizsardzība`))
      return 2
    }

    const user = await findUser(guildId, userId)
    const target = await findUser(guildId, targetId)

    // zagšana no valsts bankas
    if (targetId === process.env.ULMANISID) {
      for (const key in statusList) {
        if (!await checkStatus(guildId, userId, `${key}`)) {
          message.reply(noPing(
            'Lai zagtu no valsts bankas ir nepieciešami **visi** statusi\n' +
            'Savus status var apskatīt izmantojot komandu `.status`'))
          return 2
        }
      }

      let lati = target.lati
      if (target.lati >= maxLatiBanka) lati = maxLatiBanka

      message.reply(embedTemplate(message, 'Zagt',
      `Tu nozagi **${floorTwo(lati).toFixed(2)}** latus no valsts bankas un pazaudēji visus statusus`))
      
      const status = {}
      Object.keys(statusList).map(key => status[key] = -10000000000)
      
      await addStatus(guildId, userId, status)
      await addLati(guildId, userId, lati)
      await addLati(guildId, targetId, lati * -1)
      return 1
    }

    // parastā zagšana
    if (user.lati <= 30 || target.lati <= 30) {
      message.reply(noPing(`Gan tev, gan <@${targetId}> ir jābūt vismaz 30 latiem`))
      return 2
    }

    const maxSteal = target.lati > user.lati ? user.lati : target.lati

    let randChance = floorTwo((( Math.random() * 0.3 ) + 0.2 ))

    // pārbauda vai ir laupītāja statuss
    const type = await checkStatus(guildId, userId, 'laupitajs') ? 'nazis' : 'default' 

    let resultText, stolen = 0
    switch (chance(zagtChange[type])) {
      case 'win':
        stolen = randChance * maxSteal
        resultText = `Tu nozagi ${floorTwo(stolen).toFixed(2)} latus no <@${targetId}> `
        break
      case 'lose':
        stolen = randChance * maxSteal * -1
        resultText = `Zogot no <@${targetId}> tu pazaudēji ${floorTwo(stolen * -1).toFixed(2)} latus`
        break
    }

    message.reply(embedTemplate(message, 'Zagšana', resultText, '', 0xd98736))
    await addLati(guildId, userId, stolen)
    await addLati(guildId, targetId, stolen * -1)

    let dataUser = {}
    let dataTarget = {}

    if (stolen < 0) {
      // lati ko ir pazaudējis lietotājs zogot no kāda
      dataUser.lostLatiUser = stolen * -1
      // lati ko ir ieguvis otrs lietotājs, kad no viņa zogot komandas lietotājs ir zaudējis naudu
      dataTarget.gainedLatiTarget = stolen * -1
    }
    else {
      // lati ko ir ieguvis lietotājs zogot no kāda
      dataUser.gainedLatiUser = stolen
      // lati ko ir zaudējis otrs lietotājs, kad no viņa zogot komandas lietotājs ir nozadzis naudu
      dataTarget.lostLatiTarget = stolen
    }

    await addData(guildId, userId, dataUser)
    await addData(guildId, targetId, dataTarget)
    return 1
  }
}