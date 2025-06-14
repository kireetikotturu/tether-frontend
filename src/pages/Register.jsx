import React, { useState } from 'react';
import { apiFetch } from '../api/api';

export default function Register({ setPage, setUser }) {
  const [form, setForm] = useState({ email: '', phone: '', password: '', referralCode: '' });
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false); // Show OTP input after first step
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      // Step 1: Send registration info, trigger OTP send
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setOtpStep(true);
      setInfo('OTP sent to your email. Enter it below to complete registration.');
    } catch (err) {
      setError(err.message || 'Register failed');
    }
  };

  const handleOtp = async e => {
  e.preventDefault();
  setError('');
  setInfo('');
  try {
    const res = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: form.email, otp })
    });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    if (setUser) setUser(res.user);      // ✅ Safe call
    if (setPage) setPage('dashboard');   // ✅ Safe call
  } catch (err) {
    setError(err.message || 'OTP verification failed');
  }
};


  return (
    <div className="max-w-xs mx-auto bg-darkcard p-5 rounded-xl shadow mt-10">
      <h2 className="text-lg font-bold mb-4 text-primary">Register</h2>
      {!otpStep ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="email" name="email" value={form.email} onChange={handleChange}
            className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition" placeholder="Email" required />
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
            className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition" placeholder="Phone" required />
          <input type="password" name="password" value={form.password} onChange={handleChange}
            className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition" placeholder="Password" required />
          <input type="text" name="referralCode" value={form.referralCode} onChange={handleChange}
            className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition" placeholder="Referral Code (optional)" />
          <button type="submit" className="w-full py-2 bg-primary text-black font-bold rounded hover:bg-accent transition">Register</button>
        </form>
      ) : (
        <form onSubmit={handleOtp} className="space-y-4">
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition"
            placeholder="Enter OTP"
            required
            maxLength={6}
          />
          <button type="submit" className="w-full py-2 bg-primary text-black font-bold rounded hover:bg-accent transition">Verify OTP & Complete Registration</button>
        </form>
      )}
      {info && <div className="mt-3 text-green-400 text-center">{info}</div>}
      {error && <div className="mt-3 text-red-400 text-center">{error}</div>}
      <div className="mt-3 text-center">
        <span className="text-gray-400">Already have an account?</span>
        <button className="ml-2 text-primary underline" onClick={() => setPage('login')}>Login</button>
      </div>
    </div>
  );
}
