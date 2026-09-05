const BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api/tasks`
  : '/api/tasks';

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: () => fetch(BASE).then(handle),
  stats: () => fetch(`${BASE}/stats`).then(handle),
  create: (payload) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
  update: (id, payload) =>
    fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
  toggle: (id) => fetch(`${BASE}/${id}/toggle`, { method: 'PATCH' }).then(handle),
  archive: (id) => fetch(`${BASE}/${id}/archive`, { method: 'PATCH' }).then(handle),
  remove: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handle),
  reorder: (orderedIds) =>
    fetch(`${BASE}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    }).then(handle),
};
