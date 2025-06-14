import React, { useState } from 'react';
import { apiFetch } from '../api/api';

const wallets = {
  TRC20: "TH9N2PkXguotCrC2PbFQsHnwBZrYGSmZ8e",
  BEP20: "0x944909359A1Cb0140Ba9047F72fA503A93Bf80f1"
};

export default function Deposit({ setPage }) {
  const [form, setForm] = useState({ network: 'TRC20', amount: '', txHash: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wallets[form.network]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setStatus('');
    try {
      await apiFetch('/deposit', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setStatus('Your deposit request has been submitted. Await admin approval!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-darkcard rounded-xl p-5 mt-6 shadow mb-10">
      <h2 className="text-xl font-bold mb-4 text-primary">Deposit USDT</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">Network</label>
        <select name="network" value={form.network} onChange={handleChange}
          className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary">
          <option value="TRC20">TRC20</option>
          <option value="BEP20">BEP20</option>
        </select>
        <label className="block">Amount (USDT)</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange}
          className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary" required min="1" />
        <label className="block">Transaction Hash</label>
        <input type="text" name="txHash" value={form.txHash} onChange={handleChange}
          className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary" required />
        <div className="flex flex-col mb-2 mt-2">
          <span className="text-xs text-gray-400">Send USDT to:</span>
          <div className="flex flex-row items-center gap-2">
            <span className="font-mono text-primary break-all text-sm max-w-[210px]">{wallets[form.network]}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-1 px-2 py-1 rounded bg-primary text-black font-semibold text-xs hover:bg-accent transition"
              title="Copy address"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <button className="w-full py-2 bg-primary font-bold text-black rounded hover:bg-accent">Submit</button>
      </form>
      {status && <div className="mt-3 text-green-400">{status}</div>}
      {error && <div className="mt-3 text-red-400">{error}</div>}
    </div>
  );
}