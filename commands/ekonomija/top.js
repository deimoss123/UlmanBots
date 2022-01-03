import { findUser, getTop } from '../../ekonomija.js'
import { embedSaraksts, embedTemplate } from '../../embeds/embeds.js'
import { latsOrLati } from '../../helperFunctions.js'
import { calcInvValue } from '../items/inventars.js'
import { getEmoji } from '../../reakcijas/atbildes.js'
import { imgLinks } from '../../embeds/imgLinks.js'
import { okddId } from '../../index.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Servera tops',
  description: 'Parāda bagātākos lietotājus serverī',
  commands: ['top', 'tops', 'oligarhi'],
  cooldown: 5000,
  maxArgs: 2,
  callback: async (message, args, b, client) => {
    let guildId = message.guildId
    if (args[1] && message.author.id === process.env.DEVUSERID) guildId = okddId

    await findUser(guildId, process.env.ulmanisid)

    let results = await getTop(guildId)

    let cirkulacija = 0

    let resultsArr = []
    let title, desc
    let imgUrl = imgLinks.oligarhs

    let pointer = () => {}
    let extraInfo = () => { return ' lati' }
    let showPercent = true
    let listSize = 10

    const banka = results.find(obj => obj['_id'] === `${guildId}-${process.env.ULMANISID}`)
    results.splice(results.indexOf(banka), 1)

    //const temp = 'maks'

    switch (args[0]) {
      case 'maks': {
        results = results.sort((a, b) => { return b.lati - a.lati } )
        results.map(result => cirkulacija += result.lati > 0 ? result.lati : 0)

        title = '- Maks'
        desc = `Cirkulācijā ir **${cirkulacija.toFixed(2)}** ${latsOrLati(cirkulacija)}\n` +
          `Valsts bankai (UlmaņBotam) ir ${floorTwo(banka.lati).toFixed(2)} ${latsOrLati(banka.lati)}`

        pointer = i => { return results[i].lati }
      } break
      case 'inv': {
        results = results.filter(r => r?.items)
        results = results.filter(r => Object.keys(r.items).length)

        results.map(result => {
          result.invValue = calcInvValue(result.items)
          cirkulacija += result.invValue
        })

        results = results.sort((a, b) => { return b.invValue - a.invValue })

        title = '- Inventāra vērtība'
        desc = `Visu lietotāju kopējā inventāru vērtība - **${cirkulacija}** lati`

        pointer = i => { return results[i].invValue }
      } break
      case 'total': {
        let cirkulacijaInv = 0
        let cirkulacijaMaks = 0

        results.map(result => {
          result.invValue = 0
          if (result.items) {
            if (Object.keys(result.items).length) result.invValue = calcInvValue(result.items)
          }
          cirkulacijaMaks += result.lati > 0 ? result.lati : 0
          cirkulacijaInv += result.invValue
          cirkulacija += result.invValue + (result.lati > 0 ? result.lati : 0)
        })

        results.sort((a, b) => { return (b.invValue + b.lati) - (a.invValue + a.lati) })

        title = '- Kopējā lietotāja vērtība'
        desc = `Kopējā servera vērtība - **${cirkulacija.toFixed(2)}** lati\n` +
          `Cirkulācijā ir **${cirkulacijaMaks.toFixed(2)}** ${latsOrLati(cirkulacijaMaks)}\n` +
          `Visu lietotāju kopējā inventāru vērtība - **${cirkulacijaInv}** lati`

        pointer = i => { return results[i].invValue + results[i].lati }
      } break
      case 'feniks': {
        results = results.filter(r => r.data?.feniksSpend)
        results = results.sort((a, b) => { return b.data.feniksSpend - a.data.feniksSpend } )

        results.map(result => cirkulacija += result.data.feniksSpend)

        title = '- Fēniksā iztērēts (kopš 02.01.22)'
        desc = `Kopā fēniksā ir iztērēti **${cirkulacija}** lati\n`
        imgUrl = imgLinks.feniksTop

        extraInfo = i => { return ` lati, ${results[i].data.feniksCount} griezieni` }
        pointer = i => { return results[i].data.feniksSpend }
      } break
      case 'laimetaji':
      case 'zaudetaji': {
        results = results.filter(r => r.data?.feniksSpend && r.data?.feniksWin)

        results = results.sort((a, b) => {
          const winSpendRatio1 = a.data.feniksWin / a.data.feniksSpend
          const winSpendRatio2 = b.data.feniksWin / b.data.feniksSpend

          return args[0] === 'laimetaji'
            ? winSpendRatio2 - winSpendRatio1
            : winSpendRatio1 - winSpendRatio2
        })

        console.log(results)


        title = args[0] === 'laimetaji' ? '- veiksmīgākie' : '- neveiksmīgākie'
        title += ' aparāta griezēji (kopš 02.01.22)'

        desc = `UlmaņBota veidotājs procentus nevienam nav grozījis ${getEmoji(['ulmanis'])}`
        listSize = 5
        showPercent = false
        imgUrl = imgLinks.feniksTop

        pointer = i => { return results[i].data.feniksWin / results[i].data.feniksSpend * 100 }
        extraInfo = () => { return '%' }
      } break
      default: {
        message.reply(embedTemplate(message, 'Servera tops',
          'Servera topus var apskatīt ar komandu `.top <kategorija>`\n ' +
          'Piemērs - `.top total`\n\n\n' +
          `**Kategorijas**\n\n` +
          '**total** - kopējā lietotāja vērtība (maks + inventārs)\n' +
          '**maks** - bagātākie lietotāji pēc latu daudzuma makā\n' +
          '**inv** - lietotāji ar visvērtīgāko inventāru\n\n' +

          '**feniks** - lielākie aparāta griezēji\n' +
          '**laimētāji** - laimīgākie aparāta griezēji\n' +
          '**zaudētāji** - nelaimīgākie aparāta griezēji\n'
        , imgLinks.top))
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
      for (let i = 0; i < (results.length < listSize ? results.length : listSize); i++) {
        let user = {}
        try {
          user = await client.users.fetch(results[i].userId)
        } catch (e) {
          user = { username: 'Nezināms lietotājs', discriminator: '-' }
        }

        let percent = ''
        if (showPercent) percent = `  \`${floorTwo(pointer(i) / cirkulacija * 100).toFixed(2)}%\``
        //if (showPercent) percent = '  `' + floorTwo(pointer(i) / cirkulacija * 100).toFixed(2) + '%`'

        let place = `\`#${i+1}\``

        switch (i+1) {
          case 1:
            place = ':first_place:'
            break
          case 2:
            place = ':second_place:'
            break
          case 3:
            place = ':third_place:'
            break
        }

        resultsArr.push(
          {
            name: `${place}  ${user.username}${user.discriminator === '-'
              ? ``
              : `#${user.discriminator}`}` + percent,
            value: `${floorTwo(pointer(i)).toFixed(2)}${extraInfo(i)}`,
          },
        )
      }
    }

    message.reply(embedSaraksts(message, `Servera tops ${title}`,desc, resultsArr, imgUrl))
    return 1
  },
}