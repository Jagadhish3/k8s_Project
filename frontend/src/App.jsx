import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import ComplaintForm from './components/ComplaintForm';
import OfficerDashboard from './components/OfficerDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-slate-900 text-white">
        <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/70 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <h1 className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              Smart Public Safety....
            </h1>
            <div className="flex items-center gap-4 text-sm sm:text-base">
              <Link to="/login" className="text-slate-300 transition hover:text-blue-300">Login</Link>
              <Link to="/submit" className="text-slate-300 transition hover:text-emerald-300">Report Issue</Link>
              <Link to="/officer" className="text-slate-300 transition hover:text-emerald-300">Officer</Link>
              <Link to="/analytics" className="text-slate-300 transition hover:text-emerald-300">Analytics</Link>
            </div>
          </div>
        </nav>

        <main className="w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/submit" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/officer" element={<OfficerDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/submit" element={<ComplaintForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
