import { reakcEmbeds } from '../embeds/embeds.js'
import { atbildes, emoji } from './atbildes.js'
import { latToEng } from '../helperFunctions.js'

// ģenerē random numuru no 0 līdz num
const rand = num => {
  return Math.floor(Math.random() * num)
}

// atbilžu template lai nav viens un tas pats jaraksts 254532 reizes
// dod iespēju katrai ziņai pielikt random emoji
const atbTemplate = (t, content, randEmoji = 0) => {
  return {
    content: `${t[rand(t.length)]} ${randEmoji ? emoji[rand(emoji.length)] : ''}`,
    allowedMentions: { repliedUser: false },
  }
}

// šis fails pārstrādā tekstu uz ko vajag reaģēt
export const reakcijas = client => {
  client.on('messageCreate', message => {

    // pārbauda vai sūtītā ziņa nav no bota
    if (message.author.id === '884514288012759050' || message.channelId !==
      '884514924288671744') return

    // pārveido message uz lower case un noņem mīkstinājum un garumzīmes
    const content = latToEng(message.content.toLowerCase())

    // JAUTĀJUMS
    if (content.endsWith('?') && content.startsWith('ulmani')) {
      message.reply(atbTemplate(atbildes.jaut.atb, content))
      return
    }

    // MARTINSONS
    if (content.includes('martinsons')) {
      message.reply(atbTemplate(atbildes.martinsons.atb, content, 1))
      return
    }

    // AMBALIS
    if (content.includes('ambalis')) {
      message.reply(atbTemplate(atbildes.ambalis.atb, content, 1))
      return
    }

    // ŠĪS OLAS
    if (content.includes('sis') && content.includes('olas')) {
      message.reply(atbTemplate(atbildes.olas.atb, content, 1))
      return
    }

    // SIEVIETE
    if (content.includes('sieviete')) {
      message.reply(atbTemplate(atbildes.sieviete.atb, content))
      return
    }

    // DĪVAINĀ ZIVS
    if (content.includes('zivs')) {
      message.reply({
        embeds: [reakcEmbeds('zivs')],
        allowedMentions: { repliedUser: false },
      })
      return
    }

    // KIRILICA (es nesaprotu kā šis strādā bet internets teica ka strādā)
    if (/^[\u0410-\u044F]+$/.test(content)) {
      message.reply(atbTemplate(atbildes.kirilica.atb, content))
      return
    }
  })
}