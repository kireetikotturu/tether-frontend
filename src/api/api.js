// ✅ Use environment variable for dynamic backend URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  console.log("apiFetch called with:", path, opts); // ✅ Useful for debug

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json()).msg || 'API error');
  return res.json();
}

export async function apiPost(path, body, opts = {}) {
  return apiFetch(path, { ...opts, method: 'POST', body: JSON.stringify(body) });
}

export async function apiDelete(path, opts = {}) {
  return apiFetch(path, { ...opts, method: 'DELETE' });
}

export async function getTopCoins() {
  return apiFetch('/coins/top');
}
