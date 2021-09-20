import mongoose from 'mongoose'

// savienojas ar mongo datubāzi izmantojot mongoose
const mongo = async () => {
  await mongoose.connect(process.env.MONGOPATH)
  return mongoose
}

export default mongo
