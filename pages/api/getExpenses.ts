import type { NextApiRequest, NextApiResponse } from 'next'
import { readFromSheet } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const expenses = await readFromSheet()
      
      // İlk satır başlıkları içerdiği için onu ayırıyoruz
      const [headers, ...data] = expenses

      // Filtreleme
      const filteredData = data.filter(row => {
        const [date, place, type, , spender] = row
        const { startDate, endDate, place: filterPlace, type: filterType, spender: filterSpender } = req.query

        if (startDate && new Date(date) < new Date(startDate as string)) return false
        if (endDate && new Date(date) > new Date(endDate as string)) return false
        if (filterPlace && place !== filterPlace) return false
        if (filterType && type !== filterType) return false
        if (filterSpender && spender !== filterSpender) return false

        return true
      })

      res.status(200).json([headers, ...filteredData])
    } catch (error) {
      console.error('Error fetching expenses:', error)
      res.status(500).json({ message: 'Error fetching expenses', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

