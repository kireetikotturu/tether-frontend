const API_URL =
  import.meta.env.PROD
    ? 'https://tether-backend.onrender.com/api'
    : 'http://localhost:5000/api';

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  console.log("apiFetch called with:", path, opts);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });

  if (!res.ok) {
    const text = await res.text();
    let msg = 'API error';
    try {
      msg = JSON.parse(text).msg;
    } catch (err) {
      msg = text;
    }
    throw new Error(msg);
  }

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
