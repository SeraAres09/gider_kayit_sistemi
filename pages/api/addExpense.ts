import type { NextApiRequest, NextApiResponse } from 'next'
import { appendToExpensesSheet } from '../../utils/googleSheets'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }

  try {
    const { tarih, harcamaYeri, harcamaTuru, tutar, harcamayiYapan, not } = req.body

    // Validate required fields
    if (!tarih || !harcamaYeri || !harcamaTuru || !tutar || !harcamayiYapan) {
      return res.status(400).json({ message: 'Tüm zorunlu alanları doldurun' })
    }

    const values = [[tarih, harcamaYeri, harcamaTuru, tutar, harcamayiYapan, not || '']]
    const result = await appendToExpensesSheet(values)
    
    return res.status(200).json({ 
      success: true,
      message: 'Gider başarıyla eklendi', 
      result 
    })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Gider eklenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

