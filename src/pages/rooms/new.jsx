import authOptions from '@/lib/auth-options'
import { getServerSession } from "next-auth/next"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import redirectToRoot from '@/lib/redirect-to-root';

export default function Rooms() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const data = {
      name: event.currentTarget.name.value,
      description: event.currentTarget.description.value
    };

    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/rooms')
    } else {
      setLoading(false)
    }
  }

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 flex sm:flex-nowrap flex-wrap mx-auto">
        <div className="mx-auto lg:w-1/3 md:w-1/3 bg-white flex flex-col md:mx-auto w-full md:py-8 mt-8 md:mt-0">
          <form onSubmit={onSubmit}>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 text-center">New room</h1>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
              <input required type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
            </div>
            <div className="relative mb-4">
              <label htmlFor="description" className="leading-7 text-sm text-gray-600">Description</label>
              <textarea id="description" name="description" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" disabled={loading}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) return redirectToRoot;

  return {
    props: {
      session: session
    }
  }
}
