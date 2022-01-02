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
    required: true,
  },
  itemCap: { type: Number },
  itemCount: { type: Number },
  items: { type: Object, },
  fishing: { type: Object },
  status: { type: Object, },
  cooldowns: { type: Object, },
  dateCooldowns: { type: Object },
  data: { type: Object }
})

export default mongoose.model('profiles', profileSchema)