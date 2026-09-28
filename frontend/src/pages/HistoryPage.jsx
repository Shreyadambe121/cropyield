import { useEffect, useState } from 'react';
import api from '../services/api';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const loadHistory = async () => {
    try {
      const response = await api.get('/api/predictions');
      const data = response.data.predictions || [];
      const filtered = data.filter((item) => `${item.crop} ${item.district}`.toLowerCase().includes(search.toLowerCase()));
      const sorted = [...filtered].sort((a, b) => {
        if (sort === 'highest') return b.predicted_yield - a.predicted_yield;
        if (sort === 'lowest') return a.predicted_yield - b.predicted_yield;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setItems(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [search, sort]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/predictions/${id}`);
      loadHistory();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Prediction history</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Your agricultural records</h1>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input className="input max-w-md" placeholder="Search crop or district" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input max-w-xs" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="highest">Highest yield</option>
            <option value="lowest">Lowest yield</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Crop</th>
              <th className="p-4">Location</th>
              <th className="p-4">Season</th>
              <th className="p-4">Predicted Yield</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-semibold">{item.crop}</td>
                <td className="p-4">{item.district}, {item.state}</td>
                <td className="p-4">{item.season}</td>
                <td className="p-4">{item.predicted_yield} t/ha</td>
                <td className="p-4"><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <div className="p-6 text-slate-500">No matching predictions found.</div>}
      </div>
    </div>
  );
}
