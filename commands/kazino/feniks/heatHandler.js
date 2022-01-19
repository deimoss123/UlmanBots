import { redisEnabled } from '../../../index.js'
import redis from '../../../redis.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const calculateHeat = (currentTime, heat, heatTime, likme) => {
  heat = parseFloat(heat)
  heatTime = parseInt(heatTime)
  likme = parseInt(likme)

  let newHeat = heat
  let timePassed = Math.floor((currentTime - heatTime) / 100)

  while (timePassed > 0) {
    newHeat -= Math.floor(newHeat / 5) * 0.01
    timePassed--
    if (newHeat < 20) break
  }

  if (newHeat < 20) newHeat = 20
  newHeat += floorTwo(likme / 20)

  if (isNaN(newHeat)) {
    console.log('Heat NaN:')
    console.log(newHeat)
    //newHeat = 20
  }

  return newHeat
}

export const getHeat = async (guildId, likme) => {
  if (!redisEnabled) return 20
  const redisClient = await redis()

  let heat = await new Promise(async (res, rej) => {
    redisClient.hget('heat', guildId, (err, r) => {
      if (err) return rej(err)
      return res(r)
    })
  })

  let heatTime = await new Promise(async (res, rej) => {
    redisClient.hget('heatTime', guildId, (err, r) => {
      if (err) return rej(err)
      return res(r)
    })
  })

  const currentTime = Date.now()

  if (!heat) heat = 20
  if (!heatTime) heatTime = currentTime - 1000

  const newHeat = calculateHeat(currentTime, heat, heatTime, likme)

  await redisClient.hset('heat', guildId, newHeat)
  await redisClient.hset('heatTime', guildId, currentTime)

  return newHeat
}