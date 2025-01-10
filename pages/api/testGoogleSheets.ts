import type { NextApiRequest, NextApiResponse } from 'next'
import { readFromExpensesSheet } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await readFromExpensesSheet()
      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error testing Google Sheets connection:', error)
      res.status(500).json({ success: false, error: 'Failed to connect to Google Sheets' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

