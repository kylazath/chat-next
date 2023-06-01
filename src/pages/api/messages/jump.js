import authOptions from '@/app/lib/auth-options'
import { getServerSession } from "next-auth/next"
import prisma from './../../../../prisma/client'
import { signOut } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({})

  const messages = await prisma.roomMessage.findMany({
    where: {
      id: {
        gte: parseInt(req.query.messageId)
      },
      roomId: req.query.roomId
    },
    include: {
      user: true
    },
    orderBy: {
      id: 'asc'
    }
  })
  if (!messages) return res.status(404).json({})

  const formattedMessages = messages.map((message) => {
    const date = new Date(message.createdAt)
    message.createdAt = `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
    return message
  })

  res.status(200).send(formattedMessages);
}
