import mongo from './mongo.js'
import profileSchema from './schemas/profile-schema.js'

// šis ir lietotāju cache, šis paātrina botu, jo samazina datubāzes pieprasījumus
let userCache = {}

export const findUser = async (guildId, userId) => {
  console.log('running findUser()')

  // meklē lietotāju cache, ja neatrod tad pieprasa datubāzei
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

        // ja lietoājs nepastāv, izveido jaunu profile schema
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

// atrod bagātākos lietotājus serverī, kā arī nosaka kopējo naudas cirkulāciju
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

      console.log('addLati() result: ', result)

      // pievieno gala rezultātu cache
      userCache[`${guildId}-${userId}`].lati = result.lati
      return result.lati
    } finally {
      await mongoose.connection.close()
    }
  })
}

// pievieno itemus lietotājam
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

      // gala rezultāts
      const result2 = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      }, { items: itemsdb, }, {})

      // pievieno gala rezultātu cache
      userCache[`${guildId}-${userId}`].items = itemsdb
      console.log('addItems() result: ', itemsdb)
      return result2
    } finally {
      await mongoose.connection.close()
    }
  })
}
