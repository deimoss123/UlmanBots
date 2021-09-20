import mongoose from 'mongoose'

const reqString = {
  type: String,
  required: true
}

const profileSchema = new mongoose.Schema({
  _id: reqString,
  guildId: reqString,
  userId: reqString,
  lati: {
    type: Number,
    required: true
  },
  items: {
    type: Object,
    required: true
  }
})

export default mongoose.model('profiles', profileSchema)