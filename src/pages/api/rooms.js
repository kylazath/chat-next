import prisma from "./../../../prisma/client";
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/auth-options';
import { signOut } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({});
  }

  const { name, description } = req.body;
  if (!((name ?? "").length > 0)) {
    return res.status(422).json({ errors: {
      name: 'Name is required'
    }})
  }

  const room = await prisma.room.create({
    data: {
      name,
      authorId: session.user.id,
      description: description?.trim() 
    }
  })
  if (room) {
    res.status(200).json({ room: room })
  } else {
    res.status(422).json({})
  }
}
