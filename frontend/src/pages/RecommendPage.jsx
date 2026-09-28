import { useState } from 'react';
import api from '../services/api';

const defaultForm = {
  state: 'Maharashtra',
  district: 'Nashik',
  season: 'Kharif',
  area: 2.5,
  rainfall: 1200,
  temperature: 28,
};

export default function RecommendPage() {
  const [form, setForm] = useState(defaultForm);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/recommend-crops', form);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Recommendation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Crop selection</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Find suitable crops for your field</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="card p-6">
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
                <input className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">District</label>
                <input className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Season</label>
                <select className="input" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
                  <option>Kharif</option>
                  <option>Rabi</option>
                  <option>Summer</option>
                  <option>Annual</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Area (hectares)</label>
                <input className="input" type="number" value={form.area} onChange={(e) => setForm({ ...form, area: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Rainfall (mm)</label>
                <input className="input" type="number" value={form.rainfall} onChange={(e) => setForm({ ...form, rainfall: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Temperature (°C)</label>
                <input className="input" type="number" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })} />
              </div>
            </div>
            {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'Recommending...' : 'Recommend Crops'}</button>
          </form>

          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((item) => (
                <div key={item.crop} className="card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{item.crop}</div>
                      <div className="text-sm text-slate-500">Suitability: <span className="font-semibold text-brand-700">{item.suitability}</span></div>
                    </div>
                    <div className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">{item.probability * 100}%</div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-sm text-slate-500">Expected Yield</div>
                      <div className="text-3xl font-black text-brand-800">{item.expected_yield}</div>
                    </div>
                    <div className="text-sm text-slate-500">tonnes/hectare</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 text-slate-500">Recommended crop list will appear here after your input is evaluated.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
