import { useState, useEffect } from "react";
import "./CadastroCategoria.css";
import { useNavigate } from 'react-router-dom'; // Importado para navegação

// O nome do componente é mantido como CadastroCategoria
export default function CadastroCategoria() {
  const [nome, setNome] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const API_BASE_URL = "http://localhost:4567/categorias";
  const navigate = useNavigate(); // Inicializado

  // --- Funções de Leitura (READ) ---
  async function loadCategorias() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      setMessage({ type: 'error', text: 'Erro ao carregar categorias. Verifique a API.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategorias();
  }, []);

  // --- Funções de Criação (CREATE) ---
  const adicionaCategoria = async () => {
    setMessage(null);
    if (!nome.trim()) {
      setMessage({ type: 'error', text: 'O nome da categoria não pode ser vazio.' });
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome }),
      });

      if (!response.ok) {
        throw new Error(`Falha no cadastro. Status: ${response.status}`);
      }

      const newCategory = await response.json();
      setMessage({ type: 'success', text: `Categoria "${newCategory.nome}" cadastrada com sucesso!` });
      setNome("");
      loadCategorias(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao criar a Categoria:", error);
      setMessage({ type: 'error', text: 'Erro ao cadastrar a categoria.' });
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    adicionaCategoria();
  };

  // --- Funções de Edição (UPDATE) ---
  const handleEdit = (category) => {
    setEditingId(category.id);
    setNewName(category.nome);
  };

  const handleSave = async (idToUpdate) => {
    setMessage(null);
    if (!newName.trim()) {
        setMessage({ type: 'error', text: 'O nome não pode ser vazio.' });
        return;
    }
    
    const updatedCategoryData = {
        id: idToUpdate,
        nome: newName,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${idToUpdate}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCategoryData),
        });

        if (!response.ok) {
            throw new Error(`Falha ao salvar. Status: ${response.status}`);
        }

        setCategorias(
            categorias.map((c) =>
                c.id === idToUpdate ? updatedCategoryData : c
            )
        );
        setEditingId(null);
        setMessage({ type: 'success', text: 'Categoria atualizada com sucesso.' });
    } catch (err) {
        console.error("Erro ao salvar categoria:", err);
        setMessage({ type: 'error', text: 'Falha ao salvar as alterações.' });
    }
  };

  // --- Funções de Exclusão (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("ATENÇÃO! Deletar uma categoria pode afetar produtos vinculados. Tem certeza que deseja deletar?")) {
      return;
    }

    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.status !== 204) {
        throw new Error(`Falha ao deletar. Status: ${response.status}`);
      }

      setCategorias(categorias.filter((c) => c.id !== id));
      setMessage({ type: 'success', text: 'Categoria deletada com sucesso.' });
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
      setMessage({ type: 'error', text: 'Falha ao deletar a categoria.' });
    }
  };


  // --- Renderização ---
  return (
    <div className="cadastro-categoria-container">
      <div className="header-nav">
        <h2>Cadastro e Gerenciamento de Categorias</h2>
        <button 
          className="btn btn-voltar" 
          onClick={() => navigate('/')}
        >
          Voltar para Home
        </button>
      </div>
      
      {message && (
          <div className={`message-${message.type}`}>{message.text}</div>
      )}

      <div className="cadastro-form-area">
        <h3>Cadastrar Nova Categoria</h3>
        <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
                <label htmlFor="nome">
                    Nome da Categoria:
                </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Ex: Eletrônico"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>
            <button type="submit" className="btn-submit">Cadastrar</button>
        </form>
      </div>

      <div className="listagem-area">
        <h3>Categorias Existentes</h3>
        {loading ? (
            <p className="loading-text">Carregando categorias...</p>
        ) : categorias.length === 0 ? (
            <p className="empty-state">Nenhuma categoria cadastrada.</p>
        ) : (
            <ul className="category-list">
                {categorias.map((category) => (
                    <li key={category.id} className="category-item">
                        {editingId === category.id ? (
                            // Modo de Edição
                            <div className="edit-mode">
                                <input
                                    className="input-field"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <div className="actions">
                                    <button
                                        className="btn btn-save"
                                        onClick={() => handleSave(category.id)}
                                    >
                                        Salvar
                                    </button>
                                    <button
                                        className="btn btn-cancel"
                                        onClick={() => setEditingId(null)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Modo de Visualização
                            <div className="view-mode">
                                <span className="category-name">{category.nome}</span>
                                <div className="actions">
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-delete"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
}