import { readFromExpensesSheet } from '../../utils/googleSheets'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }

  try {
    const expenses = await readFromExpensesSheet()
    
    if (!Array.isArray(expenses)) {
      throw new Error('Invalid data format received from Google Sheets')
    }

    // İlk satır başlıkları içerdiği için onu ayırıyoruz
    const [headers, ...data] = expenses

    // Filtreleme
    const filteredData = data.filter(row => {
      if (!Array.isArray(row) || row.length < 5) return false;

      const [tarih, harcamaYeri, harcamaTuru, , harcamayiYapan] = row
      const { baslangicTarihi, bitisTarihi, harcamaYeri: filterHarcamaYeri, harcamaTuru: filterHarcamaTuru, harcamayiYapan: filterHarcamayiYapan } = req.query

      if (baslangicTarihi && new Date(tarih) < new Date(baslangicTarihi as string)) return false
      if (bitisTarihi && new Date(tarih) > new Date(bitisTarihi as string)) return false
      if (filterHarcamaYeri && harcamaYeri !== filterHarcamaYeri) return false
      if (filterHarcamaTuru && harcamaTuru !== filterHarcamaTuru) return false
      if (filterHarcamayiYapan && harcamayiYapan !== filterHarcamayiYapan) return false

      return true
    })

    return res.status(200).json({
      success: true,
      data: [headers, ...filteredData]
    })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Giderler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

