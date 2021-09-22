import commandBase from './commandBase.js'

import { latToEng, timeToText } from '../helperFunctions.js'

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
import { addCooldown, findUser } from '../ekonomija.js'
import { embedError } from '../embeds/embeds.js'

const commands = [
  maks, addLati, bomzot, ubagot, inventars, top, veikals, pirkt, pardot,
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
          const { cooldowns } = await findUser(guildId, userId)

          if (!cooldowns[command.title] ||
            (Date.now() - cooldowns[command.title]) >= command.cooldown) {

            if (await commandBase(client, message, cmd, command)) {
              await addCooldown(guildId, userId, command.title)
            }
          } else {
            const time = Math.floor(
              (command.cooldown - (Date.now() - cooldowns[command.title])) / 1000)

            message.reply(
              embedError(command.title, `Šo komandu tu varēsi izmantot pēc ${timeToText(time, 1)
                ? timeToText(time, 1) : '1 sekundes'}`))
          }
        }
      })
    })
  }
}