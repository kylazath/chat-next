import Message from './Message'

export default function ChatMessages({ firstMessageId, messages, setMessages, loading, setLoading, currentUser, messagesEndRef, messagesTopRef, messagesContainerRef, room }) {
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
    <div
      id="messages"
      className="flex flex-[2_2_0%] flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      ref={messagesContainerRef}
    >
      <div className="scroll-mt-[5rem]" ref={messagesTopRef}></div>
      {
        firstMessageId && !(messages[0].id === firstMessageId) && (
          <div className="flex justify-center py-2">
            <button
              disabled={loading}
              onClick={onLoadMore}
              type="button"
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            >
              <span>Load more</span>
            </button>
          </div>
        )
      }
      {
        messages.map((message) => (
          <Message
            key={message.id}
            currentUser={currentUser}
            message={message}
          />
        ))
      }
      <div className="scroll-mt-[5rem]" ref={messagesEndRef}></div>
    </div>
  )
}
