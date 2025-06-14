import React, { useEffect, useState, useContext } from 'react';
import { apiFetch } from '../api/api';
import { UserContext } from '../UserContext';

function AdminPanel() {
  const { user } = useContext(UserContext);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || !user.isAdmin) return <div className="text-center mt-10 text-xl text-red-400">Access Denied</div>;

  useEffect(() => { loadData(); }, [filter]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [deps, withs] = await Promise.all([
        apiFetch(`/adminpanel/deposits?status=${filter.status}&date=${filter.date}`),
        apiFetch(`/adminpanel/withdrawals?status=${filter.status}&date=${filter.date}`),
      ]);
      setDeposits(deps || []);
      setWithdrawals(withs || []);
    } catch (err) {
      setError('Failed to load data. Please check your connection and backend.');
      setDeposits([]);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(item, newStatus, type) {
    apiFetch(`/adminpanel/${type}/${item._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    }).then(loadData)
      .catch(() => setError('Failed to update status.'));
  }

  function exportCSV(type) {
    window.open(`/api/adminpanel/${type}/export?status=${filter.status}&date=${filter.date}`, '_blank');
    // Keep /api here if backend expects it, otherwise remove if you add CSV support
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-darkcard rounded-2xl shadow-lg mb-16">
      <h2 className="text-2xl font-bold mb-6 text-primary">Admin Panel</h2>
      <div className="flex flex-wrap gap-3 mb-5">
        <select className="p-2 rounded bg-darkbg border border-primary" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Success">Success</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input type="date" className="p-2 rounded bg-darkbg border border-primary" value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} />
        <button onClick={() => exportCSV('deposits')} className="px-3 py-2 bg-accent rounded text-black font-semibold">Export Deposits CSV</button>
        <button onClick={() => exportCSV('withdrawals')} className="px-3 py-2 bg-accent rounded text-black font-semibold">Export Withdrawals CSV</button>
      </div>
      {error && <div className="text-red-400 text-center mb-2">{error}</div>}
      <h3 className="text-primary font-bold mt-6">Deposits</h3>
      <div className="overflow-x-auto">
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-darkbg text-primary">
              <th className="px-2 py-1">User</th>
              <th className="px-2 py-1">Amount</th>
              <th className="px-2 py-1">Network</th>
              <th className="px-2 py-1">TxHash</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(dep => (
              <tr key={dep._id} className="text-gray-200 bg-darkcard border-b border-darkbg">
                <td className="px-2 py-1">{dep.userEmail}</td>
                <td className="px-2 py-1">{dep.amount}</td>
                <td className="px-2 py-1">{dep.network}</td>
                <td className="px-2 py-1 break-all">{dep.txHash}</td>
                <td className={`px-2 py-1 font-bold ${
                  dep.status === "Success" ? "text-green-400" :
                  dep.status === "Completed" ? "text-yellow-300" :
                  dep.status === "Rejected" ? "text-red-400" :
                  "text-orange-400"
                }`}>{dep.status}</td>
                <td className="px-2 py-1">{dep.createdAt?.slice(0,10)}</td>
                <td className="px-2 py-1 flex flex-row gap-1">
                  {dep.status === "Pending" && (
                    <>
                      <button onClick={() => handleStatusChange(dep, "Completed", "deposits")} className="bg-primary px-2 py-1 rounded text-xs text-black mr-1">Mark Completed</button>
                      <button onClick={() => handleStatusChange(dep, "Rejected", "deposits")} className="bg-red-500 px-2 py-1 rounded text-xs text-white">Reject</button>
                    </>
                  )}
                  {dep.status === "Completed" && (
                    <>
                      <button onClick={() => handleStatusChange(dep, "Success", "deposits")} className="bg-accent px-2 py-1 rounded text-xs text-black mr-1">Mark Success</button>
                      <button onClick={() => handleStatusChange(dep, "Rejected", "deposits")} className="bg-red-500 px-2 py-1 rounded text-xs text-white">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-primary font-bold mt-6">Withdrawals</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-darkbg text-primary">
              <th className="px-2 py-1">User</th>
              <th className="px-2 py-1">Amount</th>
              <th className="px-2 py-1">Bank</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(wd => (
              <tr key={wd._id} className="text-gray-200 bg-darkcard border-b border-darkbg">
                <td className="px-2 py-1">{wd.userEmail}</td>
                <td className="px-2 py-1">{wd.amount}</td>
                <td className="px-2 py-1">
                  <div>{wd.bank?.name}</div>
                  <div className="text-xs text-gray-400">{wd.bank?.account} / {wd.bank?.ifsc}</div>
                </td>
                <td className={`px-2 py-1 font-bold ${
                  wd.status === "Success" ? "text-green-400" :
                  wd.status === "Completed" ? "text-yellow-300" :
                  wd.status === "Rejected" ? "text-red-400" :
                  "text-orange-400"
                }`}>{wd.status}</td>
                <td className="px-2 py-1">{wd.createdAt?.slice(0,10)}</td>
                <td className="px-2 py-1 flex flex-row gap-1">
                  {wd.status === "Pending" && (
                    <>
                      <button onClick={() => handleStatusChange(wd, "Completed", "withdrawals")} className="bg-primary px-2 py-1 rounded text-xs text-black mr-1">Mark Completed</button>
                      <button onClick={() => handleStatusChange(wd, "Rejected", "withdrawals")} className="bg-red-500 px-2 py-1 rounded text-xs text-white">Reject</button>
                    </>
                  )}
                  {wd.status === "Completed" && (
                    <>
                      <button onClick={() => handleStatusChange(wd, "Success", "withdrawals")} className="bg-accent px-2 py-1 rounded text-xs text-black mr-1">Mark Success</button>
                      <button onClick={() => handleStatusChange(wd, "Rejected", "withdrawals")} className="bg-red-500 px-2 py-1 rounded text-xs text-white">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-center text-primary mt-4">Loading...</div>}
    </div>
  );
}

export default AdminPanel;