import { Link } from 'react-router-dom';

const features = [
  { title: 'Yield Forecasting', description: 'Estimate expected yield before sowing using climate, district, and crop data.' },
  { title: 'Crop Suitability', description: 'Match the right crop to rainfall, temperature, and season conditions.' },
  { title: 'Historical Insights', description: 'Analyze production trends from district-level agricultural records.' },
];

const steps = [
  'Enter field conditions and district inputs',
  'Run the trained Random Forest model',
  'Review predictions and crop recommendations',
];

const stats = [
  { value: '12+', label: 'Districts modeled' },
  { value: '6', label: 'Major crop types' },
  { value: '95%', label: 'Decision support focus' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-slate-800">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-bold text-white">C</div>
          <div>
            <div className="text-xl font-bold">CROPWISE</div>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <Link to="/predict">Predict Yield</Link>
          <Link to="/recommend">Find Suitable Crop</Link>
          <Link to="/about">Methodology</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 md:grid-cols-2 md:pt-20">
          <div>
            <span className="rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">Agriculture intelligence for better planning</span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">Predict Your Crop Yield Before You Plant</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              CROPWISE combines district data, climate variables, and Random Forest models to help farmers and agribusiness users forecast yield and choose the best crop for the season.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/predict" className="btn-primary">Predict Yield</Link>
              <Link to="/recommend" className="btn-secondary">Find Suitable Crop</Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm text-slate-600">
              <div><span className="font-bold text-slate-900">6x</span> faster field planning</div>
              <div><span className="font-bold text-slate-900">AI</span> driven decisions</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-brand-200">Seasonal insight</p>
              <div className="mt-4 text-4xl font-bold">4.82</div>
              <p className="mt-2 text-brand-100">tonnes/hectare forecast for Rice in Nashik</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-800 p-3">
                  <p className="text-xs text-slate-300">Rainfall</p>
                  <p className="mt-1 font-semibold">1200 mm</p>
                </div>
                <div className="rounded-xl bg-slate-800 p-3">
                  <p className="text-xs text-slate-300">Temperature</p>
                  <p className="mt-1 font-semibold">28°C</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Features</p>
            <h2 className="mt-2 text-3xl font-bold">Built for modern agricultural decisions</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl">✓</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 py-16 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">How it works</p>
              <h2 className="mt-2 text-3xl font-bold">From field data to planting strategy</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white">{index + 1}</div>
                  <p className="text-lg font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="card p-8 text-center">
                <div className="text-4xl font-black text-brand-700">{stat.value}</div>
                <div className="mt-2 text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="font-semibold">CROPWISE</div>
          <div className="text-sm text-slate-500">AI-powered crop forecasting for smarter farming.</div>
        </div>
      </footer>
    </div>
  );
}
