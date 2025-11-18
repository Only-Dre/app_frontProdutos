import { useState } from "react";
import { createCategoria } from "../../api/categoriaService";
import { useNavigate } from "react-router-dom";

export default function CategoriaCreate() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await createCategoria({ nome });
    navigate("/categorias");
  }

  return (
    <div>
      <h2>Cadastrar Categoria</h2>

      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <br />
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <br /><br />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
