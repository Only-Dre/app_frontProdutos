import { useState } from "react";
import { Routes, Route} from "react-router-dom";
import CadastroProduto from "./pages/CadastroProduto/CadastroProduto";
import Lista from "./pages/Lista/Lista";
import Home from "./pages/Home/Home";

function App() {
  const [products, setProducts] = useState([]);

  return (
  <Routes>
      <Route path="/" element={<Home />} />
      <Route 
          path="/produto" 
          element={<CadastroProduto products={products} setProducts={setProducts} />} 
      />
      <Route 
          path="/categoria" 
          element={<CadastroProduto products={products} setProducts={setProducts} />} 
      />
      <Route 
          path="/lista" 
          element={<Lista products={products} setProducts={setProducts} />} 
      />
    </Routes>
  );
}

export default App;
