import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const cropData = [
  { crop: 'Rice', averageYield: 2.8 },
  { crop: 'Wheat', averageYield: 4.8 },
  { crop: 'Maize', averageYield: 3.5 },
  { crop: 'Cotton', averageYield: 3.4 },
  { crop: 'Soybean', averageYield: 3.4 },
  { crop: 'Sugarcane', averageYield: 17.7 },
];

const seasonalData = [
  { season: 'Kharif', averageYield: 3.4 },
  { season: 'Rabi', averageYield: 4.5 },
  { season: 'Summer', averageYield: 3.8 },
  { season: 'Annual', averageYield: 17.3 },
];

const rainfallData = [
  { rainfall: 500, yield: 3.1 },
  { rainfall: 750, yield: 3.9 },
  { rainfall: 1000, yield: 4.5 },
  { rainfall: 1250, yield: 4.8 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Analytics dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Agriculture insights</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Crop-wise average yield</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageYield" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Seasonal yield</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageYield" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Rainfall vs yield</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rainfall" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="yield" stroke="#166534" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Predicted vs historical yield</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="historical" stroke="#94a3b8" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
