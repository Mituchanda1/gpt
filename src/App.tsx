import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Offerwall from './pages/Offerwall';
import SurveyGPT from './pages/SurveyGPT';
import Landing from './pages/Landing';
import { AuthContext } from './hooks/useAuth';
import './index.css';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E4E3E0]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#141414] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm uppercase tracking-widest text-[#141414]/60">Initializing Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans flex flex-col md:flex-row">
          <Navbar />
          <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 bg-gradient-to-br from-[#0A0A0A] to-[#0F172A]">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/offerwall" element={user ? <Offerwall /> : <Navigate to="/login" />} />
              <Route path="/survey-gpt" element={user ? <SurveyGPT /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
