import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import authOptions from '@/app/lib/auth-options'

export default function Home() {
  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">You need to sign in</h1>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
              <div className="p-2 pt-2 w-full">
                <button
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={() => signIn()}
                >
                  Sign in with GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/rooms',
        permanent: false
      }
    }
  }

  return {
    props: {
      session: session
    }
  }
}
