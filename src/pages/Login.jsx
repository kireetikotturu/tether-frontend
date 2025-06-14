import React, { useState, useContext } from 'react';
import { apiFetch } from '../api/api';
import { UserContext } from '../UserContext'; // Adjust path if needed

export default function Login({ setPage }) {
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    console.log("Login form submitted", form);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      console.log("Login API response:", res);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user); // <- from context
      setPage('dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-xs mx-auto bg-darkcard p-5 rounded-xl shadow mt-10">
      <h2 className="text-lg font-bold mb-4 text-primary">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          name="emailOrPhone"
          value={form.emailOrPhone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition"
          placeholder="Email or Phone"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-darkbg border border-darkbg focus:border-primary transition"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-black font-bold rounded hover:bg-accent transition"
        >
          Login
        </button>
      </form>
      {error && <div className="mt-3 text-red-400 text-center">{error}</div>}
      <div className="mt-3 text-center">
        <span className="text-gray-400">Don't have an account?</span>
        <button className="ml-2 text-primary underline" onClick={() => setPage('register')}>
          Register
        </button>
      </div>
    </div>
  );
}