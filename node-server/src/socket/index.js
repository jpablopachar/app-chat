import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { getConversation } from '../helpers/getConversation.js'
import { getUserDetailsFromToken } from '../helpers/getUserDetailsFromToken.js'
import Conversation from '../models/conversation.js'
import Message from '../models/message.js'
import User from '../models/user.js'

const app = express()

const server = http.createServer(app)

const io = new Server(server)

const onlineUser = new Set()

io.on('connection', async (socket) => {
  console.log('Connect user', socket.id)

  const token = socket.handshake.auth.token

  const user = await getUserDetailsFromToken(token)

  socket.join(user?._id.toString())
  onlineUser.add(user?._id.toString())

  io.emit('onlineUser', Array.from(onlineUser))

  socket.on('message-page', async (userId) => {
    console.log('UserId: ', userId)

    const userDetails = await User.findById(userId).select('-password')

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      image: userDetails?.image,
      online: onlineUser.has(userId)
    }

    socket.emit('message-user', payload)

    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id }
      ]
    })
      .populate('messages')
      .sort({ updatedAt: -1 })

    socket.emit('message', getConversationMessage?.messages || [])
  })

  socket.on('new-message', async (data) => {
    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    })

    if (!conversation) {
      const createConversation = await Conversation({
        sender: data?.sender,
        receiver: data?.receiver
      })

      conversation = await createConversation.save()
    }

    const message = new Message({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      sender: data?.sender
    })

    const saveMessage = await message.save()

    await Conversation.updateOne(
      { _id: conversation?._id },
      { $push: { messages: saveMessage?._id } }
    )

    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    })
      .populate('messages')
      .sort({ updatedAt: -1 })

    io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
    io.to(data?.receiver).emit(
      'message',
      getConversationMessage?.messages || []
    )

    const conversationSender = await getConversation(data?.sender)
    const conversationReceiver = await getConversation(data?.receiver)

    io.to(data?.sender).emit('conversation', conversationSender)
    io.to(data?.receiver).emit('conversation', conversationReceiver)
  })

  socket.on('sidebar', async (userId) => {
    console.log('Current user: ', userId)

    const conversation = await getConversation(userId)

    socket.emit('conversation', conversation)
  })

  socket.on('seen', async (messageByUserId) => {
    const conversation = await Conversation.findOne({
      $or: [
        { sender: messageByUserId, receiver: user?._id },
        { sender: user?._id, receiver: messageByUserId }
      ]
    })

    const conversationMessageId = conversation?.messages || []

    await Message.updateMany(
      { _id: { $in: conversationMessageId }, messageByUserId },
      { $set: { seen: true } }
    )

    const conversationSender = await getConversation(user?._id?.toString())
    const conversationReceiver = await getConversation(messageByUserId)

    io.to(user?._id?.toString()).emit('conversation', conversationSender)
    io.to(messageByUserId).emit('conversation', conversationReceiver)
  })

  socket.on('disconnect', () => {
    console.log('Disconnect user', socket.id)

    onlineUser.delete(user?._id.toString())
  })
})

export { app, server }

