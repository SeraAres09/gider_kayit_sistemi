import type { NextApiRequest, NextApiResponse } from 'next'
import { appendToSheet } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { date, place, type, amount, spender, note } = req.body
      const values = [[date, place, type, amount, spender, note]]
      const result = await appendToSheet(values)
      res.status(200).json({ message: 'Expense added successfully', result })
    } catch (error) {
      res.status(500).json({ message: 'Error adding expense', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

