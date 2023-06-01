import pusher from '@/lib/pusher'
import authOptions from '@/lib/auth-options'
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).json({});

  const socketId = req.body.socket_id;
  const user = {
    id: session.user.id,
    user_info: {
      ...session.user
    }
  }
  const authResponse = pusher.authenticateUser(socketId, user);
  res.status(200).send(authResponse);
}
