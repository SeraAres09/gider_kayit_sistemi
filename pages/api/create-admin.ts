import type { NextApiRequest, NextApiResponse } from 'next'
import { createAdminUser } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await createAdminUser()
      res.status(200).json({ message: 'Admin user created or already exists' })
    } catch (error) {
      console.error('Error creating admin user:', error)
      res.status(500).json({ message: 'Error creating admin user' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

