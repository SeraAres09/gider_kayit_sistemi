import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { appendToUsersSheet } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || !(session.user as any).isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' })
    }

    try {
      await appendToUsersSheet({ name, email, password, isAdmin: false })
      res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.' })
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error)
      res.status(500).json({ message: 'Kullanıcı oluşturulurken bir hata oluştu.' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

