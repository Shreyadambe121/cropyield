import { useState } from 'react';
import cropYieldCsv from '../../../data/crop_yield.csv?raw';

const [headerLine, ...dataLines] = cropYieldCsv.trim().split(/\r?\n/);
const headers = headerLine.split(',');
const sampleRows = dataLines.map((line) => {
  const values = line.split(',');
  return Object.fromEntries(headers.map((header, index) => [
    header,
    ['Area', 'Rainfall', 'Temperature', 'Yield'].includes(header)
      ? Number(values[index])
      : values[index],
  ]));
});

const states = [...new Set(sampleRows.map((row) => row.State))].sort();
const districtsByState = Object.fromEntries(states.map((state) => [
  state,
  [...new Set(sampleRows.filter((row) => row.State === state).map((row) => row.District))].sort(),
]));
const crops = [...new Set(sampleRows.map((row) => row.Crop))].sort();
const seasons = [...new Set([...sampleRows.map((row) => row.Season), 'Autumn', 'Rainy', 'Summer'])].sort();

function normalizeSeason(season) {
  return season.toLowerCase() === 'rainy' ? 'kharif' : season.toLowerCase();
}

function estimateYield(form) {
  const cropRows = sampleRows.filter((row) => row.Crop.toLowerCase() === form.crop.trim().toLowerCase());
  if (!cropRows.length) return null;

  const nearbyRows = cropRows
    .map((row) => {
      const distance = (row.State === form.state.trim() ? 0 : 8)
        + (row.District === form.district.trim() ? 0 : 4)
        + (normalizeSeason(row.Season) === normalizeSeason(form.season.trim()) ? 0 : 5)
        + Math.abs(row.Area - Number(form.area)) / 10
        + Math.abs(row.Rainfall - Number(form.rainfall)) / 1000
        + Math.abs(row.Temperature - Number(form.temperature)) / 10;
      return { row, distance };
    })
    .sort((first, second) => first.distance - second.distance)
    .slice(0, 3);

  const weights = nearbyRows.map(({ distance }) => 1 / (distance + 0.1) ** 2);
  const weightedYield = nearbyRows.reduce((total, item, index) => total + item.row.Yield * weights[index], 0)
    / weights.reduce((total, weight) => total + weight, 0);
  return Math.round(weightedYield * 100) / 100;
}

const initialForm = {
  state: 'Maharashtra',
  district: 'Nashik',
  crop: 'Rice',
  season: 'Kharif',
  area: '2.5',
  rainfall: '1200',
  temperature: '28',
};

export default function PredictPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const area = Number(form.area);
    const rainfall = Number(form.rainfall);
    const temperature = Number(form.temperature);
    if (!form.area.trim() || !form.rainfall.trim() || !form.temperature.trim()
      || !Number.isFinite(area) || !Number.isFinite(rainfall) || !Number.isFinite(temperature)
      || area <= 0 || rainfall < 0) {
      setError('Enter a positive area and valid rainfall and temperature values.');
      return;
    }
    const predictedYield = estimateYield(form);
    if (predictedYield === null) {
      setError('Choose a crop from the sample data.');
      return;
    }
    setResult({
      ...form,
      predicted_yield: predictedYield,
      estimated_total_production: Math.round(predictedYield * area * 100) / 100,
    });
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
                <select className="input" value={form.state} onChange={(e) => {
                  const state = e.target.value;
                  setForm({ ...form, state, district: districtsByState[state][0] });
                }}>
                  {states.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">District</label>
                <select className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                  {districtsByState[form.state].map((district) => <option key={district} value={district}>{district}</option>)}
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
                  {seasons.map((season) => <option key={season} value={season}>{season}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Area (hectares)</label>
                <input className="input" type="number" min="0.1" step="0.1" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Rainfall (mm)</label>
                <input className="input" type="number" min="0" step="1" required value={form.rainfall} onChange={(e) => setForm({ ...form, rainfall: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Average temperature (°C)</label>
                <input className="input" type="number" step="0.1" required value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} />
              </div>
            </div>

            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <button type="submit" className="btn-primary mt-6">Predict Yield</button>
          </form>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-900">Prediction summary</h3>
            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-sm text-brand-700">Predicted yield</p>
                  <p className="mt-2 text-4xl font-black text-brand-800">{result.predicted_yield} <span className="text-lg">t/ha</span></p>
                  <p className="mt-1 text-sm text-brand-700">Estimated from the included sample data</p>
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
