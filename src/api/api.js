const API_URL = 'http://localhost:5000/api'; // For local testing

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
    console.log("apiFetch called with:", path, opts); // Add this

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json()).msg || 'API error');
  return res.json();
}

// POST request helper
export async function apiPost(path, body, opts = {}) {
  return apiFetch(path, { ...opts, method: 'POST', body: JSON.stringify(body) });
}

// DELETE request helper
export async function apiDelete(path, opts = {}) {
  return apiFetch(path, { ...opts, method: 'DELETE' });
}

// Example: fetch top coins from your backend
export async function getTopCoins() {
  return apiFetch('/coins/top');
}