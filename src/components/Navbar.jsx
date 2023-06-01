import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const session = useSession()
  if (!session || session.status === "unauthenticated") return;

  const { data: { user: { name, email, image } } } = session
  return (
    <div className="container px-5 mx-auto">
      <div className="flex justify-between pt-12">
        <div className="relative flex items-center space-x-4">
          <div className="relative hidden md:block">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor" />
              </svg>
            </span>
            {
              image && (
                <Image
                  src={image}
                  alt=""
                  className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                  width={100}
                  height={100}
                />
              )
            }
          </div>
          <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">{name ?? ""}</span>
              </div>
              <span className="text-lg text-gray-600">{email ?? ""}</span>
          </div>
        </div>
        <nav
          className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center"
        >
          <Link
            href='/rooms'
            className="mr-5 hover:text-gray-900"
          >
            Rooms
          </Link>
          <Link
            href='/rooms/new'
            className="mr-5 hover:text-gray-900"
          >
            Add new room
          </Link>
        </nav>
        <button
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
