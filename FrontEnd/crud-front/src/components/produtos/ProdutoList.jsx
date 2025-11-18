import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProdutos } from "../../api/produtoService";

export default function ProdutoList() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    getProdutos().then(setProdutos).catch(err => console.error(err));
  }, []);

  return (
    <div className="page">
      <h2>Produtos</h2>
      <div className="actions">
        <Link to="/produtos/novo" className="btn">Adicionar Produto</Link>
      </div>

      <ul className="list">
        {produtos.map((p) => (
          <li key={p.id} className="list-item">
            <div>
              <strong>{p.nome}</strong>
              <div className="muted">R$ {p.preco}</div>
            </div>

            <div className="item-actions">
              <Link to={`/produtos/editar/${p.id}`} className="link">Editar</Link>
              <Link to={`/produtos/excluir/${p.id}`} className="link danger">Excluir</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
