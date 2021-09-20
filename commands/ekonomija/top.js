import { getTop } from '../../ekonomija.js'
import { embedSaraksts } from '../../embeds/embeds.js'
import { latsOrLati } from '../../helperFunctions.js'

export default {
  title: 'Top',
  callback: async (message, a, b, client) => {
    const results = await getTop()
    let circulacija = 0

    results.map(result => {
      circulacija += result.lati
    })

    let resultsArr = []

    console.log(results[0].userId)

    for(let i = 0; i < (results.length < 10 ? results.length : 10); i++) {
      let user = await client.users.fetch(results[i].userId)
      resultsArr.push(
        {
          name: `${i + 1}. ${user.username}#${user.discriminator}`,
          value: `${results[i].lati} ${latsOrLati(results[i].lati)}`
        }
      )
    }

    message.reply(embedSaraksts('Servera tops', `Cirkulācijā ir ${circulacija} ${latsOrLati(circulacija)}`, resultsArr))

    console.log(results)

    return 1
  }
}