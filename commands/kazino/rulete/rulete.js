import { buttonEmbed, embedSaraksts, noPing } from '../../../embeds/embeds.js'
import { rulEmbed } from './rulEmbeds.js'
import { checkWin, generateNum } from './rulHandler.js'
import { addLati, findUser } from '../../../ekonomija.js'
import { floorTwo } from '../../../helperFunctions.js'
import { rulComponents } from './rulComponents.js'


// pozīcijas
//
// melns sarkans
// 0-36 (numurs)
// zems/augsts (zems: 1 līdz 18, augsts: 19 līdz 36
// pāra/nepāra (pāra vai nepāra skaitlis)


export const rulete = {
  title: 'Rulete',
  description: 'Griezt ruleti',
  commands: ['rulete', 'rul'],
  maxArgs: 2,
  callback: async (message, args) => {
    const { guildId } = message
    const userId = message.author.id

    const { lati } = await findUser(guildId, userId)

    const minLikme = 20
    let pos, likme = null

    if (!args[0] || !args[1]) {
      message.reply(embedSaraksts(message, '',
        'Lai grieztu ruleti izmanto komandu `.rulete <pozīcija> <likme>`\n' +
        `Ruleti var griezt ar **jebkādu** likmi (piemēram: 20, 69, 86, 109, 200)\n` +
        `Minimālā likme: **${minLikme}** lati\n\n` +

        'Lai grieztu ruleti ar nejauši izvēlētu likmi izmanto `.rul virve`\n' +
        'Griezt ruleti ar visu savu naudu - `.rul viss`\n\n' +

        '**Pozīcijas:**\n' +
        '- Skaitlis (no 0 līdz 36), **x35** \n' +
        '- Krāsa (melns/sarkans) (m/s), **x2** \n' +
        '- (pāra/nepāra) (p/n), **x2** \n' +
        '- (zems/augsts) (z/a), **x2** \n\n' +
        '**Zems** - skaitļi no 1 līdz 18 \n' +
        '**Augsts** - skaitļi no 19 līdz 36 \n\n' +

        '**Piemēri:**\n' +
        '`.rul 2 100` (pozīcija: 2, likme: 100)\n' +
        '`.rul zems 40` (pozīcija: zems, likme: 40)\n' +
        '`.rul m 250` (pozīcija: melns, likme: 250)\n'
        , [], '', 0xffffff))
      return 2
    }

    if (lati < minLikme) {
      message.reply(noPing(
        `Lai grieztu ruleti tev vajag vismaz ${minLikme} latus\n` +
        `Tev ir **${floorTwo(lati).toFixed(2)}** lati`
      ))
      return 2
    }

    if (!isNaN(args[1])) {
      likme = Math.floor(args[1])

      if (likme < minLikme) {
        message.reply(noPing(
          `Tu nevari griezt aparātu ar likmi: ${likme} lati\n` +
          `Minimālā likme: **${minLikme}** lati`
        ))
        return 2
      }
    } else if (['viss', 'visu'].includes(args[1])) {
      likme = Math.floor(lati)
    } else if (['virve', 'pasnaviba', 'virvi', 'pasnavibu'].includes(args[1])) {
      likme = Math.floor(Math.random() * (lati - minLikme)) + minLikme
    }

    if (likme === null) {
      message.reply(noPing(
        'Nepareizi ievadīta likme\n' +
        'Pareizās likmes var apskatīt ar ar komandu `.rulete`'
      ))
      return 2
    }

    if (likme > lati) {
      message.reply(noPing(
        `Tev nepietiek naudas lai grieztu ruleti ar **${likme}** latu likmi\n` +
        `Tev ir **${floorTwo(lati).toFixed(2)}** lati`
      ))
      return 2
    }

    if (['melns', 'm', 'melnu'].includes(args[0])) pos = 'b'
    else if (['sarkans', 's', 'sarkanu'].includes(args[0])) pos = 'r'
    else if (['para', 'p'].includes(args[0])) pos = 'even'
    else if (['nepara', 'n'].includes(args[0])) pos = 'odd'
    else if (['zems', 'zemu', 'z'].includes(args[0])) pos = 'low'
    else if (['augsts', 'augstu', 'a'].includes(args[0])) pos = 'high'

    if (!isNaN(args[0]) && args[0] >= 0 && args[0] <= 36) pos = args[0]

    if (!pos && pos !== '0') {
      message.reply(noPing(
        'Nepareizi ievadīta pozīcija\n' +
        'Pareizo sintaksi var apskatīt ar komandu `.rulete`'
      ))
      return 2
    }

    const embed = rulEmbed(message, pos, likme)
    const { title, description, fields } = embed.embeds[0]

    const winNum = generateNum()
    const multiplier = checkWin(pos, winNum.num, winNum.color)

    //await addLati(guildId, process.env.ULMANISID, likme * 0.05)
    await addLati(guildId, userId, likme * multiplier - likme)

    const rand = Math.floor(Math.random() * 100000)
    await buttonEmbed({
      message,
      commandTitle: 'Rulete',
      title,
      description,
      fields,
      row: rulComponents(rand, pos, isNaN(args[1]) ? args[1] : Math.floor(args[1])),
      time: 3000,
      func: msg => {
        return new Promise(res => {
          return setTimeout(async () => {
            let embed = rulEmbed(message, pos, likme, winNum)
            embed.components = rulComponents(rand, pos,
              isNaN(args[1]) ? args[1] : Math.floor(args[1]), true)
            await msg.edit(embed)
            return res(embed)
          }, 2000)
        })
      },
      cb: async i => {
        if (i.customId === `grieztVelreiz ${rand}`) {
          return {
            id: `grieztVelreiz ${rand}`,
            after: () => {
              rulete.callback(message, args)
            },
          }
        }
      }
    })
  }
}