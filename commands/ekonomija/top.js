import { getTop } from '../../ekonomija.js'
import { embedSaraksts } from '../../embeds/embeds.js'
import { latsOrLati } from '../../helperFunctions.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Servera tops',
  description: 'Parāda bagātākos lietotājus serverī',
  commands: ['top', 'oligarhi'],
  cooldown: 10000,
  maxArgs: 0,
  callback: async (message, a, b, client) => {
    const guildId = message.guildId

    const results = await getTop()
    let cirkulacija = 0
    let resultsArr = []

    results.map(result => {
      cirkulacija += result.lati
    })

    const banka = results.find(obj => obj['_id'] === `${guildId}-${process.env.ULMANISID}`)
    results.splice(results.indexOf(banka), 1)

    // saliek top lietotājus resultsArr un izveido embedu
    // max lietotāji kas var būt sarakstā ir 10
    for (let i = 0; i < (results.length < 10 ? results.length : 10); i++) {
      let user = {}
      try {
        user = await client.users.fetch(results[i].userId)
      } catch (e) {
        user = { username: 'Nezināms lietotājs', discriminator: '-' }
      }
      resultsArr.push(
        {
          name: `${i + 1}. ${user.username}${user.discriminator === '-'
            ? ``
            : `#${user.discriminator}`}` + '  `' + floorTwo(results[i].lati / cirkulacija * 100).toFixed(2) + '%`',
          value: `${floorTwo(results[i].lati).toFixed(2)} ${latsOrLati(results[i].lati)}`,
        },
      )
    }

    message.reply(embedSaraksts(message, 'Servera tops',
      `Cirkulācijā ir ${cirkulacija.toFixed(2)} ${latsOrLati(
        cirkulacija)}\nValsts bankai ir ${floorTwo(banka.lati).toFixed(2)} ${latsOrLati(banka.lati)}`, resultsArr))
    return 1
  },
}