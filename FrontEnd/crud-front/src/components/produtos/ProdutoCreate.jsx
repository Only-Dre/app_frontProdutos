import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduto } from "../../api/produtoService";

export default function ProdutoCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", preco: "", estoque: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createProduto(form);
      navigate("/produtos");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>Cadastrar Produto</h2>
      {error && <div className="error">{error}</div>}
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
