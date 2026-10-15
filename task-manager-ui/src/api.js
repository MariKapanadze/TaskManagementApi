const BASE = `${import.meta.env.VITE_API_URL}/tasks`;

async function request(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Cannot reach the server. Please check that the API is running.');
  }

  if (!res.ok) {
    let message = `Request failed (status ${res.status}).`;
    try {
      const body = await res.json();
      if (body.errors) message = Object.values(body.errors).flat().join(' ');
      else if (body.detail) message = body.detail;
      else if (body.title) message = body.title;
    } catch {
        //ignore
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

const jsonOptions = (method, data) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export const getTasks = (status) =>
  request(status ? `${BASE}?status=${status}` : BASE);

export const createTask = (data) => request(BASE, jsonOptions('POST', data));

export const updateTask = (id, data) =>
  request(`${BASE}/${id}`, jsonOptions('PUT', data));

export const deleteTask = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });