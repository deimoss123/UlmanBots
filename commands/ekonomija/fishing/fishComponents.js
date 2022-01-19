import { findItem } from '../../../helperFunctions.js'
import { emojiList } from '../../../reakcijas/atbildes.js'
import { fishingRodList } from './generateFish.js'
import { findUser } from '../../../ekonomija.js'

let hasAvbRod = false

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const createBtnRow = (rand, { chosenRod, coughtFish, rodUsesLeft }, lati, guildId) => {

  let row = {
    type: 1,
    components: []
  }

  if (!chosenRod) {
    row.components.push({
      type: 2,
      style: 2,
      custom_id: `useRod ${rand}`,
      label: 'Sākt zvejot',
      disabled: true,
    })
  }

  if (Object.keys(coughtFish).length) {
    row.components.push({
      type: 2,
      style: 3,
      label: 'Savākt copi',
      custom_id: `collectFish ${rand}`,
    })
  }

  if (chosenRod) {
    let label = 'Noņemt makšķeri'
    let disabled = false
    let style = 1

    const repairCost = fishingRodList[chosenRod].costToRepair
      / fishingRodList[chosenRod].uses
      * (fishingRodList[chosenRod].uses - rodUsesLeft)


    if (rodUsesLeft < fishingRodList[chosenRod].uses) {
      label += ' (nav salabota)'
      style = 2
      disabled = true

      row.components.push({
        type: 2,
        style: 1,
        label: `Salabot makšķeri: ${floorTwo(repairCost)} lati`,
        custom_id: `fixRod ${rand}`,
        disabled: lati < repairCost,
        emoji: {
          name: '🔧',
          id: null
        }
      })
    }

    row.components.push({
      type: 2,
      style,
      label,
      disabled,
      custom_id: `removeRod ${rand}`,
    })

    row.components.push({
      type: 2,
      style: 4,
      label: 'SADEDZINĀT MAKŠĶERI: 0 LATI',
      custom_id: `burnRod ${rand}`,
      emoji: {
        name: '🔥',
        id: null
      }
    })
  }

  if (guildId === process.env.TESTSERVERID) {
    row.components.push({
      type: 2,
      style: 2,
      label: 'test',
      custom_id: `test ${rand}`,
    })
  }

  return row
}

export default async (rand, items, fishing, userId, guildId) => {
  let row = [{
    type: 1,
    components: []
  }]

  const { lati } = await findUser(guildId, userId)

  let availableRods = Object.keys(fishingRodList).filter(rod => items[rod])
  hasAvbRod = !!availableRods.length

  if (!fishing.chosenRod && hasAvbRod) {
    row[0].components.push(
      {
        type: 3,
        custom_id: `chooseRod ${rand}`,
        placeholder: 'Izvēlies makšķeri',
        min_value: 1,
        max_values: 1,
        options: availableRods.map(rod => {
          return {
            label: findItem(rod).nameNomVsk,
            value: rod,
            emoji: {
              name: `_${rod}`,
              id: emojiList[`_${rod}`].startsWith('a')
                ? emojiList[`_${rod}`].slice(1)
                : emojiList[`_${rod}`]
            }
          }
        })
      })

    row.push(createBtnRow(rand, fishing, lati, guildId))
  } else {
    row = [createBtnRow(rand, fishing, lati, guildId)]
  }

  return row[0].components.length ? row : []
}
