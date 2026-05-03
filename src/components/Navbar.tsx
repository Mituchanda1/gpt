import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutGrid, ClipboardList, BrainCircuit, User, LogOut, Zap, Trophy, CreditCard } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    setUser(null);
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-full md:w-64 border-r border-white/5 bg-[#0A0A0A] flex flex-col h-auto md:h-screen">
      <div className="p-6 mb-4">
        <Link to="/" className="block">
          <h1 className="text-xl font-bold tracking-tight text-white group flex items-center gap-2">
            finde<span className="text-emerald-500">job</span>.com
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">GPT & Offerwall Hub</p>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {user ? (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              <LayoutGrid size={18} /> <span>Dashboard</span>
            </Link>
            <Link to="/offerwall" className={`nav-link ${isActive('/offerwall') ? 'active' : ''}`}>
              <ClipboardList size={18} /> <span>Surveys</span>
            </Link>
            <Link to="/survey-gpt" className={`nav-link ${isActive('/survey-gpt') ? 'active' : ''}`}>
              <BrainCircuit size={18} /> <span>Survey GPT</span>
            </Link>
            <div className="sidebar-link flex items-center gap-3 p-3 rounded-lg text-sm text-slate-500 hover:text-white cursor-not-allowed opacity-50">
              <Trophy size={18} /> <span>Leaderboard</span>
            </div>
            <div className="sidebar-link flex items-center gap-3 p-3 rounded-lg text-sm text-slate-500 hover:text-white cursor-not-allowed opacity-50">
              <CreditCard size={18} /> <span>Withdrawals</span>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              <User size={18} /> <span>Login Portal</span>
            </Link>
            <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
              <Zap size={18} /> <span>Join Hub</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        {user && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 mb-4">
             <div className="flex flex-col">
                <span className="text-[10px] uppercase text-emerald-500 font-bold">Balance</span>
                <span className="text-lg font-bold text-white leading-none">{user.points} <span className="text-xs text-slate-400">PTS</span></span>
             </div>
             <button onClick={logout} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <LogOut size={18} />
             </button>
          </div>
        )}

        <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
          <div className="text-xs text-emerald-500 font-bold uppercase">Support Status</div>
          <div className="text-sm text-white mt-1">Server Online</div>
          <div className="text-[10px] text-slate-500 mt-2">VPS Node: Hostinger 01</div>
        </div>
      </div>
    </aside>
  );
}
