import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' })
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: { id: user.id, name: user.name, email: user.email } })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

