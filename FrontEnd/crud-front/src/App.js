import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProdutoList from "./components/produtos/ProdutoList";
import ProdutoCreate from "./components/produtos/ProdutoCreate";
import ProdutoUpdate from "./components/produtos/ProdutoUpdate";
import ProdutoDelete from "./components/produtos/ProdutoDelete";

import CategoriaList from "./components/categorias/CategoriaList";
import CategoriaCreate from "./components/categorias/CategoriaCreate";
import CategoriaUpdate from "./components/categorias/CategoriaUpdate";
import CategoriaDelete from "./components/categorias/CategoriaDelete";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Produtos */}
        <Route path="/produtos" element={<ProdutoList />} />
        <Route path="/produtos/novo" element={<ProdutoCreate />} />
        <Route path="/produtos/editar/:id" element={<ProdutoUpdate />} />
        <Route path="/produtos/excluir/:id" element={<ProdutoDelete />} />

        {/* Categorias */}
        <Route path="/categorias" element={<CategoriaList />} />
        <Route path="/categorias/novo" element={<CategoriaCreate />} />
        <Route path="/categorias/editar/:id" element={<CategoriaUpdate />} />
        <Route path="/categorias/excluir/:id" element={<CategoriaDelete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
