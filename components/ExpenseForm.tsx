import { useState } from 'react'

export default function ExpenseForm() {
  const [formData, setFormData] = useState({
    tarih: '',
    harcamaYeri: '',
    harcamaTuru: '',
    tutar: '',
    harcamayiYapan: '',
    not: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/addExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert('Gider başarıyla eklendi!')
        setFormData({
          tarih: '',
          harcamaYeri: '',
          harcamaTuru: '',
          tutar: '',
          harcamayiYapan: '',
          not: '',
        })
      } else {
        throw new Error('Gider eklenirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Gider eklenirken bir hata oluştu')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Gider Ekle
      </button>
    </form>
  )
}

