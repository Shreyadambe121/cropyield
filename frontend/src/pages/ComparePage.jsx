import { useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const crops = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Soybean', 'Sugarcane'
];

const sampleData = [
  { crop: 'Rice', predictedYield: 4.8, historicalYield: 4.1, rainfall: 1000, temperature: 28, season: 'Kharif', suitability: 'High' },
  { crop: 'Wheat', predictedYield: 4.5, historicalYield: 4.8, rainfall: 550, temperature: 24, season: 'Rabi', suitability: 'High' },
  { crop: 'Maize', predictedYield: 4.2, historicalYield: 3.9, rainfall: 850, temperature: 27, season: 'Kharif', suitability: 'Medium' },
  { crop: 'Cotton', predictedYield: 3.8, historicalYield: 3.4, rainfall: 700, temperature: 30, season: 'Kharif', suitability: 'Medium' },
];

export default function ComparePage() {
  const [selected, setSelected] = useState(['Rice', 'Wheat', 'Maize', 'Cotton']);

  const list = sampleData.filter((item) => selected.includes(item.crop));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Crop comparison</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Compare crop performance</h1>
        </div>

        <div className="card mb-8 p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {crops.map((crop) => (
              <label key={crop} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(crop)}
                  onChange={() => {
                    if (selected.includes(crop)) {
                      setSelected(selected.filter((item) => item !== crop));
                    } else if (selected.length < 4) {
                      setSelected([...selected, crop]);
                    }
                  }}
                />
                {crop}
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={list}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predictedYield" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">Crop</th>
                <th className="p-4">Predicted Yield</th>
                <th className="p-4">Historical Yield</th>
                <th className="p-4">Rainfall</th>
                <th className="p-4">Temperature</th>
                <th className="p-4">Season</th>
                <th className="p-4">Suitability</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.crop} className="border-t border-slate-200">
                  <td className="p-4 font-semibold">{item.crop}</td>
                  <td className="p-4">{item.predictedYield} t/ha</td>
                  <td className="p-4">{item.historicalYield} t/ha</td>
                  <td className="p-4">{item.rainfall} mm</td>
                  <td className="p-4">{item.temperature}°C</td>
                  <td className="p-4">{item.season}</td>
                  <td className="p-4"><span className="rounded-full bg-brand-100 px-2 py-1 text-brand-700">{item.suitability}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
