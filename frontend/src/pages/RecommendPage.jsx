import { useState } from 'react';
import cropYieldCsv from '../../../data/crop_yield.csv?raw';

const [headerLine, ...dataLines] = cropYieldCsv.trim().split(/\r?\n/);
const headers = headerLine.split(',');
const numericFields = new Set(['Area', 'Rainfall', 'Temperature', 'Yield']);
const sampleRows = dataLines.map((line) => {
  const values = line.split(',');
  return Object.fromEntries(headers.map((header, index) => [
    header,
    numericFields.has(header) ? Number(values[index]) : values[index],
  ]));
});
const states = [...new Set(sampleRows.map((row) => row.State))].sort();
const districtsByState = Object.fromEntries(states.map((state) => [
  state,
  [...new Set(sampleRows.filter((row) => row.State === state).map((row) => row.District))].sort(),
]));
const seasons = [...new Set([...sampleRows.map((row) => row.Season), 'Autumn', 'Rainy', 'Summer'])].sort();
const crops = [...new Set(sampleRows.map((row) => row.Crop))].sort();

function normalizeSeason(season) {
  return season.toLowerCase() === 'rainy' ? 'kharif' : season.toLowerCase();
}

function recommendCrops(form) {
  const ranked = crops.map((crop) => {
    const nearbyRows = sampleRows
      .filter((row) => row.Crop === crop)
      .map((row) => {
        const distance = (row.State === form.state ? 0 : 8)
          + (row.District === form.district ? 0 : 4)
          + (normalizeSeason(row.Season) === normalizeSeason(form.season) ? 0 : 5)
          + Math.abs(row.Area - form.area) / 10
          + Math.abs(row.Rainfall - form.rainfall) / 1000
          + Math.abs(row.Temperature - form.temperature) / 10;
        return { row, distance };
      })
      .sort((first, second) => first.distance - second.distance)
      .slice(0, 3);
    const weights = nearbyRows.map(({ distance }) => 1 / (distance + 0.1) ** 2);
    const weightTotal = weights.reduce((total, weight) => total + weight, 0);
    const expectedYield = nearbyRows.reduce((total, item, index) => total + item.row.Yield * weights[index], 0) / weightTotal;

    return { crop, expected_yield: Math.round(expectedYield * 100) / 100, score: weightTotal };
  }).sort((first, second) => second.score - first.score);
  const totalScore = ranked.reduce((total, item) => total + item.score, 0);

  return ranked.slice(0, 5).map((item) => {
    const probability = item.score / totalScore;
    return {
      ...item,
      probability,
      suitability: probability >= 0.4 ? 'High' : probability >= 0.2 ? 'Medium' : 'Low',
    };
  });
}

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
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const area = Number(form.area);
    const rainfall = Number(form.rainfall);
    const temperature = Number(form.temperature);
    if (!Number.isFinite(area) || !Number.isFinite(rainfall) || !Number.isFinite(temperature)
      || area <= 0 || rainfall < 0) {
      setRecommendations([]);
      setError('Enter a positive area and valid rainfall and temperature values.');
      return;
    }
    setRecommendations(recommendCrops({ ...form, area, rainfall, temperature }));
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Season</label>
                <select className="input" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
                  {seasons.map((season) => <option key={season} value={season}>{season}</option>)}
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
            <button type="submit" className="btn-primary mt-6 w-full">Recommend Crops</button>
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
                    <div className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">{Math.round(item.probability * 100)}% match</div>
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
