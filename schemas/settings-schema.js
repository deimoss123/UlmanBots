import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  allowedChannels: { type: Array },
})

export default mongoose.model('setting', settingsSchema)