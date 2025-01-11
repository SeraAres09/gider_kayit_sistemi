import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Gider Kayıt Sistemi</h1>
        <p className="mb-4">Küçük işletmeniz için gider takip çözümü</p>
        <Link href="/dashboard">
          <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Gider Yönetimine Git
          </a>
        </Link>
      </div>
    </div>
  )
}

