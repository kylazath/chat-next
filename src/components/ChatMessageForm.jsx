import { useState } from 'react'

export default function ChatMessageForm({ room, setMessages, messagesEndRef }) {
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault();
    setSending(true);

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
    }
    setSending(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <div
        className="border-y-2 border-gray-200 px-4 py-4 mb-2 sm:mb-0"
      >
        <div className="relative flex">
          <input
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            name="content"
            id="content"
            type="text"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <div
            className="absolute right-0 items-center inset-y-0 hidden sm:flex"
          >
            <button
              disabled={!(content.length > 0) && sending}
              type="submit"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
