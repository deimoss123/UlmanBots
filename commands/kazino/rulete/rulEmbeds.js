import { embedSaraksts } from '../../../embeds/embeds.js'
import { checkWin } from './rulHandler.js'
import { rulEmojis } from './rulEmojis.js'

export const pozicijasLat = {
  b: 'Melns',
  r: 'Sarkans',
  g: 'Zaļš',
  even: 'Pāra',
  odd: 'Nepāra',
  high: 'Augsts',
  low: 'Zems'
}

export const rulEmbed = (message, pozicija, likme, winNum) => {
  let title = 'Griežas...'
  let description = '⠀\n'

  for (let i = 1; i <= 6; i++) {
    description += `<a:spin_${i}:${rulEmojis[`spin_${i}`]}>`
    if (i === 3) description += '\n'
  }

  let embedColor = 0x000000

  if (winNum) {
    title = 'Tu zaudēji :('
    embedColor = 0xf04c3a
    const { num, color } = winNum

    const multiplier = checkWin(pozicija, num, color)
    if (multiplier) {
      embedColor = 0x3fe863
      title = `Tu laimēji ${likme * multiplier} latus (${multiplier}x)`
      if (multiplier > 2) embedColor = 0xdf3ef7
    }

    description = `**${num} ${pozicijasLat[color]}**\n`

    for (let i = 1; i <= 6; i++) {
      const emojiNum = `${num < 10 ? '0' : ''}${num}`

      description += `<:rul_${i}_${emojiNum}:${rulEmojis[`rul_${i}_${emojiNum}`]}>`
      if (i === 3) description += '\n'
    }
  }

  if (isNaN(pozicija)) pozicija = pozicijasLat[pozicija]

  let fields = [{
    name: 'Pozīcija:',
    value: pozicija,
    inline: true
  }, {
    name: 'Likme:',
    value: `${likme} lati`,
    inline: true
  }]

  return embedSaraksts(message, title, description, fields, '', embedColor)
}