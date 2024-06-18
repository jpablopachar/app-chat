import Conversation from '../models/conversation.js'

/**
 * Retrieves user conversations, including unseen message counts and last
 * messages, based on the provided user ID.
 * @param userId - Retrieves conversations for a specific user based on
 * the provided `userId`.
 * @returns Returns an array of conversation objects.
 */
export const getConversation = async (userId) => {
  if (!userId) return []

  const userConversations = await Conversation.find({
    $or: [{ sender: userId }, { receiver: userId }]
  })
    .sort({ updatedAt: -1 })
    .populate('messages')
    .populate('sender')
    .populate('receiver')

  const conversation = userConversations.map((currentConversation) => {
    const countUnSeenMessages = currentConversation?.messages?.reduce(
      (prev, current) => {
        const messageByUserId = current?.messageByUserId?.toString()

        if (messageByUserId !== userId) {
          return prev + (current?.seen ? 0 : 1)
        } else {
          return prev
        }
      },
      0
    )

    return {
      _id: currentConversation?._id,
      sender: currentConversation?.sender,
      receiver: currentConversation?.receiver,
      unSeenMessages: countUnSeenMessages,
      lastMessage:
        currentConversation?.messages[
          currentConversation?.messages?.length - 1
        ]
    }
  })

  return conversation
}
