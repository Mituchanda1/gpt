import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, TrendingUp, BrainCircuit, Sparkles, Server } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center py-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-5 py-1.5 rounded-full">
              Production Node Alpha
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.9]">
            Optimize Your <br />
            <span className="text-emerald-500 italic">Precision</span> Earn.
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-12">
            The world's most advanced AI-powered offerwall ecosystem. Deploy GPT models to maximize survey yields and credit rewards with sub-millisecond precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/register" className="btn-primary group">
              Initialize Account
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-outline">
              System Access
            </Link>
          </div>
        </motion.div>

        {/* Decorative Light Leak */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<BrainCircuit className="text-emerald-500" size={28} />}
          title="GPT Yield Engine"
          desc="Our proprietary model analyzes survey metadata to predict the highest payout probability based on your agent profile."
        />
        <FeatureCard 
          icon={<Server className="text-emerald-500" size={28} />}
          title="VPS Optimized"
          desc="Hosted on high-speed Hostinger VPS nodes for zero-latency reward processing and instant postback validation."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-500" size={28} />}
          title="Vault Security"
          desc="Enterprise-grade encryption for all reward withdrawals via bKash, Crypto, and local bank transfers."
        />
      </section>

      {/* Trust Stats */}
      <div className="glass rounded-2xl p-1 px-1 bg-white/5 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <StatItem label="Distributed Rewards" value="$1.24M" />
            <StatItem label="Active Agents" value="18,492" />
            <StatItem label="Daily Volume" value="4.2M PTS" />
            <StatItem label="Node Uptime" value="99.98%" />
        </div>
      </div>

      <section className="text-center opacity-40">
         <p className="text-[10px] uppercase tracking-[0.5em]">
           findejob.com // Secure Infrastructure Provided by Hostinger
         </p>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="glass-card group hover:border-emerald-500/30">
      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function StatItem({ label, value }: any) {
  return (
    <div className="p-8 text-center">
        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
  )
}
