import mongoose from 'mongoose'

//mongodb://localhost:27017
//config.default.mongoPath

const mongo = async () => {
  await mongoose.connect(process.env.MONGOPATH)
  return mongoose
}

export default mongo
