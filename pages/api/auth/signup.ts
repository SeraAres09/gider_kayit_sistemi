import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { readFromUsersSheet, appendToUsersSheet } from '../../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' })
    }

    try {
      const users = await readFromUsersSheet()
      const existingUser = users.find(user => user.email === email)

      if (existingUser) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' })
      }

      const hashedPassword = await hash(password, 10)

      await appendToUsersSheet({ name, email, password: hashedPassword })

      res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: { name, email } })
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error)
      res.status(500).json({ message: 'Kullanıcı oluşturulurken bir hata oluştu.' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

