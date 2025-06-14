import React, { useEffect, useState } from 'react';
import binanceLogo from '../assets/binance.png';
import wazirxLogo from '../assets/wazirx.png';

export default function Home({ setPage }) {
  const [rates, setRates] = useState({ binance: 90, wazirx: 91 });
  useEffect(() => {
    const interval = setInterval(() => {
      setRates({
        binance: (89 + Math.random() * 2).toFixed(2),
        wazirx: (89 + Math.random() * 2).toFixed(2)
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-2xl font-bold mb-3 text-primary">Welcome to Tether2inr</h1>
      <div className="flex space-x-6 mb-4">
        <img src={binanceLogo} alt="Binance" className="h-10" />
        <img src={wazirxLogo} alt="WazirX" className="h-10" />
      </div>
      <div className="bg-darkcard rounded-xl p-5 shadow-md w-full max-w-xs mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Binance Buy Rate</span>
          <span className="font-bold text-green-400">₹{rates.binance}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">WazirX Buy Rate</span>
          <span className="font-bold text-blue-400">₹{rates.wazirx}</span>
        </div>
      </div>
      <button
        onClick={() => setPage('deposit')}
        className="mt-4 px-6 py-2 bg-primary text-black rounded-lg shadow hover:bg-accent transition font-bold animate-bounce"
      >
        Sell USDT at <span className="text-secondary font-extrabold">₹95</span>
      </button>
      <p className="text-gray-500 mt-6 text-center text-sm">
        Fastest USDT to INR exchange in India • Safe • Instant • Reliable
      </p>
    </div>
  );
}