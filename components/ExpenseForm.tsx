import { useState } from 'react'

export default function ExpenseForm() {
  const [formData, setFormData] = useState({
    date: '',
    place: '',
    type: '',
    amount: '',
    spender: '',
    note: '',
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
          date: '',
          place: '',
          type: '',
          amount: '',
          spender: '',
          note: '',
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
        <label htmlFor="date" className="block mb-1">Tarih</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="place" className="block mb-1">Harcama Yeri</label>
        <input
          type="text"
          id="place"
          name="place"
          value={formData.place}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="type" className="block mb-1">Harcama Türü</label>
        <select
          id="type"
          name="type"
          value={formData.type}
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
        <label htmlFor="amount" className="block mb-1">Tutar</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="spender" className="block mb-1">Harcamayı Yapan</label>
        <input
          type="text"
          id="spender"
          name="spender"
          value={formData.spender}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="note" className="block mb-1">Not</label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
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

