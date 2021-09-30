import mongo from './mongo.js'
import profileSchema from './schemas/profile-schema.js'
import kaktsSchema from './schemas/kakts-schema.js'
import { kaktsRole } from './index.js'

// šis ir lietotāju cache, šis paātrina botu, jo samazina datubāzes pieprasījumus
let userCache = {}
let kaktsCache = { test: 'test' }

export const findUser = async (guildId, userId) => {
  // meklē lietotāju cache, ja neatrod tad pieprasa datubāzei
  if (userCache[`${guildId}-${userId}`]) {
    return userCache[`${guildId}-${userId}`]
  } else {
    return await mongo().then(async mongoose => {
      try {
        let result = await profileSchema.findOne({
          guildId,
          userId,
        })

        // ja lietoājs nepastāv, izveido jaunu profile schema
        if (!result) {
          const newSchema = {
            _id: `${guildId}-${userId}`,
            guildId,
            userId,
            lati: 0,
            items: {},
            cooldowns: {},
            status: {},
          }
          await new profileSchema(newSchema).save()
          result = newSchema
        }
        if (!result.items) result.items = {}
        if (!result.cooldowns) result.cooldowns = {}
        if (!result.status) result.status = {}

        console.log('findUser() result: ', result)
        userCache[`${guildId}-${userId}`] = result
        return result
      } catch (e) {
        console.error(e)
      }
    })
  }
}

// atrod bagātākos lietotājus serverī, kā arī nosaka kopējo naudas cirkulāciju
export const getTop = async (guildId) => {
  console.log('running getTop()')
  return await mongo().then(async mongoose => {
    try {
      const result = await profileSchema.find().
        sort({ 'lati': -1 }).
        select({ lati: 1, userId: 1, guildId: 1 })

      return result.filter(r => r['guildId'] === guildId)
    } catch (e) {
      console.error(e)
    }
  })
}

// pievieno latus lietotājam
export const addLati = async (guildId, userId, lati) => {
  console.log('running addLati()')
  let result = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      result.lati += parseFloat(lati)

      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { lati: result.lati }, {})

      //console.log('addLati() result: ', result)

      // pievieno gala rezultātu cache
      userCache[`${guildId}-${userId}`].lati = result.lati
      return result.lati
    } catch (e) {
      console.error(e)
    }
  })
}

// pievieno itemus lietotājam
// ja isAdd = 1 tad itemus pievienos, ja ir 0 tad tos itemus noņems
export const addItems = async (guildId, userId, itemsToAdd) => {
  console.log('running addItems()')
  let { items } = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      //console.log('fetched items:', items)
      console.log('items to add:', itemsToAdd)

      Object.keys(itemsToAdd).map(item => {
        if (!items[item]) items[item] = itemsToAdd[item]
        else if (!(items[item] + itemsToAdd[item])) delete items[item]
        else items[item] += itemsToAdd[item]
      })

      //console.log('new items:', items)

      // gala rezultāts
      const result2 = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { items }, {})

      // pievieno gala rezultātu cache
      userCache[`${guildId}-${userId}`].items = items
      return result2
    } catch (e) {
      console.error(e)
    }
  })
}

export const addStatus = async (guildId, userId, newStatus) => {
  return await mongo().then(async mongoose => {
    try {
      let { status } = await findUser(guildId, userId)

      Object.keys(newStatus).map(key => {
        if (status[key] < Date.now()) status[key] = 0
        status[key] = status[key] ? status[key] + newStatus[key] : newStatus[key] + Date.now()
      })

      userCache[`${guildId}-${userId}`].status = status
      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { status }, { new: true, upsert: true })
      return status
    } catch (e) {
      console.error(e)
    }
  })
}

export const checkStatus = async (guildId, userId, statusName) => {
  return await mongo().then(async mongoose => {
    try {
      let { status } = await findUser(guildId, userId)

      if (status[statusName]) {
        if (status[statusName] <= Date.now()) {
          delete status[statusName]

          userCache[`${guildId}-${userId}`].status = status
          await profileSchema.findOneAndUpdate({
            guildId,
            userId,
          }, { status }, {})

          return 0
        } else return status[statusName] - Date.now()
      }
    } catch (e) {
      console.error(e)
    }
  })
}

export const addCooldown = async (guildId, userId, command) => {
  return await mongo().then(async mongoose => {
    try {
      let { cooldowns } = await findUser(guildId, userId)

      cooldowns[command] = Date.now()

      userCache[`${guildId}-${userId}`].cooldowns = cooldowns
      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { cooldowns }, { new: true, upsert: true })
    } catch (e) {
      console.error(e)
    }
  })
}

export const addKakts = async (guildId, userId, time, isAdd = 1) => {
  return await mongo().then(async mongoose => {
    try {
      const kakti = kaktsCache

      if (isAdd) {
        const timeToAdd = Date.now() + time
        kakti[`${guildId}-${userId}`] = timeToAdd
      } else {
        if (!kakti[`${guildId}-${userId}`]) return 0
        delete kakti[`${guildId}-${userId}`]
      }

      kaktsCache = kakti
      await kaktsSchema.findOneAndUpdate({ _id: 'test' }, { kakti })
      return 1
    } catch (e) {
      console.error(e)
    }
  })
}

export const cacheKaktus = async () => {
  await mongo().then(async mongoose => {
    const result = await kaktsSchema.find()
    kaktsCache = result[0].kakti
  })
}

export const checkKakts = async () => {
  if (Object.keys(kaktsCache).length === 1) return

  return await mongo().then(async mongoose => {
    try {
      Object.keys(kaktsCache).map(async id => {
        if (id !== 'test') {
          if (kaktsCache[id] <= Date.now()) {
            const args = id.split('-')
            await addKakts(args[0], args[1], 0, 0)
            await kaktsRole(args[0], args[1], 0)
          }
        }

      })
    } catch (e) {
      console.error(e)
    }
  })
}
