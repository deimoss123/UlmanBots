import mongoose from 'mongoose'

const kaktsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  kakti: {
    type: Object,
    required: true
  }
})

export default mongoose.model('kakti', kaktsSchema)