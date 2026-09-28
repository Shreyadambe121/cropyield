import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ totalPredictions: 0, averageYield: 0, mostPredictedCrop: 'Rice' });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/api/predictions');
        const items = response.data.predictions || [];
        const averageYield = items.length ? (items.reduce((sum, item) => sum + item.predicted_yield, 0) / items.length).toFixed(2) : 0;
        const counts = {};
        items.forEach((item) => {
          counts[item.crop] = (counts[item.crop] || 0) + 1;
        });
        const mostPredictedCrop = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Rice';
        setMetrics({ totalPredictions: items.length, averageYield, mostPredictedCrop });
        setHistory(items.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Dashboard</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Farmer insights</h1>
        </div>
        <Link to="/predict" className="btn-primary">New Prediction</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="card p-6">
          <p className="text-sm text-slate-500">Total predictions</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{metrics.totalPredictions}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-500">Recent predictions</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{Math.min(metrics.totalPredictions, 5)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-500">Most predicted crop</p>
          <p className="mt-3 text-xl font-black text-slate-900">{metrics.mostPredictedCrop}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-500">Average yield</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{metrics.averageYield} t/ha</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Prediction history</h3>
            <Link to="/history" className="text-sm font-semibold text-brand-700">View all</Link>
          </div>
          <div className="space-y-4">
            {history.length ? history.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="font-semibold text-slate-800">{item.crop}</div>
                  <div className="text-sm text-slate-500">{item.district} • {item.season}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-700">{item.predicted_yield} t/ha</div>
                  <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            )) : <div className="text-slate-500">No prediction history yet.</div>}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-900">Quick actions</h3>
          <div className="mt-5 space-y-3">
            <Link to="/predict" className="btn-primary w-full">Predict yield</Link>
            <Link to="/recommend" className="btn-secondary w-full">Recommend crops</Link>
            <Link to="/analytics" className="btn-secondary w-full">Open analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
