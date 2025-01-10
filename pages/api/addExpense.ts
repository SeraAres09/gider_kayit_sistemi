import type { NextApiRequest, NextApiResponse } from 'next'
import { appendToExpensesSheet } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { tarih, harcamaYeri, harcamaTuru, tutar, harcamayiYapan, not } = req.body
      const values = [[tarih, harcamaYeri, harcamaTuru, tutar, harcamayiYapan, not]]
      const result = await appendToExpensesSheet(values)
      res.status(200).json({ message: 'Gider başarıyla eklendi', result })
    } catch (error) {
      res.status(500).json({ message: 'Gider eklenirken hata oluştu', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

