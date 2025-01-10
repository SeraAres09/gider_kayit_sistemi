import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import Link from 'next/link'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('giderEkle')
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div>Yükleniyor...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const isAdmin = session?.user?.isAdmin

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Merhaba, {session?.user?.name}</span>
            {isAdmin && (
              <Link href="/add-user">
                <a className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
                  Kullanıcı Ekle
                </a>
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('giderEkle')}
            className={`px-4 py-2 rounded ${
              activeTab === 'giderEkle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Gider Ekle
          </button>
          <button
            onClick={() => setActiveTab('giderListele')}
            className={`px-4 py-2 rounded ${
              activeTab === 'giderListele' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Gider Listele
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'giderEkle' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Gider Ekle</h2>
              <ExpenseForm />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Gider Listele</h2>
              <ExpenseList />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

