import Spinner from './Spinner'
import Message from './Message'
import SearchPostsForm from './SearchPostsForm'
import { useState } from 'react'

export default function SearchPostsDropdown({ search, setSearch, currentUser, room, setMessages, messagesTopRef }) {
  const [searchedMessages, setSearchedMessages] = useState([])
  const [searching, setSearching] = useState(false)
  
  const onSubmit = async (event) => {
    event.preventDefault()
    setSearchedMessages(() => [])
    setSearching(true)
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
    setSearching(false)
    setSearchedMessages(() => [...foundMessages])
  }

  const onBlur = async (event) => {
    if (!event.relatedTarget) {
      setSearchedMessages(() => [])
    }
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
    setMessages(() => {
      messagesTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return [...foundMessages]
    })
  }

  return (
    <form onSubmit={onSubmit} onBlur={onBlur} className="flex items-center relative w-5/5 sm:w-8/12 md:w-6/12 lg:w-4/12">
      <SearchPostsForm
        search={search}
        setSearch={setSearch}
      />
      {
        (searching || (searchedMessages.length > 0)) && (
          <div style={{ width: 'calc(100% - 1px)' }} className="border border-black rounded p-2 absolute top-0 translate-y-[2.1rem] border-black z-[1] bg-white">
            {
              searching && <Spinner />
            }
            {
              searchedMessages.map((message) => (
                <Message key={message.id} currentUser={currentUser} message={message} searchPreview={true} onJump={onJump} />
              ))
            }
          </div>
        )
      }
    </form>
  )
}
