import authOptions from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import prisma from "~/prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({});

  const lastRoomSequence = parseInt(req.query.lastRoomSequence);
  const roomsAfter = await prisma.room.findMany({
    take: 6,
    skip: 1,
    cursor: {
      sequence: lastRoomSequence,
    },
    orderBy: {
      sequence: "asc"
    }
  })

  res.status(200).json(roomsAfter);
}
