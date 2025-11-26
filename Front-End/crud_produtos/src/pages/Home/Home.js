import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="home-title">
                   Sistema de Gestão de Estoque
                </h1>
                <p className="home-subtitle">Seu painel de controle centralizado para produtos e categorias.</p>
            </header>

            <main className="main-content">
                <h2>O que você gostaria de fazer hoje?</h2>
                
                <div className="card-grid">
                    
                    <div 
                        className="action-card card-register" 
                        onClick={() => navigate('/produto')}
                    >
                        <h3>Cadastrar Produto</h3>
                        <p>Adicione novos itens ao seu inventário rapidamente.</p>
                        <button className="btn-go">Ir para Cadastro</button>
                    </div>

                    <div 
                        className="action-card card-list" 
                        onClick={() => navigate('/lista')}
                    >
                        <h3>Visualizar Estoque</h3>
                        <p>Gerencie, edite ou exclua produtos existentes.</p>
                        <button className="btn-go">Ver Lista Completa</button>
                    </div>

                    <div 
                        className="action-card card-category" 
                        onClick={() => navigate('/categoria')}
                    >
                        <h3>Gerenciar Categorias</h3>
                        <p>Organize seus produtos em categorias específicas.</p>
                        <button className="btn-go">Gerenciar</button>
                    </div>
                </div>
            </main>

        </div>
    );
}