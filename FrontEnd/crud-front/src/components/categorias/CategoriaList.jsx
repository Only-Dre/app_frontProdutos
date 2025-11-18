import { useEffect, useState } from "react";
import { getCategorias } from "../../api/categoriaService";

export default function CategoriaList() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  return (
    <div>
      <h2>Categorias</h2>
      <a href="/categorias/novo">Adicionar Categoria</a>

      <ul>
        {categorias.map((c) => (
          <li key={c.id}>
            {c.nome}
            {"  "}
            <a href={`/categorias/editar/${c.id}`}>Editar</a>
            {" | "}
            <a href={`/categorias/excluir/${c.id}`}>Excluir</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
