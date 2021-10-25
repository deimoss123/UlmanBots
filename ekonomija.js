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
            cooldowns: {},
            status: {},
            data: {}
          }
          await new profileSchema(newSchema).save()
          result = newSchema
        }
        if (!result.items) result.items = {}
        if (!result.cooldowns) result.cooldowns = {}
        if (!result.status) result.status = {}
        if (!result.data) result.data = {}

        result.data.maxFeniksWin ||= 0
        result.data.maxFeniksLikme ||= 0

        if (!result.data?.maxMaksLati) result.data.maxMaksLati = result.lati

        result.itemCap = 100

        if (!Object.keys(result.items).length) result.itemCount = 0
        else {
          result.itemCount = 0
          Object.keys(result.items).map(item => {
            result.itemCount += result.items[item]
          })
        }

        userCache[`${guildId}-${userId}`] = result
        return result
      } catch (e) {
        console.error(e)
      }
    })
  }
}

// atrod bagātākos lietotājus serverī, kā arī nosaka kopējo naudas cirkulāciju
export const getTop = async (guildId, type = 'lati') => {
  console.log('running getTop()')
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
  console.log('running addData()')
  let { data } = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      Object.keys(newData).map(key => {
        console.log(newData[key])
        if (isNaN(newData[key]) && newData[key].startsWith('='))
          data[key] = parseInt(newData[key].slice(1))
        else data[key] = data[key] ? data[key] + newData[key] : newData[key]
      })

      await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { data }, {})

      console.log(data, newData)
      userCache[`${guildId}-${userId}`].data = data
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
  let { items, itemCount } = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {
      //console.log('fetched items:', items)
      console.log('items to add:', itemsToAdd)

      Object.keys(itemsToAdd).map(item => {
        if (!items[item]) items[item] = itemsToAdd[item]
        else if (!(items[item] + itemsToAdd[item])) delete items[item]
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