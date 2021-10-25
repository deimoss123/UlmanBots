import mongoose from 'mongoose'

const reqString = {
  type: String,
  required: true
}

const mutesSchema = new mongoose.Schema({
  _id: reqString,
  guildId: reqString,
  userId: reqString,
  adminId: reqString,
  expires: {
    type: Number,
    required: true
  },
  current: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model('mutes', mutesSchema)
