import { findUser, getTop } from '../../ekonomija.js'
import { embedSaraksts, embedTemplate } from '../../embeds/embeds.js'
import { latsOrLati } from '../../helperFunctions.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Servera tops',
  description: 'Parāda bagātākos lietotājus serverī',
  commands: ['top', 'tops', 'oligarhi'],
  cooldown: 10000,
  maxArgs: 1,
  callback: async (message, args, b, client) => {
    const guildId = message.guildId

    await findUser(guildId, process.env.ulmanisid)

    let results = await getTop(guildId)

    let cirkulacija = 0
    let cirkulacijaInv = 0

    let resultsArr = []
    let title, desc

    let pointer = () => {}
    let extraInfo = () => { return '' }
    let showPercent = true

    const banka = results.find(obj => obj['_id'] === `${guildId}-${process.env.ULMANISID}`)
    results.splice(results.indexOf(banka), 1)

    const temp = 'maks'

    switch (temp) {
      case 'maks': {
        results = results.sort((a, b) => { return b.lati - a.lati } )
        results.map(result => cirkulacija += result.lati)

        title = '- visvairāk lati makā'
        desc = `Cirkulācijā ir ${cirkulacija.toFixed(2)} ${latsOrLati(cirkulacija)}\n` +
          `Valsts bankai (UlmaņBotam) ir ${floorTwo(banka.lati).toFixed(2)} ${latsOrLati(banka.lati)}`

        pointer = i => { return results[i].lati }
      } break
      case 'inv': {

      } break
      case 'feniks': {
        results = results.filter(r => r?.data?.feniksSpend)
        results = results.sort((a, b) => { return b.data.feniksSpend - a.data.feniksSpend } )

        results.map(result => cirkulacija += result.data.feniksSpend)

        title = '- visvairāk Fēniksā iztērēts (kopš 22.10.21)'
        desc = `Kopā fēniksā ir iztērēti **${cirkulacija.toFixed(2)}** lati\n`

        extraInfo = i => { return `, ${results[i].data.feniksCount} griezieni` }
        pointer = i => { return results[i].data.feniksSpend }
      } break
      case 'laimesti': {

      } break
      default: {
        message.reply(embedTemplate(message, 'Servera tops',
          'Servera topus var apskatīt ar komandu `.top <kategorija>`, piemērs - `.top maks`\n\n\n' +
          `**Kategorijas**\n\n` +
          '**maks** - bagātākie lietotāji pēc latu daudzuma makā\n' +
          '**inv** - lietotāji ar visvērtīgāko inventāru\n\n' +

          '**feniks** - lielākie aparāta griezēji\n' +
          '**laimētāji** - laimīgākie aparāta griezēji\n' +
          '**zaudētāji** - nelaimīgākie aparāta griezēji\n'
        ))
        return 2
      }
    }

    // saliek top lietotājus resultsArr un izveido embedu
    // max lietotāji kas var būt sarakstā ir 10
    if (!results.length) {
      resultsArr.push({
        name: 'Sarakstā nav lietotāju',
        value: ':('
      })
    } else {
      for (let i = 0; i < (results.length < 10 ? results.length : 10); i++) {
        let user = {}
        try {
          user = await client.users.fetch(results[i].userId)
        } catch (e) {
          user = { username: 'Nezināms lietotājs', discriminator: '-' }
        }

        let percent = ''
        if (showPercent) percent = '  `' + floorTwo(pointer(i) / cirkulacija * 100).toFixed(2) + '%`'

        resultsArr.push(
          {
            name: `${i + 1}. ${user.username}${user.discriminator === '-'
              ? ``
              : `#${user.discriminator}`}` + percent,
            value: `${floorTwo(pointer(i)).toFixed(2)} ${latsOrLati(pointer(i))}${extraInfo(i)}`,
          },
        )
      }
    }

    message.reply(embedSaraksts(message, `Servera tops ${title}`,desc, resultsArr))
    return 1
  },
}