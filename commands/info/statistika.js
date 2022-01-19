import { getUserId } from '../../helperFunctions.js'
import { findUser, getTop } from '../../ekonomija.js'
import { embedSaraksts, embedTemplate } from '../../embeds/embeds.js'
import { calcInvValue } from './inventars.js'
import { okddId } from '../../index.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const dataArr = {
  'Lielākais maks': 'maxMaksLati',
  'Iztērēts veikalā': 'spentShop',
  'Pārdotas preces': 'soldAmount',
  'Samaksāts nodoklis': 'taxPaid',
  'Maksātā nauda': 'sentMoney',
  'Saņemtā nauda': 'receivedMoney',
  'Nozagts': 'gainedLatiUser',
  'Pazaudēts zogot': 'lostLatiUser',
  'Lielākais feniksa laimests': 'maxFeniksWin',
  'Lielākā feniksa likme': 'maxFeniksLikme',
  'Feniksā iztērēts': 'feniksSpend',
  'Fēniksā uzvarēts': 'feniksWin',
  'Fēniksa griezienu skaits': 'feniksCount',
}

const getName = (title, index) => {
  let name = `${title} `

  if (index) switch (index) {
    case 0:
      break
    case 1:
      name += ':first_place:'
      break
    case 2:
      name += ':second_place:'
      break
    case 3:
      name += ':third_place:'
      break
    default:
      name += `\`#${index}\``
      break
  }

  return name
}

export default {
  title: 'Statistika',
  description: 'Apskatīt savu servera statistiku',
  commands: ['statistika', 'stats', 'dati', 'stati'],
  cooldown: 10000,
  maxArgs: 2,
  expectedArgs: '<@lietotājs>',
  callback: async (message, args) => {
    let { guildId } = message
    let targetId = message.author.id

    if (args[1] && targetId === process.env.DEVUSERID) {
      guildId = okddId
      targetId = args[0]
    } else if (args[0]) {
      const resultId = await getUserId(args[0], message.guild)

      if (!resultId) return 0

      targetId = resultId
    }

    const user = await findUser(guildId, targetId)
    const allUsers = await getTop(guildId)

    const banka = allUsers.find(obj => obj['_id'] === `${guildId}-${process.env.ULMANISID}`)
    allUsers.splice(allUsers.indexOf(banka), 1)

    const findIndexSort = (title, key) => {
      let index = 0

      const reducedArr = allUsers.filter(user => {
        if (user?.data) if (user.data[key]) return user.data[key]
      })

      if (user.data[key] && reducedArr.length) index = reducedArr.sort(
        (a, b) => b.data[key] - a.data[key])
        .findIndex(u => u.userId === targetId) + 1

      const value = key === 'feniksCount'
        ? (user.data[key] ? user.data[key] : '0') + ' griezieni'
        : (user.data[key] ? floorTwo(user.data[key]).toFixed(2) : '0.00') + ' lati'

      return {
        name: getName(title, index),
        value,
        inline: true,
      }
    }

    // .statistika 517429149543956480 1    martinsons
    // .statistika 598597835960877067 1    edzha
    // .statistika 571398169359810562 1    henrijs
    // .statistika 239853664557203456 1    stomps

    let resultArr = [
      {
        name: getName('Maks', allUsers.sort((a, b) => b.lati - a.lati)
          .findIndex(u => {
            if (u.lati) return u.userId === targetId
          }) + 1),
        value: `${floorTwo(user.lati).toFixed(2)} lati`,
        inline: true,
      }, {
        name: getName(
          'Inventārs', allUsers.sort((a, b) => calcInvValue(b.items) - calcInvValue(a.items))
          .findIndex(u => {
            if (calcInvValue(u.items)) return u.userId === targetId
          }) + 1),
        value: `${floorTwo(calcInvValue(user.items)).toFixed(2)} lati`,
        inline: true,
      }, ...Object.keys(dataArr).map(r => findIndexSort(r, dataArr[r])),
    ]

    message.reply(embedSaraksts(message,
      'Statistika',
      targetId === message.author.id ? '' : `<@${targetId}>`,
      resultArr, '', 0xecf22e))

    return 1
  },
}