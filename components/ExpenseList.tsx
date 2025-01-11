import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface Expense {
  tarih: string;
  harcamaYeri: string;
  harcamaTuru: string;
  tutar: string;
  harcamayiYapan: string;
  not: string;
}

interface FilterOptions {
  baslangicTarihi: string;
  bitisTarihi: string;
  harcamaYeri: string;
  harcamaTuru: string;
  harcamayiYapan: string;
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    baslangicTarihi: '',
    bitisTarihi: '',
    harcamaYeri: '',
    harcamaTuru: '',
    harcamayiYapan: '',
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

  const uniqueHarcamaYerleri = Array.from(new Set(expenses.map(expense => expense.harcamaYeri)))
  const uniqueHarcamaTurleri = Array.from(new Set(expenses.map(expense => expense.harcamaTuru)))
  const uniqueHarcamayiYapanlar = Array.from(new Set(expenses.map(expense => expense.harcamayiYapan)))

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="baslangicTarihi" className="block mb-1">Başlangıç Tarihi</label>
          <input
            type="date"
            id="baslangicTarihi"
            name="baslangicTarihi"
            value={filterOptions.baslangicTarihi}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="bitisTarihi" className="block mb-1">Bitiş Tarihi</label>
          <input
            type="date"
            id="bitisTarihi"
            name="bitisTarihi"
            value={filterOptions.bitisTarihi}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="harcamaYeri" className="block mb-1">Harcama Yeri</label>
          <select
            id="harcamaYeri"
            name="harcamaYeri"
            value={filterOptions.harcamaYeri}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Tümü</option>
            {uniqueHarcamaYerleri.map(yer => (
              <option key={yer} value={yer}>{yer}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="harcamaTuru" className="block mb-1">Harcama Türü</label>
          <select
            id="harcamaTuru"
            name="harcamaTuru"
            value={filterOptions.harcamaTuru}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Tümü</option>
            {uniqueHarcamaTurleri.map(tur => (
              <option key={tur} value={tur}>{tur}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="harcamayiYapan" className="block mb-1">Harcamayı Yapan</label>
          <select
            id="harcamayiYapan"
            name="harcamayiYapan"
            value={filterOptions.harcamayiYapan}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Tümü</option>
            {uniqueHarcamayiYapanlar.map(yapan => (
              <option key={yapan} value={yapan}>{yapan}</option>
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
                <td className="px-4 py-2 border">{format(new Date(expense.tarih), 'dd.MM.yyyy')}</td>
                <td className="px-4 py-2 border">{expense.harcamaYeri}</td>
                <td className="px-4 py-2 border">{expense.harcamaTuru}</td>
                <td className="px-4 py-2 border">{expense.tutar}</td>
                <td className="px-4 py-2 border">{expense.harcamayiYapan}</td>
                <td className="px-4 py-2 border">{expense.not}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

