import authOptions from '@/lib/auth-options'
import { getServerSession } from "next-auth/next"
import prisma from '~/prisma/client'
import RoomPreview from '@/components/RoomPreview'
import redirectToRoot from '@/lib/redirect-to-root'
import { useEffect, useState } from 'react'

export default function Rooms({ initialRooms, lastRoomSequence }) {
  const [rooms, setRooms] = useState([...initialRooms])

  const onClick = async () => {
    const url = new URL('/api/rooms/after', window.location.origin)
    url.searchParams.append('lastRoomSequence', rooms[rooms.length - 1].sequence)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const moreRooms = await response.json()
    setRooms((currentRooms) => [...currentRooms, ...moreRooms])
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 pb-24 pt-12 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Rooms</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Click on one of them to join the conversation</p>
        </div>
        <div className="flex flex-wrap -m-2">
          {
            rooms.map((room) => (
              <RoomPreview key={room.id} room={room} />
            ))
          }
        </div>
        {
          lastRoomSequence !== rooms[rooms.length - 1].sequence && (
            <div onClick={onClick} className="p-2 pt-8 w-full">
              <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Show more</button>
            </div>
          )
        }
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) return redirectToRoot;

  const rooms = await prisma.room.findMany({
    take: 3,
    skip: 0,
    orderBy: {
      sequence: 'asc'
    }
  })
  const lastRoom = await prisma.room.findFirst({
    orderBy: {
      sequence: 'desc'
    }
  })
  const safeDatesRooms = JSON.parse(JSON.stringify(rooms))

  return {
    props: {
      session: session,
      initialRooms: safeDatesRooms,
      lastRoomSequence: lastRoom.sequence
    }
  }
}
