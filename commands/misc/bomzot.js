import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, addLati, checkStatus, findUser } from '../../ekonomija.js'
import { buttonEmbed, embedError, embedTemplate } from '../../embeds/embeds.js'
import pardot from '../ekonomija/pardot.js'
import izmantot from '../items/izmantot.js'

export default {
  title: 'Bomžot',
  description: 'Iet atkritumu meklējumos',
  commands: ['bomzot', 'bomzis'],
  cooldown: 1800000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    const { itemCount, itemCap } = await findUser(guildId, userId)

    if (!await checkStatus(guildId, userId, 'bomzis')) {
      message.reply(embedError(message, 'Bomžot', 'Lai bomžotu tev ir nepieciešams bomža status' +
        ' to var iegūt izmantojot odekolonu, ko var iegūt no ubagošanas, komanda - `.ubagot`'))
      return 2
    }

    if (itemCap - itemCount < 1) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(embedError(message, 'Bomžot',
        `Lai bomžotu tev vajag vismaz 1 brīvu vietu inventārā\n` +
        `Tev inventārā ir **${vietas}** brīvas vietas`))
      return 2
    }


    const rand = Math.floor(Math.random() * 100000)
    const row = [{
      type: 1,
      components: [{
          type: 2,
          label: 'Meklēt atkritumus',
          style: 1,
          custom_id: `atkr ${rand}`
        }, {
          type: 2,
          label: 'Gulēt tramvajā',
          style: 1,
          custom_id: `tramv ${rand}`,
        }, {
          type: 2,
          label: 'Zagt',
          style: 1,
          custom_id: `apzagt ${rand}`
        }]
    }]

    const { items } = await findUser(guildId, userId)
    if (items?.oditiscitrus) {
      row[0].components.push({
        type: 2,
        label: 'Tirgot odekolonu',
        style: 1,
        custom_id: `tirgotCitrus ${rand}`
      })
    }

    const bomzChance = {
      atkr: {
        iekristMiskastē: {
          chance: '*',
          text: 'Tev uz galvas uzkrita miskaste un tu neko neatradi'
        },
        meklētAtkritumus: {
          chance: 0.9,
          text: 'Tu devies atkritumu meklējumos un atradi',
          min: 2,
          max: 4,
          itmList: () => {
            const itmList = {...itemList.atkritumi}
            delete itmList.oditiscitrus
            delete itmList.etalons
            return itmList
          }
        },
      },
      tramv: {
        izmests: {
          chance: "*",
          text: 'Tu tiki izmests no tramvaja'
        },
        dabutEtal: {
          chance: 0.5,
          text: 'Tu iekāpi tramvajā un atradi',
          min: 2,
          max: 4,
          itmList: () => { return { etalons: itemList.atkritumi.etalons} }
        },
      },
      apzagt: {
        piekava: {
          chance: '*',
          text: 'Tevi piekāva tavi kolēģi'
        },
        pusdienas: {
          chance: 0.5,
          text: 'Tu nozagi Koļas pusdienas, ',
          min: 1,
          max: 1,
          itmList: () => { return {
            draudzinzivs: itemList.zivis.draudzinzivs,
            daundizvs: itemList.zivis.daundizvs
          }}
        },
        veikals: {
          chance: 0.2,
          text: 'Tu apzagi veikalu un ieguvi ',
          min: 1,
          max: 1,
          itmList: () => { return {
            virve: itemList.veikals.virve,
            latloto: itemList.veikals.latloto,
            zemenurasens: itemList.veikals.zemenurasens
          }}
        }
      },
      tirgotCitrus: {
        nozaga: {
          chance: '*',
          text: 'Vietējie bomži tev nozaga odekolonu'
        },
        izdzeri: {
          chance: 0.2,
          text: 'Tu nevarēji atturēties un odekolonu izdzēri'
        },
        pardevi: {
          chance: 0.6,
          text: 'Tu notirgoji odekolonu par '
        }
      }
    }

    await buttonEmbed(message, 'Bomžot', 'Ko tu vēlies darīt?', null, row, async i => {
      if (i.customId === `tirgotCitrus ${rand}`) {
        const res = chance(bomzChance.tirgotCitrus)
        let txt = bomzChance.tirgotCitrus[res].text
        switch (res) {
          case 'nozaga' : {
            await addItems(guildId, userId, { oditiscitrus: -1 })
          } break
          case 'izdzeri': {
              await izmantot.callback(message, ['1'], null, null, i, 'oditiscitrus', 0)
          } break
          case 'pardevi': {
            const lati = Math.floor(((Math.random() * 20) + 10) * 100) / 100
            await addItems(guildId, userId, { oditiscitrus: -1 })
            await addLati(guildId, userId, lati)
            txt += `${lati} latiem`
          } break
        }
        message.reply(embedTemplate(message, 'Bomžot', txt, 'atkritumi'))
        return { id: `tirgotCitrus ${rand}`, all: 1 }
      }

      if (row[0].components.find(b => b.custom_id === i.customId)) {
        const id = i.customId.replace(/ .*/,'')
        await bomzot(bomzChance[id][chance(bomzChance[id])])
        return { id: i.customId, all: 1 }
      }
    })

    const bomzot = async res => {

      if (!res?.itmList) {
        message.reply(embedTemplate(message, 'Bomžot', res.text, 'atkritumi'))
        return
      }

      let items = {}

      // izvēlās atkritumu daudzumu
      const itemCount = Math.floor((Math.random() * ( res.max - res.min + 1 )) + res.min)

      // izvēlās randomā noteiktu itemu daudzumu
      for (let i = 0; i < itemCount; i++) {
        const item = chance(res.itmList())
        items[item] = items[item] ? items[item] + 1 : 1
      }

      const rand = Math.floor(Math.random() * 100000)
      let row = [{
        type: 1,
        components: [{
          type: 2,
          label: 'Pārdot visus nelietojamos atkritumus',
          style: 1,
          custom_id: `pardAtkr ${rand}`
        }]
      }]

      let counts = {}
      Object.keys(items).map(item => {
        if (itemList.atkritumi[item]?.use) {
          counts[item] = items[item]
          row[0].components.push({
            type: 2,
            label: `Izmantot ${itemList.atkritumi[item].nameAkuVsk} (${counts[item]})`,
            style: 2,
            custom_id: `izmantot ${item} ${rand}`
          })
        }
      })

      await buttonEmbed(message, 'Bomžot', `${res.text} ${stringifyItems(items)}`, 'atkritumi', row,
        async i => {
          if (i.customId === `pardAtkr ${rand}`) {
            await pardot.callback(message, ['a'], null, null, i)
            return { id: `pardAtkr ${rand}`}
          } else {
            for (const item in counts) {
              if (i.customId === `izmantot ${item} ${rand}`) {
                await izmantot.callback(message, ['1'], null, null, i, item)
                console.log(counts)
                counts[item] -= 1

                return { id: `izmantot ${item} ${rand}`,
                  value: `Izmantot ${itemList.atkritumi[item].nameAkuVsk} (${counts[item]})`,
                  disable: counts[item] <= 0 }
              }
            }
          }
        })

      await addItems(guildId, userId, items)
    }
    return 1
  },
}