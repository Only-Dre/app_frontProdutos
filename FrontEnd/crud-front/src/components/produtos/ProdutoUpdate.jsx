import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProdutoById, updateProduto } from "../../api/produtoService";

export default function ProdutoUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", preco: "", estoque: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProdutoById(id).then(data => {
      if (data) setForm(data);
    }).catch(err => console.error(err));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduto(id, form);
      navigate("/produtos");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>Editar Produto</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Nome
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </label>

        <label>Preço
          <input name="preco" value={form.preco} onChange={handleChange} required />
        </label>

        <label>Estoque
          <input name="estoque" value={form.estoque} onChange={handleChange} required />
        </label>

        <button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
      </form>
    </div>
  );
}
