import { findItem, stringifyItemsList2, stringifyOne, } from '../../../helperFunctions.js'
import { addItems, addLati, findUser, setFishing } from '../../../ekonomija.js'
import { buttonEmbed, noPing } from '../../../embeds/embeds.js'
import fishEmbed from './fishEmbed.js'
import fishComponents from './fishComponents.js'
import generateFish, { fishingRodList } from './generateFish.js'
import { updateFish } from './fishingHandler.js'
import { getEmoji } from '../../../reakcijas/atbildes.js'

const dbTemplate = {
  chosenRod: '',
  rodUsesLeft: 0,
  fish: {},
  lastCatch: {},
  coughtFish: {},
  fishLimit: 10,
  fishCount: 0,
}

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const getRepairCost = fishing => {
  return fishingRodList[fishing.chosenRod].costToRepair
    / fishingRodList[fishing.chosenRod].uses
    * (fishingRodList[fishing.chosenRod].uses - fishing.rodUsesLeft)
}

export default {
  title: 'Zvejot',
  description: 'Zvejot dižLatvijas ezeros',
  commands: ['zvejot', 'makskeret', 'copet', 'cope', 'zveja', 'zivs', 'zive', 'zuvis', 'zivjot'],
  cooldown: 0,
  callback: async message => {
    const { guildId } = message
    const userId = message.author.id

    let { items, fishing } = await findUser(guildId, userId)

    if (!Object.keys(fishing).length) {
      fishing = JSON.parse(JSON.stringify(dbTemplate))
      await setFishing(guildId, userId, fishing)
    } else {
      fishing = await updateFish(fishing)
    }

    const rand = Math.floor(Math.random() * 100000)
    let row = await fishComponents(rand, items, fishing, userId, guildId)

    let selectedRod

    await buttonEmbed({
      message,
      commandTitle: 'Zvejot',
      fields: fishEmbed(fishing, items),
      row,
      color: 0x3fa7e8,
      cb: async i => {
        if (i.customId === `test ${rand}`) {
          fishing = await updateFish(fishing)

          return {
            id: `test ${rand}`,
            dontDisable: true,
            editFields: fishEmbed(fishing, items),
            editComponents: await fishComponents(rand, items, fishing, userId, guildId),
          }
        }

        if (i.customId === `chooseRod ${rand}`) {
          fishing = await updateFish(fishing)
          row[1].components[0].disabled = false
          row[1].components[0].style = 1
          row[1].components[0].emoji = {
            name: 'zive',
            id: '920844107583221782',
            animated: true
          }
          selectedRod = i.values[0]

          return {
            id: `chooseRod ${rand}`,
            editComponents: row,
            value: findItem(selectedRod).nameNomVsk,
          }
        }

        if (i.customId === `useRod ${rand}`) {
          fishing = await updateFish(fishing)
          if (!selectedRod) return

          const { items } = await findUser(guildId, userId)

          if (items[selectedRod]) {
            let rodObj = {}
            rodObj[selectedRod] = -1

            fishing.fish = generateFish(selectedRod)
            fishing.chosenRod = selectedRod
            fishing.rodUsesLeft = fishingRodList[selectedRod].uses
            await setFishing(guildId, userId, fishing)
            await addItems(guildId, userId, rodObj)
          } else {
            message.reply(noPing(
              `Tavā inventārā nav ${getEmoji([`_${selectedRod}`])} ${findItem(selectedRod).nameNomVsk}`))
          }

          return {
            id: `useRod ${rand}`,
            editFields: fishEmbed(fishing, items),
            editComponents: await fishComponents(rand, items, fishing, userId, guildId),
          }
        }

        if (i.customId === `collectFish ${rand}`) {
          fishing = await updateFish(fishing)

          const { itemCount, itemCap } = await findUser(guildId, userId)
          if (itemCap - itemCount < fishing.fishCount) {
            return {
              id: `collectFish ${rand}`,
              editFields: fishEmbed(fishing, items),
              editComponents: await fishComponents(rand, items, fishing, userId, guildId),
              dontDisable: true,
              after: () => {
                message.reply(noPing(`Tev nepietiek brīvas vietas inventārā lai savāktu zivis\n` +
                `Tev ir **${(itemCap - itemCount) <= 0 ? 0 : itemCap - itemCount}** brīvas vietas\n` +
                `Tev vajag **${fishing.fishCount}** brīvas vietas`))
              }
            }
          }

          const tempCoughtFish = {...fishing.coughtFish}
          fishing.coughtFish = {}
          fishing.fishCount = 0

          if (fishing.rodUsesLeft) {
            const newGeneratedFish = generateFish(fishing.chosenRod, fishing.rodUsesLeft)
            let nextFish = {}

            if (Object.keys(fishing.fish).length) {
              const tempFishTime = Object.keys(fishing.fish)[0]
              nextFish[tempFishTime] = newGeneratedFish[Object.keys(newGeneratedFish)[0]]

              delete newGeneratedFish[Object.keys(newGeneratedFish)[0]]
            }

            fishing.fish = {...nextFish, ...newGeneratedFish}
          }

          fishing = await updateFish(fishing)
          await setFishing(guildId, userId, fishing)
          await addItems(guildId, userId, tempCoughtFish)

          return {
            id: `collectFish ${rand}`,
            editFields: fishEmbed(fishing, items),
            editComponents: await fishComponents(rand, items, fishing, userId, guildId),
            after: () => {
              message.reply(noPing('', [{
                name: 'Tu savāci copi:',
                value: stringifyItemsList2(tempCoughtFish)
              }]))
            }
          }
        }

        if (i.customId === `removeRod ${rand}` || i.customId === `burnRod ${rand}`) {
          fishing = await updateFish(fishing)
          let txt = 'tika sadedzināta'

          if (i.customId === `removeRod ${rand}`) {
            let rodObj = {}
            rodObj[fishing.chosenRod] = 1
            await addItems(guildId, userId, rodObj)
            txt = 'tika pievienota tavam inventāram'
          }

          const tempRod = fishing.chosenRod
          fishing.chosenRod = ''
          fishing.fish = {}

          await setFishing(guildId, userId, fishing)
          return {
            id: i.customId,
            editFields: fishEmbed(fishing, items),
            editComponents: await fishComponents(rand, items, fishing, userId, guildId),
            after: () => {
              message.reply(noPing(`${stringifyOne(tempRod)} ${txt}`))
            }
          }
        }

        // Salabot makšķeri
        if (i.customId === `fixRod ${rand}`) {
          const repairCost = getRepairCost(fishing)
          const { lati } = await findUser(guildId, userId)

          fishing = await updateFish(fishing)

          if (lati < floorTwo(repairCost)) {
            return {
              id: `fixRod ${rand}`,
              editFields: fishEmbed(fishing, items),
              editComponents: await fishComponents(rand, items, fishing, userId, guildId),
              dontDisable: true,
              after: () => {
                message.reply(noPing(`Tev nepietiek naudas lai salabotu makšķeri`))
              }
            }
          }

          await addLati(guildId, userId, floorTwo(repairCost) * -1)

          fishing.rodUsesLeft = fishingRodList[fishing.chosenRod].uses

          const newGeneratedFish = generateFish(fishing.chosenRod)
          let nextFish = {}

          if (Object.keys(fishing.fish).length) {
            const tempFishTime = Object.keys(fishing.fish)[0]
            nextFish[tempFishTime] = newGeneratedFish[Object.keys(newGeneratedFish)[0]]

            delete newGeneratedFish[Object.keys(newGeneratedFish)[0]]
          }

          fishing.fish = {...nextFish, ...newGeneratedFish}
          fishing = updateFish(fishing)
          await setFishing(guildId, userId, fishing)

          return {
            id: `fixRod ${rand}`,
            editFields: fishEmbed(fishing, items),
            editComponents: await fishComponents(rand, items, fishing, userId, guildId),
            after: () => {
              message.reply(noPing(`Tu salaboji makšķeri par **${floorTwo(repairCost)}** latiem`))
            }
          }
        }
      },
    })

    return 1
  },
}