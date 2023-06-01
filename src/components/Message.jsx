import Image from 'next/image'

export default function Message({ currentUser, message, searchPreview=false, onJump }) {
  return (
    <div className={`chat-message ${searchPreview ? 'py-2' : ''}`}>
      <div className="flex items-end">
        <Image src={message.user.image} alt="Profile avatar" className="w-6 h-6 rounded-full" width='100' height='100'/>
        <div className="flex flex-col flex-grow">
          <div className="pb-1">
            {
              searchPreview
                ? (
                  <>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <p>{message.user.name}</p>
                        <p className="text-sm">({message.createdAt})</p>
                      </div>
                      <button type="button" onClick={() => onJump(message.id)}>Jump</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{message.user.name}</span>
                    {" "}
                    <span className="text-sm">({message.createdAt})</span>
                  </>
                )
            }
          </div>
          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2">
            <div>
              <span className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${currentUser.id === message.user.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600' }`}>
                {message.content}
              </span>
            </div>
          </div>
        </div>          
      </div>
    </div>
  )
}
