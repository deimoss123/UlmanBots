import { getTop } from '../../ekonomija.js'
import { embedSaraksts } from '../../embeds/embeds.js'
import { latsOrLati } from '../../helperFunctions.js'

export default {
  title: 'Servera tops',
  description: 'Parāda bagātākos lietotājus serverī',
  commands: ['top', 'oligarhi'],
  cooldown: 10000,
  maxArgs: 0,
  callback: async (message, a, b, client) => {
    const results = await getTop()
    let cirkulacija = 0
    let resultsArr = []

    results.map(result => {
      cirkulacija += result.lati
    })



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
            : `#${user.discriminator}`}`,
          value: `${(results[i].lati).toFixed(2)} ${latsOrLati(results[i].lati)}`,
        },
      )
    }

    message.reply(embedSaraksts('Servera tops',
      `Cirkulācijā ir ${cirkulacija.toFixed(2)} ${latsOrLati(cirkulacija)}`, resultsArr))
    return 1
  },
}