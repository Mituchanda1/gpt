import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, AlertCircle, RefreshCw, Zap, TrendingUp, Shield } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  provider: string;
  url: string;
}

export default function Offerwall() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { user, setUser } = useAuth();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/offers');
      if (response.ok) {
        setOffers(await response.json());
      }
    } catch (err) {
      setError('Failed to fetch offer nodes');
    } finally {
      setLoading(false);
    }
  };

  const completeOffer = async (offerId: string) => {
    setCompleting(offerId);
    try {
      const response = await fetch('/api/offers/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, points: data.currentPoints });
      }
    } catch (err) {
      console.error('Completion error', err);
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight italic uppercase">Survey <span className="text-emerald-500">Nodes</span></h2>
          <p className="text-slate-500 text-sm mt-1">High-yield data validation tasks for findejob.com</p>
        </div>
        <button onClick={fetchOffers} className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-64 animate-pulse bg-white/5" />
            ))
          ) : (
            offers.map((offer) => (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <OfferCard 
                  offer={offer} 
                  onComplete={() => completeOffer(offer.id)}
                  isCompleting={completing === offer.id}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Trust & Optimization Section */}
      <section className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 w-fit px-4 py-2 rounded-full border border-emerald-500/20">
                <Shield size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Enterprise Validation</span>
              </div>
              <h3 className="text-4xl font-bold text-white leading-tight">GPT-4o Optimized <br /> <span className="text-emerald-500 italic">Yield Mapping.</span></h3>
              <p className="text-slate-400 leading-relaxed">
                Every task node is dynamically priced based on current network demand. By engaging with high-complexity nodes, you improve your agent reputation and unlock exclusive $10+ bounty tasks.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <TrendingUp className="text-emerald-500 mb-4" size={24} />
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Avg. hourly</p>
                  <p className="text-2xl font-bold text-white tracking-tight">850 PTS</p>
               </div>
               <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <Zap className="text-emerald-500 mb-4" size={24} />
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Insta-Credit</p>
                  <p className="text-2xl font-bold text-white tracking-tight">Active</p>
               </div>
            </div>
        </div>
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      </section>
    </div>
  );
}

function OfferCard({ offer, onComplete, isCompleting }: { offer: Offer, onComplete: () => void, isCompleting: boolean }) {
  return (
    <div className="glass-card hover:bg-white/[0.08] flex flex-col justify-between h-full group border border-transparent hover:border-emerald-500/30">
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
            {offer.category}
          </span>
          <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">{offer.provider}</span>
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight mb-3 italic">{offer.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed group-hover:text-slate-400 transition-colors">
          {offer.description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-bold mb-1 italic">Potential Yield</span>
          <span className="text-xl font-bold text-emerald-400 leading-none">+{offer.reward} <span className="text-xs font-medium opacity-60">PTS</span></span>
        </div>
        
        <button 
          onClick={() => {
            window.open(offer.url, '_blank');
            setTimeout(onComplete, 5000); // Simulate return flow
          }}
          disabled={isCompleting}
          className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          {isCompleting ? <RefreshCw className="animate-spin" size={20} /> : <ExternalLink size={20} />}
        </button>
      </div>
    </div>
  );
}
