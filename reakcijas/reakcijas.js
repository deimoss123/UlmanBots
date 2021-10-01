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
export const reakcijas = (client, message) => {

  // KIRILICA (es nesaprotu kā šis strādā bet internets teica ka strādā)
  if (/^[\u0410-\u044F]+$/.test(message.content)) {
    message.reply(atbTemplate(atbildes.kirilica.atb, message.content))
    return
  }

  // pārveido message uz lower case un noņem mīkstinājum un garumzīmes
  const content = latToEng(message.content.toLowerCase())

  // JAUTĀJUMS
  if (content.endsWith('?') && content.startsWith('ulmani')) {
    message.reply(atbTemplate(atbildes.jaut.atb, content))
    return
  }

  // SIEVIETE
  if (content.includes('sieviete')) {
    message.reply(atbTemplate(atbildes.sieviete.atb, content))
    return
  }

  // KABACIS
  if (content.includes('kabacis')) {
    message.reply({
      embeds: [reakcEmbeds('kabacis')],
      allowedMentions: { repliedUser: false },
    })
  }

  // DĪVAINĀ ZIVS
  if (content.includes('zivs')) {
    message.reply({
      embeds: [reakcEmbeds('zivs')],
      allowedMentions: { repliedUser: false },
    })
    return
  }

  let atbildesKeys = Object.keys(atbildes)
  atbildesKeys.splice(0, 3)

  for (const key of atbildesKeys) {
    for(const text of atbildes[key].text) {
      if (content.includes(text)) {
        message.reply(atbTemplate(atbildes[key].atb, content, 1))
        return
      }
    }
  }
}