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