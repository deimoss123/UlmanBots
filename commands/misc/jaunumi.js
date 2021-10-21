import { embedSaraksts } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'
import { getEmoji } from '../../reakcijas/atbildes.js'

const jaun = {
  '3.1.1':
    '- `.jaunumi`' + `komanda UlmaņBota ${getEmoji(['ulmanis'])} jaunumiem\n` +
    '- `.feniks viss`' + `, griezt visu naudu aparātā ${getEmoji(['izbrinits'])}\n` +
    `- Palielināti zagšanas procenti ${getEmoji(['itsniks'])}\n` +
    '- Pievienots paskaidrojums zagšanai uzrakstot `.zagt`\n' +
    `- Dīvainā zivs ${getEmoji(['zivs'])} tagad dod nejaušu statusu\n` +
    '- Jaunas smieklīgās atbildes :milk: :milk: :milk:\n' +
    '- Pievienota `.pabalsts` komanda, pabalsta lielums atkarīgs no lomas, pieejams tikai lomām virs draudziņdauņiem\n' +
    '- 10% no feniksa naudas tagad aiziet valsts bankai\n' +
    '- `.palīdzība` uztaisīta pārskatāmāka',
  '3.1.2':
    '- `.pārdot visu` komanda lai pārdotu visas mantas inventārā\n' +
    '- Pievienotas pogas komandām `.inv`, `.bomžot`, `.zvejot`, `.pirkt`',
  '3.2':
    `- Fenikam pievienota poga "Griezt vēlreiz" ${getEmoji(['bacha'])}\n` +
    '- Tagad bomžošanai ir **nepieciešams** bomža statuss, odekolonu var dabūt tikai no ubagošanas, un tā vērtība tagad ir 0 lati\n' +
    '- Pievienoti paskaidrojumi statusiem, izmanto komandu `.status info`\n' +
    '- Strādāšanai un bomžošanai pievienotas izvēles pogas\n' +
    `- Ieviests inventāra limits - 100 ${getEmoji(['1984'])} pagaidām nav palielināms ${getEmoji(['lenka'])}\n` +
    '- Noņemta iespēja zagt kamēr tev ir aizsardzības statuss\n' +
    `- Samazināti zagšanas procenti ${getEmoji(['kruts'])} \n` +
    '- Palielināta naža cena uz 250, un rasena uz 150\n' +
    `- Palielināti latloto un dižloto procenti ${getEmoji(['bacha'])} \n`,
}

export default {
  title: 'Jaunumi',
  description: 'Apskatīt jaunumus UlmaņBota versijās',
  commands: ['jaunumi', 'kasjauns'],
  cooldown: 0,
  callback: message => {
    let resultArr = []

    Object.keys(jaun).map(versija => {
      resultArr.push({
        name: versija,
        value: jaun[versija],
      })
    })

    message.reply(
      embedSaraksts(message, 'Jaunumi', 'Kas jauns UlmaņBota versijās', resultArr, imgLinks.kasjauns))
    return 1
  },
}