import { itemList } from '../../itemList.js'
import { embedSaraksts } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export default {
  title: 'Veikals',
  description: 'Apskatīt veikalu',
  commands: ['veikals', 'maksima', 'maxima', 'rimi'],
  cooldown: 1000,
  callback: (message) => {
    let resultArr = []
    let i = 0

    for (const key in itemList.veikals) {
      resultArr.push({
        name: '`' + `[${i + 1}] ${itemList.veikals[key].nameNomVsk.charAt(0).
          toUpperCase() +
        itemList.veikals[key].nameNomVsk.slice(1)}` + '`',
        value: `Cena: **${itemList.veikals[key].price * 2}** lati`,
      })
      i++
    }

    message.reply(embedSaraksts(message, 'Veikals',
      'Lai nopirktu preci izmanto\n`.pirkt <preces numurs> <daudzums>`',
      resultArr, imgLinks.rimi))
    return 1
  },
}