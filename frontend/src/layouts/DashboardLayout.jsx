import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/predict', label: 'Predict Yield' },
  { to: '/recommend', label: 'Crop Selection' },
  { to: '/compare', label: 'Compare Crops' },
  { to: '/history', label: 'Prediction History' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/about', label: 'Methodology' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 w-72 border-r border-slate-200 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-white">C</div>
          <div>
            <div className="text-lg font-bold">CROPWISE</div>
            <div className="text-xs text-slate-400">AI Agritech</div>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4 text-sm text-slate-300">
          <div className="mb-2 font-medium text-slate-100">{user?.name || 'Farmer User'}</div>
          <button onClick={logout} className="text-brand-300 hover:text-brand-200">Logout</button>
        </div>
      </aside>

      <main className="ml-72 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
