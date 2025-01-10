import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { appendToUsersSheet, readFromUsersSheet } from '../../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Önce mevcut kullanıcıları kontrol et
      const existingUsers = await readFromUsersSheet()
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'İlk kullanıcı zaten oluşturulmuş.' })
      }

      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Tüm alanlar gereklidir.' })
      }

      const hashedPassword = await hash(password, 10)

      await appendToUsersSheet({ name, email, password: hashedPassword })

      res.status(201).json({ message: 'İlk kullanıcı başarıyla oluşturuldu.' })
    } catch (error) {
      console.error('İlk kullanıcı oluşturma hatası:', error)
      res.status(500).json({ message: 'İlk kullanıcı oluşturulurken bir hata oluştu.' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

