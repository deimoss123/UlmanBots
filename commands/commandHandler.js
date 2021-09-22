import commandBase from './commandBase.js'

import { latToEng } from '../helperFunctions.js'

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

const commands = [
  maks, addLati, bomzot, ubagot, inventars, top, veikals, pirkt, pardot,
]

export default (client, message) => {

  const content = latToEng(message.content.toLowerCase())

  // pārbauda vai ziņa sākas ar . (tad tā būs komanda)
  if (content.startsWith('.')) {

    // sadala ziņu array, pirmā ziņa būs komanda
    const args = content.split(/[ ]+/)

    // lietotāja komanda, kas tiks pārbaudīta un salīdzināta ar citām komandām
    // noņem . no komandas
    const userCommand = args[0].slice(1)

    let i = 0
    commands.map(command => {
      command.commands.map(async cmd => {
        if (userCommand === cmd) await commandBase(client, message, cmd, commands[i])
      })
      i++
    })
  }
}