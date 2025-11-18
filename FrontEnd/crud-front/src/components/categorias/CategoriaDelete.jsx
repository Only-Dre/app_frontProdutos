import { useEffect, useState } from "react";
import { deleteCategoria, getCategoriaById } from "../../api/categoriaService";
import { useNavigate, useParams } from "react-router-dom";

export default function CategoriaDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    getCategoriaById(id).then(setCategoria);
  }, [id]);

  async function handleDelete() {
    await deleteCategoria(id);
    navigate("/categorias");
  }

  if (!categoria) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Excluir Categoria</h2>
      <p>Tem certeza que deseja excluir?</p>

      <strong>{categoria.nome}</strong>

      <br /><br />

      <button onClick={handleDelete}>Sim, excluir</button>
      <button onClick={() => navigate("/categorias")}>Cancelar</button>
    </div>
  );
}
