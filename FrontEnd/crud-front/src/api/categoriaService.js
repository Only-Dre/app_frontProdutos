// src/api/categoriaService.js
import http from "./http";

export function getCategorias() {
  return http.get("/categorias");
}

export function getCategoriaById(id) {
  return http.get(`/categorias/${id}`);
}

export function createCategoria(data) {
  return http.post("/categorias", data);
}

export function updateCategoria(id, data) {
  return http.put(`/categorias/${id}`, data);
}

export function deleteCategoria(id) {
  return http.delete(`/categorias/${id}`);
}
