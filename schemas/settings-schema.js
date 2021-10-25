import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  _id: { type: String },
  kaktsRole: { type: String },

  modRoles: { type: Array },
  spamChannels: { type: Array },
  autoDeleteChannels: { type: Array },
  autoRoles: { type: Array },
})

export default mongoose.model('setting', settingsSchema)