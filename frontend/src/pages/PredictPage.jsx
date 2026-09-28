import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  state: 'Maharashtra',
  district: 'Nashik',
  crop: 'Rice',
  season: 'Kharif',
  area: 2.5,
  rainfall: 1200,
  temperature: 28,
};

export default function PredictPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState({ states: [], districts: [] });
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cropsRes, locationsRes] = await Promise.all([
          api.get('/api/crops'),
          api.get('/api/locations'),
        ]);
        setCrops(cropsRes.data.crops);
        setLocations(locationsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.post('/api/predict-yield', form);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Yield prediction</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Predict crop yield before planting</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="card p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
                <select className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  {locations.states.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">District</label>
                <select className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                  {locations.districts.map((district) => <option key={district} value={district}>{district}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Crop</label>
                <select className="input" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
                  {crops.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
                </select>
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
                <input className="input" type="number" step="0.1" value={form.area} onChange={(e) => setForm({ ...form, area: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Rainfall (mm)</label>
                <input className="input" type="number" step="1" value={form.rainfall} onChange={(e) => setForm({ ...form, rainfall: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Average temperature (°C)</label>
                <input className="input" type="number" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })} />
              </div>
            </div>

            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <button type="submit" className="btn-primary mt-6" disabled={loading}>{loading ? 'Predicting...' : 'Predict Yield'}</button>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-900">Prediction summary</h3>
            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-sm text-brand-700">Predicted yield</p>
                  <p className="mt-2 text-4xl font-black text-brand-800">{result.predicted_yield} <span className="text-lg">t/ha</span></p>
                </div>
                <div className="text-sm text-slate-600">
                  <div className="flex justify-between py-2"><span>Crop</span><strong>{result.crop}</strong></div>
                  <div className="flex justify-between py-2"><span>District</span><strong>{result.district}</strong></div>
                  <div className="flex justify-between py-2"><span>Season</span><strong>{result.season}</strong></div>
                  <div className="flex justify-between py-2"><span>Area</span><strong>{form.area} ha</strong></div>
                  <div className="flex justify-between py-2"><span>Estimated total</span><strong>{result.estimated_total_production} tonnes</strong></div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-slate-100 p-6 text-sm text-slate-500">
                Submit field data to see the forecast result and estimated production.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
