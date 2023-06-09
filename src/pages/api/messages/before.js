import authOptions from '@/lib/auth-options'
import { getServerSession } from "next-auth/next"
import prisma from '~/prisma/client'
import formatMessagesTime from '@/lib/format-messages-time'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session){
    return res.status(401).json({})
  }

  const message = await prisma.roomMessage.findUnique({
    where: {
      id: parseInt(req.query.messageId)
    }
  })
  if (!message) return res.status(404).json({})

  const olderMessages = await prisma.roomMessage.findMany({
    take: -3,
    skip: 1,
    cursor: {
      id: message.id
    },
    include: {
      user: true,
    },
    where: {
      roomId: req.query.roomId
    },
    orderBy: {
      id: 'asc'
    }
  })

  res.status(200).send(
    formatMessagesTime(olderMessages)
  );
}
