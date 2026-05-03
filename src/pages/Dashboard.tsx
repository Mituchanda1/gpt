import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { TrendingUp, Award, Activity, Clock, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back, <span className="text-emerald-500 italic">{user?.username}</span></h2>
          <p className="text-slate-500 text-sm mt-1">You have 12 new high-paying surveys available today for node findejob.com</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Balance</span>
              <span className="text-2xl font-bold text-emerald-400 leading-none">{user?.points} <span className="text-xs font-medium text-emerald-500/60">PTS</span></span>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Active Offers" value="128" sub="+14 since yesterday" color="text-white" subColor="text-emerald-500" />
        <StatCard label="Completed Today" value="12" sub="Earned $4.50 (Est.)" color="text-white" subColor="text-emerald-500" />
        <StatCard label="User Level" value="Gold" sub="180 pts to Platinum" color="text-white" subColor="text-slate-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Node Operations</h3>
            <span className="text-[10px] text-emerald-500 font-bold hover:underline cursor-pointer">View All Vendors →</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <OfferVendorCard initials="BL" name="BitLabs" desc="High Payout" color="bg-blue-500/20 text-blue-400" />
             <OfferVendorCard initials="CP" name="CPX Research" desc="Opinion Polls" color="bg-red-500/20 text-red-400" />
             <OfferVendorCard initials="LT" name="Lootably" desc="App Installs" color="bg-purple-500/20 text-purple-400" />
             <OfferVendorCard initials="AY" name="AdYeti" desc="Video Rewards" color="bg-orange-500/20 text-orange-400" />
          </div>
        </section>

        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Live Global Feed</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Live updates</span>
              </div>
           </div>
           
           <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
              <LogEntry time="14:22" user="khalid99" action="completed" target="Surveoo Wall" points="+450 PTS" />
              <LogEntry time="14:21" user="m_raju" action="withdrew" target="$5.00 via bKash" color="text-emerald-400" points="PROCESSED" />
              <LogEntry time="14:20" user="shuvo_h" action="completed" target="AdGate Task" points="+1,200 PTS" />
              <LogEntry time="14:18" user="aminul_x" action="completed" target="CPX Survey" points="+85 PTS" />
           </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, subColor }: any) {
  return (
    <div className="glass-card">
      <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</div>
      <div className={`text-3xl font-bold tracking-tighter ${color}`}>{value}</div>
      <div className={`text-[10px] mt-2 font-bold ${subColor}`}>{sub}</div>
    </div>
  );
}

function OfferVendorCard({ initials, name, desc, color }: any) {
  return (
    <Link to="/offerwall" className="glass p-5 rounded-2xl flex flex-col items-center text-center group hover:bg-white/[0.08] transition-all border border-transparent hover:border-white/10">
      <div className={`w-12 h-12 ${color} rounded-full mb-3 flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
        {initials}
      </div>
      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{name}</div>
      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{desc}</div>
      <div className="mt-4 text-[10px] bg-white/5 w-full py-2 rounded-lg font-bold text-slate-400 uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-all">
        Open Wall
      </div>
    </Link>
  );
}

function LogEntry({ time, user, action, target, points, color }: any) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-600 font-mono">{time}</span>
        <span className="text-white font-medium italic">{user}</span>
        <span className="text-slate-500">{action}</span>
        <span className="text-emerald-500 font-medium">{target}</span>
      </div>
      <span className={`text-[10px] font-bold ${color || 'text-slate-400'}`}>{points}</span>
    </div>
  );
}
