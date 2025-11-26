import "./CadastroProduto.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importado para navegação

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [opcoes, setOpcoes] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Feedback
  
  const navigate = useNavigate(); // Inicializado

  async function carregarCategorias() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4567/categorias");
      const data = await response.json();
      setOpcoes(data);
    } catch (error) {
      console.error("Erro ao buscar as categorias:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  const adicionaProduto = async () => {
    setMessage(null);

    if (!nome.trim() || !preco || !estoque) {
        setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios.' });
        return;
    }

    const produtoData = {
        nome: nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        // Envia apenas o ID da categoria, ou null se não for selecionado
        categoria: categoriaId ? { id: parseInt(categoriaId) } : null,
    };

    try {
      const response = await fetch("http://localhost:4567/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoData),
      });

      if (!response.ok) {
        throw new Error(`Falha no cadastro. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Produto criado com Sucesso!", data);
      
      setMessage({ type: 'success', text: `Produto "${data.nome}" cadastrado com sucesso!` });
      
      // Limpa os campos
      setNome("");
      setPreco("");
      setEstoque("");
      setCategoriaId("");

    } catch (error) {
      console.error("Erro ao criar o Produto:", error);
      setMessage({ type: 'error', text: 'Erro ao conectar ou cadastrar o produto.' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionaProduto();
  };

  return (
    <div className="cadastro-container">
      <div className="header-nav">
        <h2>Cadastrar Produto</h2>
        <button 
          className="btn btn-voltar" 
          onClick={() => navigate('/')}
        >
          Voltar para Home
        </button>
      </div>
      
      {/* Exibe a mensagem de feedback */}
      {message && (
          <div className={`message-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            placeholder="Digite o nome do produto: (Ex: Notebook)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="preco">
            Preço:
          </label>
          <input
            type="number"
            id="preco"
            placeholder="Digite o preço do produto: (Ex: 1599.99)"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="estoque">
            Estoque:
          </label>
          <input
            type="number"
            id="estoque"
            placeholder="Digite o estoque do produto: (Ex: 100)"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          {loading ? (
            <p>Carregando categorias...</p>
          ) : (
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {opcoes.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        <button type="submit" className="btn-submit">Salvar Produto</button>
      </form>
    </div>
  );
}