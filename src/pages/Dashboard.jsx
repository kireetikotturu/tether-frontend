import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';

const QUOTES = [
  "Your crypto, your control.",
  "Where crypto meets security.",
  "Your gateway to smarter, faster crypto investments.",
  "Tap into expert insights, maximize profits & conquer the market.",
  "Fastest USDT to INR exchange in India.",
  "Sell USDT, get INR instantly & securely.",
  "Experience seamless crypto-to-cash: Tether2inr.",
  "Trust. Speed. Simplicity. That's Tether2inr.",
  "Exchange USDT to INR — Safely. Instantly. Reliably."
];

export default function Dashboard({ setPage, user }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState({ deposits: [], withdrawals: [] });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch('/user/profile').then(setProfile);
    apiFetch('/user/history').then(setHistory);
  }, []);

  // Animated quote carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % QUOTES.length);
        setQuoteFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!profile) return <div className="text-center py-8">Loading...</div>;

  function handleCopyReferral() {
    navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div
      className="max-w-xl mx-auto bg-gradient-to-tr from-darkcard via-[#232f3e] to-darkbg rounded-2xl p-6 shadow-xl ring-1 ring-primary/30"
      style={{ boxShadow: "0 8px 32px 0 rgba(32,54,110,0.18)" }}
    >
      {/* Animated Quotes */}
      <div className="mb-8 min-h-[3rem] flex items-center justify-center relative">
        <div
          className={`absolute w-full transition-opacity duration-500 text-center font-semibold tracking-wide
            bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent
            ${quoteFade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          style={{
            fontSize: "1.18rem",
            letterSpacing: "0.03em",
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          {QUOTES[quoteIndex]}
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center mb-8">
        <div className="w-full flex flex-col items-center">
          <span
            className="font-bold text-xl md:text-2xl text-sky-200 bg-gradient-to-r from-sky-400 via-white to-sky-300 bg-clip-text text-transparent
            px-6 py-2 rounded-2xl shadow-lg border-2 border-solid
            border-transparent"
            style={{
              borderImage: 'linear-gradient(90deg, #22c55e, #4ade80, #bbf7d0) 1',
              boxShadow: '0 0 12px 2px #22c55e, 0 0 32px 4px #4ade80',
              transition: 'box-shadow 0.3s'
            }}
          >
            {profile.email}
          </span>
        </div>
        <div className="flex flex-row gap-8 items-center w-full justify-center mt-2 mb-2">
          <div className="flex flex-col items-center">
            <span className="text-base text-gray-400 font-medium tracking-wide font-sans">USDT Balance</span>
            <span className="text-primary text-xl md:text-2xl font-bold font-sans">{profile.usdtBalance || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base text-gray-400 font-medium tracking-wide font-sans">Referral Earnings</span>
            <span className="text-accent text-xl md:text-2xl font-bold font-sans">{profile.referralEarnings || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base text-gray-400 font-semibold font-sans">Referral Code:</span>
          <span className="font-mono bg-darkbg/80 px-4 py-2 rounded-full shadow-inner border border-primary/30 text-primary text-lg select-all tracking-wider font-bold">
            {profile.referralCode}
          </span>
          <button
            onClick={handleCopyReferral}
            className="ml-1 px-3 py-2 rounded-full bg-primary/90 text-black font-bold text-base hover:scale-110 active:scale-95 transition shadow-lg"
            title="Copy Referral Code"
            aria-label="Copy Referral Code"
          >
            {copied ? (
              <span className="animate-pulse font-semibold text-green-700">Copied!</span>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" className="inline" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" fill="none" strokeWidth="2"/>
                <rect x="3" y="3" width="13" height="13" rx="2" fill="none" strokeWidth="2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex space-x-3 mb-7">
        <button
          className="flex-1 rounded-xl bg-gradient-to-r from-primary via-accent to-primary text-black font-extrabold text-base md:text-lg hover:scale-105 transition shadow-lg
            py-2 md:py-3"
          onClick={() => setPage('deposit')}
        >
          Deposit
        </button>
        <button
          className="flex-1 rounded-xl bg-gradient-to-r from-primary via-accent to-primary text-black font-extrabold text-base md:text-lg hover:scale-105 transition shadow-lg
            py-2 md:py-3"
          onClick={() => setPage('withdraw')}
        >
          Withdraw
        </button>
      </div>

      <div className="mb-5">
        <h4 className="text-primary font-bold text-lg mb-2 tracking-wide">Deposit History</h4>
        <div className="max-h-40 overflow-auto text-base rounded bg-darkbg/40 p-3 shadow-inner">
          {history.deposits.length === 0 ? (
            <div className="text-gray-400">No deposits yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-base font-semibold">
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Network</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.deposits.map((d, i) => (
                  <tr key={i}>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td>{d.amount}</td>
                    <td>{d.network}</td>
                    <td
                      className={`font-bold ${
                        d.status === "Success"
                          ? "text-green-400"
                          : d.status === "Completed"
                          ? "text-yellow-400"
                          : "text-orange-400"
                      }`}
                    >
                      {d.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-primary font-bold text-lg mb-2 tracking-wide">Withdrawal History</h4>
        <div className="max-h-40 overflow-auto text-base rounded bg-darkbg/40 p-3 shadow-inner">
          {history.withdrawals.length === 0 ? (
            <div className="text-gray-400">No withdrawals yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-base font-semibold">
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.withdrawals.map((w, i) => (
                  <tr key={i}>
                    <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td>{w.amount}</td>
                    <td>{w.method}</td>
                    <td
                      className={`font-bold ${
                        w.status === "Success" ? "text-green-400" : "text-orange-400"
                      }`}
                    >
                      {w.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}