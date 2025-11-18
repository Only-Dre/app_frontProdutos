// src/api/http.js
const BASE_URL = "http://localhost:4567";

async function request(endpoint, method = "GET", body = null) {
  const options = { method, headers: {} };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const resp = await fetch(`${BASE_URL}${endpoint}`, options);

  // Se status não OK, pega texto e lança erro
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`Erro ${resp.status}: ${msg}`);
  }

  // Quando DELETE ou resposta vazia, resp.json() pode falhar
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

const http = {
  get: (url) => request(url, "GET"),
  post: (url, body) => request(url, "POST", body),
  put: (url, body) => request(url, "PUT", body),
  delete: (url) => request(url, "DELETE"),
};

export default http;
