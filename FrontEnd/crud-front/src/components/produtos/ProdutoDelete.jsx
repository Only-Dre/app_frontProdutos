import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProduto, getProdutoById } from "../../api/produtoService";

export default function ProdutoDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    getProdutoById(id).then(setProduto).catch(err => console.error(err));
  }, [id]);

  async function handleDelete() {
    try {
      await deleteProduto(id);
      navigate("/produtos");
    } catch (err) {
      console.error(err);
    }
  }

  if (!produto) return <p>Carregando...</p>;

  return (
    <div className="page">
      <h2>Excluir Produto</h2>
      <p>Tem certeza que deseja excluir:</p>
      <strong>{produto.nome}</strong>
      <div className="actions">
        <button onClick={handleDelete} className="btn danger">Excluir</button>
        <button onClick={() => navigate("/produtos")} className="btn">Cancelar</button>
      </div>
    </div>
  );
}
