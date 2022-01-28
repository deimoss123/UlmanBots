import commandBase from './commandBase.js'

import { latToEng, timeToText } from '../helperFunctions.js'

import { addCooldown, findUser } from '../ekonomija.js'
import { embedError, noPing } from '../embeds/embeds.js'

// visu komandu importi
import maks from './info/maks.js'
import addLati from './admin/addLati.js'
import addItem from './admin/addItem.js'
import bomzot from './ekonomija/bomzot.js'
import inventars from './info/inventars.js'
import top from './info/top.js'
import veikals from './ekonomija/veikals/veikals.js'
import pirkt from './ekonomija/pirkt.js'
import pardot from './ekonomija/pardot.js'
import zagt from './ekonomija/zagt.js'
import maksat from './ekonomija/maksat.js'
import izmantot from './ekonomija/izmantot.js'
import status from './info/status.js'
import zvejot from './ekonomija/fishing/zvejot.js'
import stradat from './ekonomija/stradat.js'
import palidziba from './info/palidziba.js'
import { feniks } from './kazino/feniks/feniks.js'
import jaunumi from './info/jaunumi.js'
import pabalsts from './ekonomija/pabalsts.js'
import iestatijumi, { settingsCache } from './admin/iestatijumi.js'
import statistika from './info/statistika.js'
import { rulete } from './kazino/rulete/rulete.js'

export const commands = {
  'Informācijai': [
    palidziba, jaunumi, top, maks, inventars, status, statistika,
  ],
  'Peļņai': [
    bomzot, stradat, zvejot, pabalsts,
  ],
  'Ekonomijai': [
    veikals, pirkt, pardot, izmantot, maksat, zagt,
  ],
  'Kazino': [
    feniks, rulete,
  ],
  'Moderātoriem': [
    iestatijumi, addLati, addItem,
  ],
}

// lietotāju melnais saraksts
const blacklist = [
  '893518835808890880', // edzhas alts 1
  '893527734431678584', // edzhas alts 2
  '893457171478642728', // edzhas alts 3
  '893451569612341319', // pupinvecis
]

export const activeCommands = {}

export default (client, message) => {
  const guildId = message.guildId
  const userId = message.author.id

  const content = latToEng(message.content.toLowerCase())

  // sadala ziņu array, pirmā ziņa būs komanda
  const args = content.split(/[ ]+/)

  // lietotāja komanda, kas tiks pārbaudīta un salīdzināta ar citām komandām
  // noņem . no komandas
  const userCommand = args[0].slice(1)
  Object.keys(commands).map(category => {
    commands[category].map(command => {
      command.commands.map(async cmd => {
        if (userCommand === cmd) {

          if (!settingsCache[guildId]?.allowedChannels.length && userCommand !== 'iestatijumi') {
            message.reply(noPing('Šajā serverī nav iestatīti kanāli kuros ir atļautas UlmaņBota komandas\n' +
              'To var izdarīt admins ar komandu `.iestatījumi`'))
            return
          }

          if (settingsCache[guildId]?.allowedChannels.length) {
            if (!settingsCache[guildId].allowedChannels.includes(message.channelId) &&
              userCommand !== 'iestatijumi') return
          }

          // neļauj cilvēkiem melnajā sarakstā lietot komandas
          if (blacklist.includes(userId)) return

          // komandas var izmantot tikai testa serverī
          if (command.title === 'AddLati' && guildId !== process.env.TESTSERVERID) return
          if (command.title === 'AddItem' && guildId !== process.env.TESTSERVERID) return

          if (command.hidden && guildId !== process.env.TESTSERVERID) return

          let { cooldowns } = await findUser(guildId, userId)

          let cmdCooldown = command?.cooldown
          if (!cmdCooldown) cmdCooldown = 0

          // testa serveri 0 cooldown
          if (guildId === process.env.TESTSERVERID) cmdCooldown = 0

          if (!activeCommands[`${guildId}-${userId}`]) {
            activeCommands[`${guildId}-${userId}`] = {}
          }

          if (activeCommands[`${guildId}-${userId}`][command.title]) {
            message.reply(
              embedError(
                message, command.title, 'Tu nevari izmantot šo komandu, jo tā jau ir aktīva'))
            return
          }

          //console.log(Date.now() - parseInt(cooldowns[command.title]))
          //console.log(parseInt(cooldowns[command.title]))

          //console.log(cmdCooldown)

          let time = cmdCooldown

          if (cooldowns) if (cooldowns[command.title]) {
            time = Date.now() - parseInt(cooldowns[command.title])
          }

          //console.log(`Laiks: ${time}`)

          if (time >= cmdCooldown) {

            if (await commandBase(client, message, cmd, command)) {
              await addCooldown(guildId, userId, command.title)
            }
          } else {
            let msg = await message.reply(
              embedError(
                message, command.title, `Šo komandu tu varēsi izmantot pēc ${timeToText(cmdCooldown - time, 1)
                  ? timeToText(cmdCooldown - time, 1) : '1 sekundes'}`))

            setTimeout(async () => msg.delete(), 10000)
          }
        }
      })
    })
  })

}