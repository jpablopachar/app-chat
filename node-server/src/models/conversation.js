import { Schema, model } from 'mongoose'

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  { timestamps: true }
)

export default model('Conversation', conversationSchema)
