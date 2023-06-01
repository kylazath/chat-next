import Image from 'next/image'

export default function ActiveRoomUsers({ activeUsers }) {
  return (
    <div className="py-4">
      <p>
        Users active in the chat room ({Object.keys(activeUsers).length}):
      </p>
      <ul className="flex flex-wrap">
        {
          Object.entries(activeUsers).map(([id, user]) => (
            <li
              key={id}
              className="flex py-1 px-3"
            >
              <Image
                src={user.image}
                alt="Profile avatar"
                className="w-6 h-6 rounded-full"
                width='100'
                height='100'/>
              <span className="px-1">{user.name}</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
