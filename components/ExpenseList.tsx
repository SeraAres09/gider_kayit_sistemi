import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface Expense {
  date: string;
  place: string;
  type: string;
  amount: string;
  spender: string;
  note: string;
}

interface FilterOptions {
  startDate: string;
  endDate: string;
  place: string;
  type: string;
  spender: string;
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    place: '',
    type: '',
    spender: '',
  })

  useEffect(() => {
    fetchExpenses()
  }, [filterOptions])

  const fetchExpenses = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filterOptions).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      const response = await fetch(`/api/getExpenses?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.slice(1)); // İlk satır başlık olduğu için atlıyoruz
        setLoading(false);
      } else {
        throw new Error('Giderler alınırken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value })
  }

  const uniquePlaces = Array.from(new Set(expenses.map(expense => expense.place)))
  const uniqueTypes = Array.from(new Set(expenses.map(expense => expense.type)))
  const uniqueSpenders = Array.from(new Set(expenses.map(expense => expense.spender)))

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="startDate" className="block mb-1">Başlangıç Tarihi</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filterOptions.startDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1">Bitiş Tarihi</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filterOptions.endDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="place" className="block mb-1">Harcama Yeri</label>
          <select
            id="place"
            name="place"
            value={filterOptions.place}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Tümü</option>
            {uniquePlaces.map(place => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block mb-1">Harcama Türü</label>
          <select
            id="type"
            name="type"
            value={filterOptions.type}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Tümü</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="spender" className="block mb-1">Harcamayı Yapan</label>
          <select
            id="spender"
            name="spender"
            value={filterOptions.spender}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Tümü</option>
            {uniqueSpenders.map(spender => (
              <option key={spender} value={spender}>{spender}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tarih</th>
              <th className="px-4 py-2 border">Harcama Yeri</th>
              <th className="px-4 py-2 border">Harcama Türü</th>
              <th className="px-4 py-2 border">Tutar</th>
              <th className="px-4 py-2 border">Harcamayı Yapan</th>
              <th className="px-4 py-2 border">Not</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{format(new Date(expense.date), 'dd.MM.yyyy')}</td>
                <td className="px-4 py-2 border">{expense.place}</td>
                <td className="px-4 py-2 border">{expense.type}</td>
                <td className="px-4 py-2 border">{expense.amount}</td>
                <td className="px-4 py-2 border">{expense.spender}</td>
                <td className="px-4 py-2 border">{expense.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

