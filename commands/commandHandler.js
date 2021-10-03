import commandBase from './commandBase.js'

import { latToEng, timeToText } from '../helperFunctions.js'

import { addCooldown, findUser, checkStatus } from '../ekonomija.js'
import { embedError } from '../embeds/embeds.js'

// visu komandu importi
import maks from './ekonomija/maks.js'
import addLati from './ekonomija/addLati.js'
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
import feniks from './ekonomija/feniks.js'

export const commands = [
  palidziba, top, maks, zagt, maksat,
  bomzot, ubagot, zvejot, stradat,
  inventars, veikals, pirkt, pardot, izmantot, status,
  kakts, izkaktot,
  addLati,
]

// lietotāju melnais saraksts
const blacklist = [
  '893518835808890880', // edzhas alts 1
  '893527734431678584', // edzhas alts 2
  '893457171478642728', // edzhas alts 3
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

    commands.map(command => {
      command.commands.map(async cmd => {
        if (userCommand === cmd) {

          // neļauj cilvēkiem melnajā sarakstā lietot komandas
          if (blacklist.includes(userId)) return

          // addlati komandu var izmantot tikai testa serverī
          if (command.title === 'AddLati' && guildId !== '875083366611955712') return

          let { cooldowns } = await findUser(guildId, userId)

          let cmdCooldown = command.cooldown

          if (command.title === 'Bomžot'){
            if (await checkStatus(guildId, userId, 'bomzis')) cmdCooldown /= 2
          }

          if (!cooldowns[command.title] ||
            (Date.now() - cooldowns[command.title]) >= cmdCooldown) {

            if (await commandBase(client, message, cmd, command)) {
              await addCooldown(guildId, userId, command.title)
            }
          } else {
            const time = cmdCooldown - (Date.now() - cooldowns[command.title])

            const msg = await message.reply(
              embedError(message, command.title, `Šo komandu tu varēsi izmantot pēc ${timeToText(time, 1)
                ? timeToText(time, 1) : '1 sekundes'}`))

            setTimeout(() => msg.delete(), 10000)
          }
        }
      })
    })
  }
}