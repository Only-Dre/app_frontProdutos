// src/api/produtoService.js
import http from "./http";

export function getProdutos() {
  return http.get("/produtos");
}

export function getProdutoById(id) {
  return http.get(`/produtos/${id}`);
}

export function createProduto(data) {
  return http.post("/produtos", data);
}

export function updateProduto(id, data) {
  return http.put(`/produtos/${id}`, data);
}

export function deleteProduto(id) {
  return http.delete(`/produtos/${id}`);
}
