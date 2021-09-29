import commandBase from './commandBase.js'

import { latToEng, timeToText } from '../helperFunctions.js'

import { addCooldown, findUser, checkStatus } from '../ekonomija.js'
import { embedError } from '../embeds/embeds.js'

let commands

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

commands = [
  addLati, maks, bomzot, ubagot, inventars, top, 
  veikals, pirkt, pardot, zagt, maksat, izmantot, 
  status, zvejot, stradat, kakts, izkaktot
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

            message.reply(
              embedError(command.title, `Šo komandu tu varēsi izmantot pēc ${timeToText(time, 1)
                ? timeToText(time, 1) : '1 sekundes'}`))
          }
        }
      })
    })
  }
}