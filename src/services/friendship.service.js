import { prisma } from "../../lib/prisma.js"

export const sentFriendship = async ({ senderId, receiverId }) => {
  console.log(senderId, receiverId)
  return await prisma.friendships.create({
    data: {
      sender: {
        connect: {
          id: senderId
        }
      },
      receiver: {
        connect: {
          id: receiverId
        }
      }
    }
  })
}
