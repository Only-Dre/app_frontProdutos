import React, { useState, useEffect } from "react";
import "./Lista.css";
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:4567/produtos";

export default function Lista({ products, setProducts }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newEstoque, setNewEstoque] = useState(0); 
  
  const navigate = useNavigate();

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      console.log("Produtos carregados com sucesso!");
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos. Verifique a conexão com a API.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [setProducts]);

  const handleSave = async (productToUpdate) => {
    setError(null);

    const updatedProductData = {
      id: productToUpdate.id,
      nome: newName,
      preco: parseFloat(newPrice),
      estoque: parseInt(newEstoque),
      categoria: productToUpdate.categoria, 
    };

    try {
      const response = await fetch(`${API_BASE_URL}/${productToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) {
        throw new Error(`Falha ao salvar. Status: ${response.status}`);
      }

      setProducts(
        products.map((p) =>
          p.id === productToUpdate.id ? updatedProductData : p
        )
      );
      setEditingId(null);
      console.log(`Produto ${productToUpdate.id} atualizado com sucesso.`);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError("Falha ao salvar as alterações do produto.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setNewName(product.nome);
    // Garante que o preço seja formatado corretamente para o input
    setNewPrice(product.preco !== undefined ? product.preco : 0); 
    setNewEstoque(product.estoque !== undefined ? product.estoque : 0); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`Falha ao deletar. Status: ${response.status}`);
      }

      setProducts(products.filter((p) => p.id !== id));
      console.log(`Produto ${id} deletado com sucesso.`);
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      setError("Falha ao deletar o produto.");
    }
  };

  const renderHeader = (title) => (
    <div className="header-nav">
      <h2 className="title">{title}</h2>
      <button 
        className="btn btn-voltar" 
        onClick={() => navigate('/')}
      >
        Voltar para Home
      </button>
    </div>
  );

  // 4. Renderização
  if (loading) {
    return (
      <div className="lista-container">
        {renderHeader("Lista de Produtos")}
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-container">
        {renderHeader("Lista de Produtos")}
        <p className="error-message">{error}</p>
        <button
          className="btn btn-edit"
          onClick={loadProducts}
          style={{ marginTop: "10px" }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="lista-container">
      {renderHeader("Lista de Produtos")}
      {products.length === 0 ? (
        <p className="empty-state">Nenhum produto cadastrado.</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              {editingId === product.id ? (
                <div className="edit-mode">
                  <input
                    className="input-field"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome"
                  />
                  <input
                    className="input-field"
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Preço"
                  />
                  <input
                    className="input-field"
                    type="number"
                    value={newEstoque}
                    onChange={(e) => setNewEstoque(e.target.value)}
                    placeholder="Estoque"
                  />
                  <div className="actions">
                    <button
                      className="btn btn-save"
                      onClick={() => handleSave(product)}
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
                <div className="view-mode">
                  <span className="product-info">
                    <span className="product-name">{product.nome}</span>
                    <span className="product-details">
                      Preço: R${" "}
                      {product.preco
                        ? product.preco.toFixed(2).replace(".", ",")
                        : "N/A"}
                      {" "} | Estoque: {product.estoque} | Categoria: 
                      {product.categoria
                        ? product.categoria.nome
                        : "Sem Categoria"}
                      
                    </span>
                  </span>
                  <div className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(product.id)}
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
  );
}