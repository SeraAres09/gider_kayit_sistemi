import { readFromExpensesSheet } from '../../utils/googleSheets'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const expenses = await readFromExpensesSheet()
      
      // İlk satır başlıkları içerdiği için onu ayırıyoruz
      const [headers, ...data] = expenses

      // Filtreleme
      const filteredData = data.filter(row => {
        const [tarih, harcamaYeri, harcamaTuru, , harcamayiYapan] = row
        const { baslangicTarihi, bitisTarihi, harcamaYeri: filterHarcamaYeri, harcamaTuru: filterHarcamaTuru, harcamayiYapan: filterHarcamayiYapan } = req.query

        if (baslangicTarihi && new Date(tarih) < new Date(baslangicTarihi as string)) return false
        if (bitisTarihi && new Date(tarih) > new Date(bitisTarihi as string)) return false
        if (filterHarcamaYeri && harcamaYeri !== filterHarcamaYeri) return false
        if (filterHarcamaTuru && harcamaTuru !== filterHarcamaTuru) return false
        if (filterHarcamayiYapan && harcamayiYapan !== filterHarcamayiYapan) return false

        return true
      })

      res.status(200).json([headers, ...filteredData])
    } catch (error) {
      console.error('Giderler alınırken hata oluştu:', error)
      res.status(500).json({ message: 'Giderler alınırken hata oluştu', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

