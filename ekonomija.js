import mongo from './mongo.js'
import profileSchema from './schemas/profile-schema.js'

// šis ir lietotāju cache, šis paātrina botu, jo samazina datubāzes pieprasījumus
let userCache = {}

export const findUser = async (guildId, userId) => {
  // meklē lietotāju cache, ja neatrod tad pieprasa datubāzei
  if (userCache[`${guildId}-${userId}`]) {
    const result = userCache[`${guildId}-${userId}`]
    if (result.lati > result.data.maxMaksLati) result.data.maxMaksLati = result.lati

    return result
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
            itemCap: 100,
            itemCount: 0,
            items: {},
            fishing: {},
            cooldowns: {},
            dateCooldowns: {},
            status: {},
            data: {},
          }
          await new profileSchema(newSchema).save()
          result = JSON.parse(JSON.stringify(newSchema))
        }
        if (!result.items) result.items = {}
        if (!result.cooldowns) result.cooldowns = {}
        if (!result.dateCooldowns) result.dateCooldowns = {}
        if (!result.status) result.status = {}
        if (!result.fishing) result.fishing = {}
        if (!result.data) result.data = {}

        result.data.maxFeniksWin ||= 0
        result.data.maxFeniksLikme ||= 0

        if (!result.data?.maxMaksLati) result.data.maxMaksLati = result.lati

        if (guildId === '875083366611955712') result.itemCap = 99999

        if (!Object.keys(result.items).length) result.itemCount = 0
        else {
          result.itemCount = 0
          Object.keys(result.items).map(item => {
            result.itemCount += result.items[item]
          })
        }

        userCache[`${guildId}-${userId}`] = result
        return JSON.parse(JSON.stringify(result))
      } catch (e) {
        console.error(e)
      }
    })
  }
}

// atrod bagātākos lietotājus serverī, kā arī nosaka kopējo naudas cirkulāciju
export const getTop = async guildId => {
  return await mongo().then(async mongoose => {
    try {
      const result = await profileSchema.find().select({ lati: 1, userId: 1, guildId: 1, data: 1, items: 1 })
      return result.filter(r => r['guildId'] === guildId)
    } catch (e) {
      console.error(e)
    }
  })
}

export const addData = async (guildId, userId, newData) => {
  let { data } = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      Object.keys(newData).map(key => {
        if (isNaN(newData[key]) && newData[key].startsWith('='))
          data[key] = parseInt(newData[key].slice(1))
        else data[key] = data[key] ? data[key] + newData[key] : newData[key]
      })

      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { data }, {})

      userCache[`${guildId}-${userId}`].data = data
    } catch (e) {
      console.error(e)
    }
  })

}

// pievieno latus lietotājam
export const addLati = async (guildId, userId, lati) => {
  let result = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      result.lati += parseFloat(lati)

      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { lati: result.lati }, {})

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
  let { items, itemCount } = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      //console.log('fetched items:', items)

      Object.keys(itemsToAdd).map(item => {
        if (!items[item]) items[item] = itemsToAdd[item]
        else if ((items[item] + itemsToAdd[item]) <= 0) delete items[item]
        else items[item] += itemsToAdd[item]
      })

      Object.keys(itemsToAdd).map(item => itemCount += itemsToAdd[item])

      // gala rezultāts
      const result2 = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { items, itemCount }, {})


      // pievieno gala rezultātu cache
      userCache[`${guildId}-${userId}`].items = items
      userCache[`${guildId}-${userId}`].itemCount = itemCount
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

export const setDateCooldown = async (guildId, userId, command, useObj) => {
  return await mongo().then(async mongoose => {
    try {
      let { dateCooldowns } = await findUser(guildId, userId)

      const date = new Date()

      dateCooldowns[command] = {
        date: date.toDateString(),
        ...useObj
      }

      userCache[`${guildId}-${userId}`].dateCooldowns = dateCooldowns
      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { dateCooldowns }, { new: true, upsert: true })
    } catch (e) {
      console.error(e)
    }
  })
}

export const removeOneDateCooldown = async (guildId, userId, command) => {
  return await mongo().then(async mongoose => {
    try {
      let { dateCooldowns } = await findUser(guildId, userId)

      if (dateCooldowns[command].uses > 0) {
        dateCooldowns[command].uses--
      } else if (dateCooldowns[command].extraUses > 0) {
        dateCooldowns[command].extraUses--
      } else {
        return
      }

      userCache[`${guildId}-${userId}`].dateCooldowns = dateCooldowns
      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { dateCooldowns }, { new: true, upsert: true })
    } catch (e) {
      console.error(e)
    }
  })
}

export const setFishing = async (guildId, userId, fishingObj) => {
  return await mongo().then(async mongoose => {
    try {
      userCache[`${guildId}-${userId}`].fishing = {...fishingObj}
      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { fishing: fishingObj }, { new: true, upsert: true })
    } catch (e) {
      console.error(e)
    }
  })
}