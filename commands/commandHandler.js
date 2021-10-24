import commandBase from './commandBase.js'

import { latToEng, timeToText } from '../helperFunctions.js'

import { addCooldown, findUser, checkStatus } from '../ekonomija.js'
import { embedError } from '../embeds/embeds.js'

// visu komandu importi
import maks from './ekonomija/maks.js'
import addLati from './admin/addLati.js'
import addItem from './admin/addItem.js'
import bomzot from './misc/bomzot.js'
import ubagot from './misc/ubagot.js'
import inventars from './items/inventars.js'
import top from './ekonomija/top.js'
import veikals from './items/veikals.js'
import pirkt from './ekonomija/pirkt.js'
import pardot from './ekonomija/pardot.js'
import zagt from './ekonomija/zagt.js'
import maksat from './ekonomija/maksat.js'
import izmantot from './items/izmantot.js'
import status from './items/status.js'
import zvejot from './misc/zvejot.js'
import stradat from './misc/stradat.js'
import kakts from './admin/kakts.js'
import izkaktot from './admin/izkaktot.js'
import palidziba from './misc/palidziba.js'
import { feniks } from './ekonomija/feniks.js'
import jaunumi from './misc/jaunumi.js'
import pabalsts from './misc/pabalsts.js'

export const commands = {
  'Informācija': [
    palidziba, jaunumi, top, maks, inventars, status,
  ],
  'Peļņa': [
    bomzot, ubagot, zvejot, stradat, feniks, pabalsts,
  ],
  'Ekonomija': [
    veikals, pirkt, pardot, izmantot,  maksat, zagt,
  ],
  'Moderātoriem': [
    kakts, izkaktot, addLati, addItem
  ]
}

// lietotāju melnais saraksts
const blacklist = [
  '893518835808890880', // edzhas alts 1
  '893527734431678584', // edzhas alts 2
  '893457171478642728', // edzhas alts 3
  '893451569612341319', // pupinvecis
]

export default (client, message) => {
  const guildId = message.guildId
  const userId = message.author.id

  const content = latToEng(message.content.toLowerCase())

  // pārbauda vai ziņa sākas ar . (tad tā būs komanda)
  if (content.startsWith('.')) {

    // sadala ziņu array, pirmā ziņa būs komanda
    const args = content.split(/[ ]+/)

    // lietotāja komanda, kas tiks pārbaudīta un salīdzināta ar citām komandām
    // noņem . no komandas
    const userCommand = args[0].slice(1)
    Object.keys(commands).map(category => {
      commands[category].map(command => {
        command.commands.map(async cmd => {
          if (userCommand === cmd) {

            // neļauj cilvēkiem melnajā sarakstā lietot komandas
            if (blacklist.includes(userId)) return

            // komandas var izmantot tikai testa serverī
            if (command.title === 'AddLati' && guildId !== '875083366611955712') return
            if (command.title === 'AddItem' && guildId !== '875083366611955712') return

            let { cooldowns } = await findUser(guildId, userId)

            let cmdCooldown = command.cooldown

            // testa serveri 0 cooldown
            if (guildId === '875083366611955712') cmdCooldown = 0

            if (!cooldowns[command.title] ||
              (Date.now() - cooldowns[command.title]) >= cmdCooldown) {

              if (await commandBase(client, message, cmd, command)) {
                await addCooldown(guildId, userId, command.title)
              }
            } else {
              const time = cmdCooldown - (Date.now() - cooldowns[command.title])

              let msg = await message.reply(
                embedError(message, command.title, `Šo komandu tu varēsi izmantot pēc ${timeToText(time, 1)
                  ? timeToText(time, 1) : '1 sekundes'}`))

              setTimeout(async () => msg.delete(), 10000)
            }
          }
        })
      })
    })
  }
}