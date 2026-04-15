import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8081';

export default function OfficerDashboard() {
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [availableComplaints, setAvailableComplaints] = useState([]);
  const [performance, setPerformance] = useState({});
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const [assignedRes, availableRes, performanceRes] = await Promise.all([
      axios.get(`${API}/api/officer/complaints`, { headers }),
      axios.get(`${API}/api/officer/complaints/available`, { headers }),
      axios.get(`${API}/api/officer/performance`, { headers })
    ]);
    setAssignedComplaints(assignedRes.data);
    setAvailableComplaints(availableRes.data);
    setPerformance(performanceRes.data);
  };

  useEffect(() => {
    if (!token || !['OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(localStorage.getItem('role'))) {
      window.location.href = '/login';
      return;
    }
    load().catch(() => setError('Failed to load officer dashboard data.'));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/officer/complaints/${id}/status`, { status, remarks: `Updated by officer to ${status}` }, { headers });
      await load();
    } catch {
      setError('Failed to update status. Please retry.');
    }
  };

  const claimComplaint = async (id) => {
    try {
      await axios.put(`${API}/api/officer/complaints/${id}/claim`, {}, { headers });
      await load();
    } catch {
      setError('Failed to claim complaint. Please retry.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-6 text-white">
      <h2 className="mb-2 text-3xl font-bold">Officer Operations Dashboard</h2>
      <p className="mb-6 text-slate-300">Track submitted complaints, claim new cases, and move work through the complaint lifecycle.</p>

      {error && <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4">Assigned Cases: <span className="font-bold">{performance.assignedCount || 0}</span></div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4">Resolved Cases: <span className="font-bold">{performance.resolvedCount || 0}</span></div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4">Avg Rating: <span className="font-bold">{Number(performance.avgRating || 0).toFixed(2)}</span></div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
          <h3 className="mb-3 text-xl font-semibold text-cyan-300">Available Complaints (Submitted)</h3>
          <div className="space-y-3">
            {availableComplaints.length === 0 && <div className="text-sm text-slate-400">No unassigned complaints.</div>}
            {availableComplaints.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
                <div className="font-semibold">{c.title}</div>
                <div className="mt-1 text-sm text-slate-300">{c.description}</div>
                <button onClick={() => claimComplaint(c.id)} className="mt-3 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold">Claim Case</button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
          <h3 className="mb-3 text-xl font-semibold text-emerald-300">My Assigned Complaints</h3>
          <div className="space-y-3">
            {assignedComplaints.length === 0 && <div className="text-sm text-slate-400">No assigned complaints yet. Claim from the left panel.</div>}
            {assignedComplaints.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">{c.title}</div>
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold">{c.status}</span>
                </div>
                <div className="mt-1 text-sm text-slate-300">{c.description}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                    <button key={s} onClick={() => updateStatus(c.id, s)} className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold">{s.replace('_', ' ')}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
        <h3 className="mb-4 text-2xl font-semibold">Complaint Lifecycle</h3>
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          {['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((step) => (
            <div key={step} className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm font-semibold">
              {step.replace('_', ' ')}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
