import { findItem, stringifyItemsList, timeToText } from '../../../helperFunctions.js'
import { getEmoji } from '../../../reakcijas/atbildes.js'
import { fishingRodList } from './generateFish.js'

export default (fishing, items) => {

  //const { chosenRod, rodUsesLeft, fish, lastCatch, coughtFish, fishLimit }

  // nosaka nākamo ķēriena laiku
  let nextCatchTime
  if (Object.keys(fishing.fish)) nextCatchTime = parseInt(Object.keys(fishing.fish)[0])
  const dateNext = !nextCatchTime ? '-' : new Date(nextCatchTime)

  // pēdējais ķēriens
  let prevCatchStr = '-'

  if (fishing.lastCatch?.item) {

    const { item, time } = fishing.lastCatch

    const datePrev = new Date(time)
    const prevCatchName = Object.keys(item)[0]
    const prevItem = findItem(prevCatchName)

    prevCatchStr = `\`${datePrev.toLocaleString('en-GB')}\`\n` +
      `${getEmoji([`_${prevCatchName}`])} ` +
      `${prevItem.nameNomVsk.charAt(0).toUpperCase() + prevItem.nameNomVsk.slice(1)} ` +
      `x${item[prevCatchName]}`
  }

  let fields = []
  let str = ''

  const availableRods = Object.keys(fishingRodList).filter(rod => items[rod])

  if (!availableRods.length && !fishing.chosenRod) {
    str += '- Makšķere (lētāko makšķeri var nopirkt veikalā)\n'
  }

  if (!fishing.rodUsesLeft && fishing.chosenRod) {
    str += '- Salabot makšķeri\n'
  }

  if (fishing.fishCount >= fishing.fishLimit) {
    str += '- Savākt copi (pievienot inventāram)\n'
  }

  if (str) fields.push({
    name: ':exclamation: Lai zvejotu tev ir nepieciešams: :exclamation:',
    value: str,
  })

  // nākamais ķēriens
  const nextCatchStr = !nextCatchTime ? '-'
    : `\`${dateNext.toLocaleString('en-GB')}\`` +
    `\nPēc ${timeToText(nextCatchTime - Date.now(), 1)}`

  // makšķere
  let rodStr = '-'

  if (fishing.chosenRod) {
    const { rodUsesLeft, chosenRod } = fishing
    const { nameNomVsk } = findItem(chosenRod)

    rodStr = `${getEmoji([`_${chosenRod}`])} ${nameNomVsk} (${rodUsesLeft}/${fishingRodList[chosenRod].uses})`
  }

  // cope
  let copeStr = `${getEmoji(['udenszive'])}${getEmoji(['cope1'])}${getEmoji(['cope2'])}${getEmoji(['udenszive'])}` +
    ` **(${fishing.fishCount}/${fishing.fishLimit})**`
  let coughtFishArr = []

  if (!Object.keys(fishing.coughtFish).length) {
    copeStr += '\n-'
  } else {
    coughtFishArr = stringifyItemsList(fishing.coughtFish)
  }

  fields.push({
    name: 'Izvēlētā makšķere',
    value: rodStr,
  }, {
    name: 'Nākamais ķēriens',
    value: nextCatchStr,
    inline: true,
  }, {
    name: 'Pēdējais ķēriens',
    value: prevCatchStr,
    inline: true,
  }, {
    name: '⠀ ',
    value: copeStr,
  }, ...coughtFishArr)

  return fields
}