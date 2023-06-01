import Image from 'next/image'
import portrait from '@/assets/portrait.png'
import { useRouter } from 'next/navigation';

export default function RoomPreview({ room }) {
  const router = useRouter();
  return (
    <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
      <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
        <Image
          alt="team"
          className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
          src={portrait}
        />
        <div className="flex-grow">
          <h2 className="text-gray-900 title-font font-medium">
            {room.name
          }</h2>
          <p className="text-gray-500">{room.description}</p>
        </div>
        <button
          onClick={() => router.push(`/rooms/${room.id}`)}
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          Join
        </button>
      </div>
    </div>
  )
}
