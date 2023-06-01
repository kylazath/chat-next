import authOptions from '@/lib/auth-options'
import { getServerSession } from "next-auth/next"
import { useEffect } from 'react';
import prisma from '~/prisma/client'
import { useSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import SearchPostsDropdown from '@/components/SearchPostsDropdown';
import ChatMessages from '@/components/ChatMessages';
import ChatMessageForm from '@/components/ChatMessageForm';
import ActiveRoomUsers from '@/components/ActiveRoomUsers';
import connectToPusher from '@/lib/pusher-connect';
import redirectToRoot from '@/lib/redirect-to-root';
import formatMessagesTime from '@/lib/format-messages-time'

export default function Room({ room, firstMessageId }) {
  const messagesTopRef = useRef(null)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([...room.messages])
  const [activeUsers, setActiveUsers] = useState({})
  const [search, setSearch] = useState('')
  const { data: session } = useSession()
  const user = session.user

  useEffect(() => {
    const onMessageCreated = (newMessage) => {
      setMessages((messages) => [...messages, newMessage])
    }
    const onPresenceUpdate = (members) => setActiveUsers(() => ({ ...members }))
    
    const pusher = connectToPusher({ roomId: room.id, currentUser: user, onMessageCreated, onPresenceUpdate })

    return () => {
      pusher.unsubscribe(room.id)
      pusher.unsubscribe(`presence-${room.id}`)
    }
  }, [])

  useEffect(() => {
    const maxScroll = messagesContainerRef.current?.scrollHeight - messagesContainerRef.current?.clientHeight;
    const currentScroll = messagesContainerRef.current?.scrollTop;

    if (!loading && ((maxScroll - 100) < currentScroll)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  const onLoadMore = async () => {
    setLoading(true)
    const url = new URL('/api/messages/before', window.location.origin)
    url.searchParams.append('messageId', messages[0].id)
    url.searchParams.append('roomId', room.id)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const olderMessages = await response.json()
    setMessages((messages) => [...olderMessages, ...messages])
    setLoading(false)
  }

  return (
    <div className="container px-5 mx-auto">
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-[75vh]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="py-3 sm:py-0 relative flex items-center space-x-4">
            <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  <span className="text-gray-700 mr-3">{room.name}</span>
                </div>
            </div>
          </div>
          <SearchPostsDropdown
            search={search}
            setSearch={setSearch}
            currentUser={user}
            room={room}
            setMessages={setMessages}
            messagesTopRef={messagesTopRef}
          />
        </div>
        <ChatMessages
          firstMessageId={firstMessageId}
          messages={messages}
          loading={loading}
          onLoadMore={onLoadMore}
          currentUser={user}
          messagesTopRef={messagesTopRef}
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
        />
        <ChatMessageForm
          room={room}
          setMessages={setMessages}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ActiveRoomUsers
        activeUsers={activeUsers}
      />
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) return redirectToRoot;

  const room = await prisma.room.findUnique({
    where: {
      id: context.params.id
    },
    include: {
      messages: {
        take: 12,
        include: {
          user: true
        },
        orderBy: {
          id: 'desc'
        }
      }
    }
  })

  if (!room) {
    return {
      redirect: {
        destination: '/rooms',
        permanent: false
      }
    }
  }

  const safeRoom = JSON.parse(JSON.stringify(room))
  safeRoom.messages = formatMessagesTime(safeRoom.messages.reverse())

  const firstMessage = await prisma.roomMessage.findFirst({
    where: {
      roomId: room.id
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return {
    props: {
      session,
      room: safeRoom,
      firstMessageId: firstMessage?.id || null
    }
  }
}
