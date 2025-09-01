export async function apiFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: 'Bearer test-token'
    }
  });
  return res.json();
}
