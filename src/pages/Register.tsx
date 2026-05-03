import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, User, Mail, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight italic uppercase mb-2">Initialize ID</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Create unique production agent identity</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-8">
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest ml-1">Username Handle</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-sm text-white"
                placeholder="Agent_Alpha"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest ml-1">Contact Email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-sm text-white"
                placeholder="identity@findejob.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest ml-1">Access Key</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <Shield size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-sm text-white"
                placeholder="Secure_Pass_99"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary mt-6"
          >
            {loading ? 'Processing...' : 'Sync Identity'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
            Already registered? <Link to="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">Authenticate</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
