import Message from './../../components/Message'
import authOptions from '@/app/lib/auth-options'
import { getServerSession } from "next-auth/next"
import { useEffect } from 'react';
import Pusher from 'pusher-js'
import prisma from './../../../prisma/client'
import { signOut, useSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import Image from 'next/image'

export default function Room({ room, firstMessageId }) {
  const messagesEndRef = useRef(null)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([...room.messages])
  const [searchedMessages, setSearchedMessages] = useState([])
  const [activeUsers, setActiveUsers] = useState({})
  const [search, setSearch] = useState('')
  const { data: session } = useSession()
  const user = session.user

  useEffect(() => {
    // Pusher.logToConsole = true;
    const pusher = new Pusher('529afc2b93130b2c302c', {
      cluster: 'eu',
      userAuthentication: {
        endpoint: '/api/pusher/authentication',
        transport: "ajax",
        params: {},
        headers: {},
        paramsProvider: null,
        headersProvider: null,
        customHandler: null
      },
      channelAuthorization: {
        endpoint: "/api/pusher/authorization",
        transport: "ajax",
        params: {},
        headers: {},
        customHandler: null
      }
    });
    pusher.signin()

    const channel = pusher.subscribe(room.id);
    channel.bind('message-created', function(data) {
      if (data.message.user.id === user.id) return;

      setMessages((messages) => [...messages, data.message])
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    });

    const presenceChannel = pusher.subscribe(`presence-${room.id}`);
    presenceChannel.bind('pusher:subscription_succeeded', (data) => {
      setActiveUsers(active => ({ ...active, ...data.members }))
    });
    presenceChannel.bind("pusher:subscription_count", (data) => {
      setActiveUsers(active => ({ ...active, ...presenceChannel.members.members }))
    });
    presenceChannel.bind("pusher:member_added", (data) => {
      setActiveUsers(active => ({ ...presenceChannel.members.members }))
    });
    presenceChannel.bind("pusher:member_removed", (data) => {
      setActiveUsers(active => ({ ...presenceChannel.members.members }))
    });

    return () => {
      pusher.unsubscribe(room.id)
      pusher.unsubscribe(`presence-${room.id}`)
    }
  }, [])

  const onSubmit = async (event) => {
    setSending(true);
    event.preventDefault();

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content,
        roomId: room.id
      })
    })

    setContent('')
    if (response.ok) {
      const { message } = await response.json()
      setMessages((messages) => [...messages, message])
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    } else {
      console.log('not ok')
    }
    setSending(false)
  }

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

  const onSearchSubmit = async (event) => {
    event.preventDefault()
    const url = new URL('/api/messages/search', window.location.origin)
    url.searchParams.append('content', search)
    url.searchParams.append('roomId', room.id)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const foundMessages = await response.json()
    setSearchedMessages(() => [...foundMessages])
  }

  const onJump = async (messageId) => {
    const url = new URL('/api/messages/jump', window.location.origin)
    url.searchParams.append('roomId', room.id)
    url.searchParams.append('messageId', messageId)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const foundMessages = await response.json()
    setSearchedMessages(() => [])
    setMessages(() => [...foundMessages])
  }

  const onBlur = async (event) => {
    if (!event.relatedTarget) {
      setSearchedMessages(() => [])
    }
  }

  return (
    <div className="container px-5 mx-auto">
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-100 h-[75vh]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="py-3 sm:py-0 relative flex items-center space-x-4">
            <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  <span className="text-gray-700 mr-3">{room.name}</span>
                </div>
            </div>
          </div>
          <form onSubmit={onSearchSubmit} onBlur={onBlur} className="flex items-center relative w-5/5 sm:w-8/12 md:w-6/12 lg:w-4/12">
            <label style={{ zIndex: '2' }} htmlFor="simple-search" className="sr-only">Search</label>
            <div style={{ zIndex: '2' }} className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input required value={search} onChange={(e) => setSearch(e.currentTarget.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" />
            </div>
            <button style={{ zIndex: '2' }} type="submit" className="p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
            {
              searchedMessages.length > 0 && (
                <div style={{ position: 'absolute', top: '0', transform: 'translateY(2.1rem)', width: 'calc(100% - 1px)', borderColor: 'black', zIndex: '1', backgroundColor: 'white' }} className="border border-black rounded p-2">
                  {
                    searchedMessages.map((message) => (
                      <Message key={message.id} currentUser={user} message={message} searchPreview={true} onJump={onJump} />
                    ))
                  }
                </div>
              )
            }
          </form>
        </div>
        <div id="messages" className="flex flex-[2_2_0%] flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          {
            firstMessageId && !(messages[0].id === firstMessageId) && (
              <div className="flex justify-center py-2">
                <button disabled={loading} onClick={onLoadMore} type="button" className="inline-flex items-center justify-center rounded-lg px-3 py-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                  <span>Load more</span>
                </button>
              </div>
            )
          }
          {
            messages.map((message) => (
              <Message key={message.id} currentUser={user} message={message} />
            ))
          }
          <div className="scroll-mt-[5rem]" ref={messagesEndRef}></div>
        </div>
        <form onSubmit={onSubmit}>
          <div className="border-y-2 border-gray-200 px-4 py-4 mb-2 sm:mb-0">
            <div className="relative flex">
              <input value={content} onChange={(e) => setContent(e.currentTarget.value)} name="content" id="content" type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"/>
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button disabled={!(content.length > 0) && sending} type="submit" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                  <span className="font-bold">Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="py-4">
          <p>Users active in the chat room ({Object.keys(activeUsers).length}):</p>
          <ul>
            {
              Object.entries(activeUsers).map(([id, user]) => (
                <li key={id} className="flex py-1">
                  <Image src={user.image} alt="Profile avatar" className="w-6 h-6 rounded-full" width='100' height='100'/>
                  <span className="px-1">{user.name}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const room = await prisma.room.findUnique({
    where: {
      id: context.params.id
    },
    include: {
      messages: {
        take: 5,
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
  safeRoom.messages = safeRoom.messages.reverse().map((message) => {
    const date = new Date(message.createdAt)
    message.createdAt = `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
    return message
  })

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
