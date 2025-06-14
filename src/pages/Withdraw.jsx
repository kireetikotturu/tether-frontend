import React, { useEffect, useState, useContext } from 'react';
import { apiFetch, apiPost, apiDelete } from '../api/api';
import { UserContext } from '../UserContext';

export default function Withdraw({ setPage }) {
  const { user, setUser } = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState({ name: '', ifsc: '', account: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pendingDeleteBankId, setPendingDeleteBankId] = useState('');
  const [availableUsdt, setAvailableUsdt] = useState(user?.usdtBalance || 0);
  const USDT_PRICE = 95;

  useEffect(() => {
    fetchBanks();
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchBanks = async () => {
    try {
      const banks = await apiFetch('/user/banks');
      setBankAccounts(banks || []);
      // If selectedBankId not found, pick the first, or clear
      if (banks.length && (!selectedBankId || !banks.find(b => b._id === selectedBankId))) {
        setSelectedBankId(banks[0]._id);
      } else if (!banks.length) {
        setSelectedBankId('');
      }
    } catch {
      setBankAccounts([]);
      setSelectedBankId('');
    }
  };

  const fetchProfile = async () => {
    try {
      const profile = await apiFetch('/user/profile');
      setAvailableUsdt(Number(profile.usdtBalance) || 0);
      setUser && setUser(profile);
    } catch {
      setAvailableUsdt(0);
    }
  };

  function handleBankFormChange(e) {
    setBankForm({ ...bankForm, [e.target.name]: e.target.value });
  }

  async function handleAddBank() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiPost('/user/banks', bankForm);
      setShowBankForm(false);
      setBankForm({ name: '', ifsc: '', account: '' });
      setMessage('Bank added!');
      await fetchBanks();
      setTimeout(() => setMessage(''), 1300);
    } catch {
      setError('Failed to add bank.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveBank(bankId) {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiDelete(`/user/banks/${bankId}`);
      setMessage('Bank removed!');
      await fetchBanks();
      setTimeout(() => setMessage(''), 1300);
    } catch {
      setError('Failed to remove bank.');
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const amt = Number(String(amount).replace(/,/g, '').trim());
    if (!selectedBankId) {
      setError('Please select a bank account.');
      setLoading(false);
      return;
    }
    if (!amt || isNaN(amt) || amt < 10) {
      setError('Enter valid amount (min 10).');
      setLoading(false);
      return;
    }
    if (amt > availableUsdt) {
      setError('Please enter an amount equal to or less than your available balance.');
      setLoading(false);
      return;
    }
    const bankObj = bankAccounts.find(b => b._id === selectedBankId);
    // Debugging line
    console.log("Withdraw DEBUG:",
      "bankAccounts:", bankAccounts,
      "selectedBankId:", selectedBankId,
      "found:", bankObj
    );
    if (!bankObj) {
      setError('Invalid bank selected.');
      setLoading(false);
      return;
    }
    try {
      const res = await apiPost('/withdraw', {
        amount: amt,
        bank: {
          _id: bankObj._id, // <-- Added _id for backend validation!
          name: bankObj.name,
          ifsc: bankObj.ifsc,
          account: bankObj.account
        },
        method: "bank"
      });
      setAmount('');
      setMessage('Withdrawal request submitted!');
      await fetchProfile();
      setTimeout(() => setMessage(''), 1400);
    } catch (err) {
      setError(
        err?.response?.data?.msg ||
        err?.message ||
        'Failed to withdraw.'
      );
    } finally {
      setLoading(false);
    }
  }

  function ConfirmDeleteModal({ onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-darkcard p-6 rounded-2xl shadow-2xl text-center border-2 border-primary w-[90vw] max-w-xs">
          <div className="text-primary text-lg font-semibold mb-5">Remove this bank?</div>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-2 rounded-lg font-bold bg-primary text-black shadow hover:bg-accent transition"
              onClick={onConfirm}
            >Yes</button>
            <button
              className="px-6 py-2 rounded-lg font-bold bg-darkbg text-primary border border-primary shadow hover:bg-darkcard transition"
              onClick={onCancel}
            >Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-[#151a14] via-[#17261b] to-[#1b3220] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto bg-darkcard rounded-2xl p-6 mt-8 mb-20 shadow-2xl border border-primary relative">
        <h2 className="text-2xl font-extrabold mb-4 text-center text-primary tracking-tight drop-shadow-lg flex items-center justify-center gap-2">
          <svg width={28} height={28} className="inline-block text-primary" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Withdraw USDT
        </h2>
        {(error || message) && (
          <div className={`mb-4 text-center font-semibold py-2 px-2 rounded-xl shadow text-sm transition-all
            ${error ? 'bg-red-950/60 text-red-400' : 'bg-green-900/70 text-green-300'}`}>
            {error || message}
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-4">
          <label className="block text-sm font-medium text-primary mb-1">Amount (USDT)</label>
          <input
            type="number"
            min={10}
            max={availableUsdt}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-darkbg border border-primary/40 focus:border-primary outline-none font-semibold text-primary text-base transition placeholder:text-gray-500"
            placeholder="Enter amount"
            required
            inputMode="decimal"
          />
          <div className="flex flex-col gap-0.5 mb-1">
            <span className="text-xs text-gray-400">
              Balance: <b className="text-primary">{availableUsdt}</b> USDT
            </span>
            <span className="text-xs text-gray-400">
              Price: <b className="text-primary">₹{USDT_PRICE} per USDT</b>
            </span>
            <span className="text-xs text-gray-400">
              You get: <b className="text-primary">{amount ? (Number(amount) * USDT_PRICE).toFixed(2) : '0.00'}</b>
            </span>
          </div>

          <label className="block text-sm font-medium text-primary mb-1 mt-2">Bank Account</label>
          <div className="flex flex-col gap-2 mb-2">
            {bankAccounts.length === 0 &&
              <span className="text-xs text-gray-400 mb-2 ml-1">No saved banks yet.</span>
            }
            {bankAccounts.map(bank => (
              <div
                key={bank._id}
                className={`flex items-center justify-between p-3 rounded-2xl border-[1.5px] shadow-md transition-all cursor-pointer
                  ${selectedBankId === bank._id
                    ? 'border-primary bg-darkbg scale-[1.04]'
                    : 'border-[#222c25] bg-darkcard hover:border-primary/70'}
                  `}
                onClick={() => setSelectedBankId(bank._id)}
                style={{ marginBottom: 4 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-primary truncate">{bank.name}</div>
                  <div className="text-xs text-gray-400 truncate">A/C: {bank.account}</div>
                  <div className="text-xs text-gray-500 truncate">IFSC: {bank.ifsc}</div>
                </div>
                <button
                  type="button"
                  className="ml-3 px-2 py-1 rounded bg-primary text-black text-xs font-bold shadow hover:bg-accent transition"
                  onClick={e => { e.stopPropagation(); setPendingDeleteBankId(bank._id); }}
                  disabled={loading}
                  title="Remove Bank"
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" className="inline-block" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`w-full py-2 mb-2 bg-gradient-to-r from-primary to-accent font-bold text-black rounded-xl hover:from-accent hover:to-primary transition shadow ${showBankForm ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setShowBankForm(!showBankForm)}
          >
            {showBankForm ? 'Cancel' : 'Add New Bank'}
          </button>

          {showBankForm && (
            <div className="mb-2 mt-1 p-4 rounded-xl border border-primary bg-darkbg flex flex-col gap-3 shadow-lg animate-fade-in">
              <div className="flex flex-col gap-1">
                <label className="text-primary font-semibold">Account Holder Name</label>
                <input
                  type="text"
                  name="name"
                  value={bankForm.name}
                  onChange={handleBankFormChange}
                  className="rounded px-3 py-2 bg-darkcard text-primary border border-darkbg focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-primary font-semibold">IFSC Code</label>
                <input
                  type="text"
                  name="ifsc"
                  value={bankForm.ifsc}
                  onChange={handleBankFormChange}
                  className="rounded px-3 py-2 bg-darkcard text-primary border border-darkbg focus:border-primary outline-none uppercase"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-primary font-semibold">Account Number</label>
                <input
                  type="text"
                  name="account"
                  value={bankForm.account}
                  onChange={handleBankFormChange}
                  className="rounded px-3 py-2 bg-darkcard text-primary border border-darkbg focus:border-primary outline-none"
                  required
                />
              </div>
              <button
                type="button"
                className="mt-2 py-2 rounded-xl bg-primary text-black font-bold hover:bg-accent transition shadow"
                disabled={loading}
                onClick={handleAddBank}
              >
                {loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-primary to-accent font-bold text-black rounded-xl hover:from-accent hover:to-primary transition shadow-lg text-lg"
            disabled={loading || !selectedBankId || !amount || !bankAccounts.find(b => b._id === selectedBankId)}
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </button>
        </form>
        {pendingDeleteBankId && (
          <ConfirmDeleteModal
            onConfirm={() => {
              handleRemoveBank(pendingDeleteBankId);
              setPendingDeleteBankId('');
            }}
            onCancel={() => setPendingDeleteBankId('')}
          />
        )}
      </div>
    </div>
  );
}