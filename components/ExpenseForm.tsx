import { useState } from 'react'

interface FormData {
  tarih: string
  harcamaYeri: string
  harcamaTuru: string
  tutar: string
  harcamayiYapan: string
  not: string
}

const initialFormData: FormData = {
  tarih: '',
  harcamaYeri: '',
  harcamaTuru: '',
  tutar: '',
  harcamayiYapan: '',
  not: '',
}

export default function ExpenseForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear messages when user starts typing
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/addExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gider eklenirken bir hata oluştu')
      }

      setSuccess('Gider başarıyla eklendi!')
      setFormData(initialFormData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gider eklenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}
      <div>
        <label htmlFor="tarih" className="block mb-1">Tarih</label>
        <input
          type="date"
          id="tarih"
          name="tarih"
          value={formData.tarih}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="harcamaYeri" className="block mb-1">Harcama Yeri</label>
        <input
          type="text"
          id="harcamaYeri"
          name="harcamaYeri"
          value={formData.harcamaYeri}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="harcamaTuru" className="block mb-1">Harcama Türü</label>
        <select
          id="harcamaTuru"
          name="harcamaTuru"
          value={formData.harcamaTuru}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Seçiniz</option>
          <option value="Yemek">Yemek</option>
          <option value="Ulaşım">Ulaşım</option>
          <option value="Kırtasiye">Kırtasiye</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>
      <div>
        <label htmlFor="tutar" className="block mb-1">Tutar</label>
        <input
          type="number"
          id="tutar"
          name="tutar"
          value={formData.tutar}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="harcamayiYapan" className="block mb-1">Harcamayı Yapan</label>
        <input
          type="text"
          id="harcamayiYapan"
          name="harcamayiYapan"
          value={formData.harcamayiYapan}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="not" className="block mb-1">Not</label>
        <textarea
          id="not"
          name="not"
          value={formData.not}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows={3}
        ></textarea>
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Gider Ekleniyor...' : 'Gider Ekle'}
      </button>
    </form>
  )
}

