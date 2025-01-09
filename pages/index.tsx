import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('User is not authenticated')
    }
  }, [status])

  if (status === "loading") {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Gider Kayıt Sistemi</h1>
        <p className="mb-4">Küçük işletmeniz için gider takip çözümü</p>
        {session ? (
          <Link href="/dashboard">
            <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Dashboard'a Git
            </a>
          </Link>
        ) : (
          <Link href="/login">
            <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Giriş Yap
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

