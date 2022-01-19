import { embedSaraksts } from '../../../embeds/embeds.js'
import { getEmoji } from '../../../reakcijas/atbildes.js'

const spinText = [
  'Griežas',
  'Tiek kruķīts aparāts',
  'Šodien paveiksies',
  'Aparāts tiek barots',
  'Rēķina laimestu',
]

const loseText = [
  'Šodien neveicās',
  'Nākamreiz paveiksies',
  'Sakruķīts aparāts',
  'Aparāts tika pabarots',
]

const getColor = m => {
  let color = 0xff4230

  if (m >= 15) color = 0xf066ff
  else if (m >= 8) color = 0x9966ff
  else if (m >= 5) color = 0x66ffc2
  else if (m >= 2) color = 0x96ff66
  else if (m >= 1.1) color = 0xe0ff66
  else if (m >= 0.9) color = 0xffff66
  else if (m >= 0.7) color = 0xffd166
  else if (m >= 0.3) color = 0xff8f66
  else if (m > 0) color = 0xff7a66

  return color
}

export const fenkaEmbed = async (message, winRow, resLati, multiplier, likme, revealed = [], heat) => {
  let emojiRow = []

  if (revealed.length) {
    for (const emoji of revealed) {
      emojiRow.push(getEmoji([emoji]))
    }
  }

  if (emojiRow.length < winRow.arr.length) {
    for (let i = 0; i < winRow.arr.length - revealed.length; i++) {
      emojiRow.push(getEmoji(['fenka1'])[0])
    }
  }

  let title = spinText[Math.floor(Math.random() * spinText.length)] + '...'
  if (revealed.length) {
    title = resLati
      ? `Tu laimēji ${Math.floor(resLati)} latus (${multiplier.toFixed(2)}x)`
      : loseText[Math.floor(Math.random() * loseText.length)] + ' (tu neko nelaimēji)'
  }

  const fields = [
    {
      name: 'Likme',
      value: `${likme} lati`,
      inline: true,
    }, {
      name: 'Temperatūra',
      value: `${heat.toFixed(2)} °C`,
      inline: true,
    },
  ]

  let description
  let color = 0x000
  if (!revealed.length) {
    description = '>>⠀⠀' + emojiRow.join('⠀') + '⠀⠀<<'
  } else {
    color = getColor(multiplier)
    description = '**>>**⠀⠀' + emojiRow.join('⠀') + '⠀⠀**<<**'
  }

  return embedSaraksts(message, title, description, fields, '', color)
}