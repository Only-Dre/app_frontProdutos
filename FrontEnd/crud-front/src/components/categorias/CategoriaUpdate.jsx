import { useEffect, useState } from "react";
import { getCategoriaById, updateCategoria } from "../../api/categoriaService";
import { useNavigate, useParams } from "react-router-dom";

export default function CategoriaUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  useEffect(() => {
    getCategoriaById(id).then((c) => setNome(c.nome));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    await updateCategoria(id, { nome });
    navigate("/categorias");
  }

  return (
    <div>
      <h2>Editar Categoria</h2>

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
