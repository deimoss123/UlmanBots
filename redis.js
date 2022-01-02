import redis from 'redis'

export default async () => {
  return await new Promise((res, rej) => {
    const client = redis.createClient({
      url: 'redis://localhost:6380'
    })

    client.on('error', err => {
      console.error('Redis error:', err)
      client.quit()
      rej(err)
    })

    client.on('ready', () => {
      res(client)
    })
  })
}