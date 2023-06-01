import pusher from '@/lib/pusher'
import authOptions from '@/lib/auth-options'
import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).json({});

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: session.user.id,
    user_info: { ...session.user }
  }
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.status(200).send(authResponse);
}
