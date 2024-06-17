import { Schema, model } from 'mongoose'

const messageSchema = new Schema(
  {
    text: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    seen: {
      type: Boolean,
      default: false
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }
)

export default model('Message', messageSchema)
