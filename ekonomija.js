import mongo from './mongo.js'
import profileSchema from './schemas/profile-schema.js'

let userCache = {}

export const findUser = async (guildId, userId) => {
  console.log('running findUser()')
  if (userCache[`${guildId}-${userId}`]) {
    console.log('found user in cache', userCache[`${guildId}-${userId}`])
    return userCache[`${guildId}-${userId}`]
  } else {
    return await mongo().then(async mongoose => {
      try {
        let result = await profileSchema.findOne({
          guildId,
          userId,
        })

        if (!result) {
          const newSchema = {
            _id: `${guildId}-${userId}`,
            guildId,
            userId,
            lati: 0,
            items: {},
          }
          await new profileSchema(newSchema).save()
          result = newSchema
        }
        if (!result.items) result.items = {}

        console.log('findUser() result: ', result)
        userCache[`${guildId}-${userId}`] = result
        return result
      } finally {
        await mongoose.connection.close()
      }
    })
  }
}

// šitais nestrādā
export const getTop = async () => {
  console.log('running getTop()')
  return await mongo().then(async mongoose => {
    try {
      const result = await profileSchema.find().sort({ 'lati': -1 }).select({ lati:1, userId:1, guildId:1 })
      console.log('getTop() result: ', result)
      return result
    } finally {
      await mongoose.connection.close()
    }
  })
}

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

      console.log('addLati() result: ', result)

      userCache[`${guildId}-${userId}`].lati = result.lati
      return result.lati
    } finally {
      await mongoose.connection.close()
    }
  })
}

// ja isAdd = 1 tad itemus pievienos, ja ir 0 tad tos itemus noņems
export const addItems = async (guildId, userId, items, isAdd) => {
  console.log('running addItems()')
  const result = await findUser(guildId, userId)

  return await mongo().then(async mongoose => {
    try {

      console.log('items to add: ', items)

      let itemsdb = await result.items ? result.items : {}

      if (isAdd) {
        items.map(item => {
          itemsdb[item] = itemsdb[item] ? itemsdb[item] + 1 : 1
        })
      } else {
        items.map(item => {
          if (itemsdb[item] === 1) {
            delete itemsdb[item]
          } else itemsdb[item]--
        })
      }

      const result2 = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { items: itemsdb, }, {})

      userCache[`${guildId}-${userId}`].items = itemsdb
      console.log('addItems() result: ', itemsdb)
      return result2
    } finally {
      await mongoose.connection.close()
    }
  })
}
