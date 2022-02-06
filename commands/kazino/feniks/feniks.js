import { getEmoji } from '../../../reakcijas/atbildes.js'
import { buttonEmbed, embedError, embedTemplate, noPing } from '../../../embeds/embeds.js'
import { addLati, findUser, addData } from '../../../ekonomija.js'
import { imgLinks } from '../../../embeds/imgLinks.js'
import { generateSlotiRow } from './generateSlotiRow.js'
import { laimesti, testLaimesti } from '../laimesti.js'
import { fenkaEmbed } from './fenkaEmbeds.js'
import { getHeat } from './heatHandler.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export const feniks = {
  title: 'Fēnikss',
  description: 'Griezt Ulmaņa naudas aparātiem',
  commands: ['feniks', 'fenikss', 'fenka', 'aparats', 'griezt'],
  maxArgs: 1,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    const minLikme = 20
    let reizinataji = ''

    const laim = { ...laimesti.fenkaSloti }

    //testLaimesti(laim, 1000000); return 1

    Object.keys(laim).map(l => {
      if (laim[l]?.multiplier) {
        reizinataji += `${getEmoji([l])} x${laim[l].multiplier}\n`
      } else if (laim[l]?.minMultiplier) {
        reizinataji += `${getEmoji([l])} x???\n`
      }
    })

    if (!args[0]) {
      message.reply(embedTemplate(message, '',
        'Lai grieztu aparātu izmanto komandu `.feniks <likme>`\n' +
        `Aparātu var griezt ar jebkādu likmi kas dalās ar 10 (piemēram: 20, 110, 200, 690)\n` +
        `Minimālā likme: **${minLikme}** lati\n\n` +

        'Lai grieztu aparātu ar nejauši izvēlētu likmi izmanto `.feniks virve`\n' +
        'Griezt aparātu ar visu savu naudu - `.feniks viss`\n\n' +
        '**Reizinātāji**\n' +
        `${reizinataji}`,
        undefined, 0xffffff, 'https://i.postimg.cc/bYFM9WxJ/sodienpaveiksies.png'))
      return 2
    }

    const { lati } = await findUser(guildId, userId)
    let likme = args[0]

    if (['virve', 'pasnaviba', 'virvi', 'pasnavibu'].includes(likme)) {
      if (lati < minLikme) {
        message.reply(noPing(
          `Lai grieztu pašnāvnieku aparātu tev vajag vismaz ${minLikme} latus\n` +
          `Tev ir **${floorTwo(lati).toFixed(2)}** lati`))
        return 2
      }

      likme = Math.floor(Math.random() * (lati - minLikme)) + minLikme
    } else if (likme === 'viss') {
      if (lati < minLikme) {
        message.reply(noPing(
          `Tev vajag vismaz ${minLikme} latus lai grieztu aparātu\n` +
          `Tev ir **${floorTwo(lati).toFixed(2)}** lati`))
        return 2
      }

      likme = Math.floor(lati)
    } else if ((likme % 10) || likme < minLikme || isNaN(likme)) {
      message.reply(noPing('**Tu neesi izvēlējies pareizu likmi**\n' +
        `Likmei jābūt jebkādam skaitlim kas dalās ar 10 (piemēram: 50, 110, 200, 690)\n` +
        `Minimālā likme: ${minLikme} lati\n\n` +
        'Griezt ar nejauši izvēlētu likmi - `.feniks virve`\n' +
        'Griezt visu savu naudu - `.feniks viss`',
      ))
      return 2
    } else {
      if (lati < likme) {
        message.reply(noPing(
          `Tev nepietiek naudas lai grieztu aparātu ar **${likme}** latu likmi\n` +
          `Tev ir **${floorTwo(lati).toFixed(2)}** lati`))
        return 2
      }
    }

    let resLati = 0
    let totalMultiplier = 0
    const winRow = generateSlotiRow(5, laim)

    for (const item of winRow.arr) {
      if (winRow.obj[item]?.multiplier) {
        totalMultiplier += winRow.obj[item].multiplier
        resLati += winRow.obj[item].multiplier * likme
      } else if (winRow.obj[item]?.minMultiplier && winRow.obj[item]?.maxMultiplier) {
        const { minMultiplier: min, maxMultiplier: max } = winRow.obj[item]
        const multiplier = Math.floor(Math.random() * (max - min) + min)
        totalMultiplier += multiplier
        resLati += multiplier * likme
      }
    }

    const rand = Math.floor(Math.random() * 100000)

    const row = [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: 'Griezt vēlreiz',
            custom_id: `grieztVelreiz ${rand}`,
            disabled: true,
          },
        ],
      },
    ]

    resLati = Math.floor(resLati)

    await addLati(guildId, process.env.ULMANISID, likme * 0.05)
    await addLati(guildId, userId, resLati - likme)

    let dataUser = {
      feniksSpend: parseInt(likme),
      feniksWin: resLati,
      feniksCount: 1,
    }

    const { data } = await findUser(guildId, userId)

    if (data.maxFeniksWin <= resLati) {
      dataUser.maxFeniksWin = `=${resLati}`
    }

    if (data.maxFeniksLikme <= likme) dataUser.maxFeniksLikme = `=${likme}`

    await addData(guildId, userId, dataUser)



    const heat = await getHeat(message.guildId, likme)
    const embeds = await fenkaEmbed(message, winRow, resLati, totalMultiplier, likme, [], heat)
    const { title, description, fields } = embeds.embeds[0]

    await buttonEmbed({
      message,
      commandTitle: 'Fēnikss',
      title,
      description,
      fields,
      row,
      time: 3000,
      func: msg => {
        return new Promise(res => {
          return setTimeout(async () => {
            let time = 0
            if (winRow.arr.includes('petnieks')) {
              await msg.edit({ embeds: [{ image: { url: imgLinks.petnieks } }] })
              time = 5000
            }

            return setTimeout(async () => {
              let embed = await fenkaEmbed(message, winRow, resLati, totalMultiplier, likme, winRow.arr, heat)

              row[0].components[0].disabled = false
              row[0].components[0].style = 1
              embed.components = row
              await msg.edit(embed)
              return res(embed)
            }, time)
          }, 2000)
        })
      },
      cb: async i => {
        if (i.customId === `grieztVelreiz ${rand}`) {
          return {
            id: `grieztVelreiz ${rand}`,
            after: () => {
              feniks.callback(message, args)
            },
          }
        }
      },
    })

    return 1
  },
}