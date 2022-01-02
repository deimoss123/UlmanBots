import { embedSaraksts } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'
import { getEmoji } from '../../reakcijas/atbildes.js'

const jaun = {/*
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

  '3.2.1':
    '- Jauni servera topi (`.top feniks` ' + `${getEmoji(['kruts'])}` + '), tos var apskatīt ar komandu `.top`',

  '3.2.2':
    `- Salabots kakts (beidzot) ${getEmoji(['kruts'])}\n` +
    `- Automātiskā lomu došana (beidzot) ${getEmoji(['izbrinits'])}\n` +
    '- Serveriem tagad pieejami iestatījumi ar komandu `.iestatījumi`',

  '3.2.3':
    `- Ieviestas nejaušas atlaides veikalā ${getEmoji(['uldons'])}, restartējas katru dienu plkst. 00.00\n` +
    '- Veikalā tagad ir iespējams pa taisno nopirkt preces',*/

  '3.3 - Lielais ekonomijas atjauninājums':
    '- `.ubagot` komanda izdzēsta\n' +
    '- Odekolons tagad krīt no atkritumiem, kā iepriekš\n' +
    '- Gandrīz visām komandām ir mainīts dizains\n' +
    '- **!!** Lietas tagad var pirkt/pārdot/izmantot pēc to nosaukuma (id) nevis numura, ' +
    'lietu nosaukumi ir norādīti veikalā un inventārā\n' +
    '- Samazināts fēniksa nodoklis\n' +
    `- UlmaņBots atbildēs ar smieklīgajām atbildēm tikai tad kad viņš tiks pingots <@${process.env.ULMANISID}>, vai arī ziņā būs iekļauts vārds "Ulmanis", "Ulmani", utt.\n\n` +

    '**Jaunā bomžošana sistēma**\n' +
    '- Bomžošanai vairs nav nepieciešams bomža status, kas vairs neeksistē\n' +
    '- Bomžot ir iespējams ik 5 minūtes, bet tā limits ir 5 reizes diennaktī (restartējas plkst 00.00)\n' +
    '- Kad lietotājs ir sasniedzis bomžošanas limitu, tiks piedāvāta iespēja bomžot velreiz par samaksu - 1 odekolona pudele, papildus var bomžot 3 reizes\n\n' +

    '**Jaunā strādāšanas sistēma**\n' +
    '- Strādāšanas sistēma strādā tā pat kā bomžošana, tikai limits ir 3 reizes nevis 5 diennaktī\n' +
    '- Kad limits sasniegts nav iespējams strādāt vēlreiz\n\n' +

    '**Statistika**\n' +
    '- Jauna komanda `.statistika`\n' +
    '- Katram lietotājam var apskatīties statistiku no savāktajiem datiem',
}

export default {
  title: 'Jaunumi',
  description: 'Apskatīt jaunumus UlmaņBota versijās',
  commands: ['jaunumi', 'kasjauns'],
  cooldown: 0,
  callback: message => {

    const resultArr = Object.keys(jaun).map(versija => {
      return {
        name: versija,
        value: jaun[versija],
      }
    })

    message.reply(
      embedSaraksts(message, 'Jaunumi', 'Kas jauns UlmaņBota versijās', resultArr, '', 0x004659))
    return 1
  },
}