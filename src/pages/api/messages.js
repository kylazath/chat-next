import pusher from '@/lib/pusher'
import { getServerSession } from "next-auth/next"
import authOptions from '@/lib/auth-options'
import prisma from '~/prisma/client'

export default async function handler (req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({});
  }

  const { content, roomId } = req.body;

  const errors = {}
  if (!((content ?? "").length > 0)) {
    errors.content = 'Content is required'
  }
  if (!roomId) errors.roomId = 'Room ID is required'
  if (Object.keys(errors).length > 0) return res.status(422).json({ errors: errors })

  const message = await prisma.roomMessage.create({
    data: {
      content,
      roomId,
      userId: session.user.id
    }
  })
  if (!message) {
    return res.status(422).json({})
  }

  const safeMessage = JSON.parse(JSON.stringify(
    {
      user: session.user,
      createdAt: message.createdAt,
      id: message.id,
      content,
    }
  ))
  pusher.trigger(roomId, 'message-created', { message: safeMessage });

  res.status(200).send({ message: safeMessage });
}
