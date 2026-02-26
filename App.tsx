
import React, { useState, useEffect } from 'react';
import { UserProfile, ItemEstoque, Solicitacao, SolicitacaoStatus, ItemSolicitado, User } from './types';
import { INITIAL_ESTOQUE, INITIAL_SOLICITACOES } from './constants';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import NovaSolicitacao from './pages/NovaSolicitacao';
import MinhasSolicitacoes from './pages/MinhasSolicitacoes';
import GerenciarSolicitacoes from './pages/GerenciarSolicitacoes';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'SELECT' | 'LOGIN' | 'SIGNUP'>('SELECT');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // App State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetchEstoque = async () => {
    try {
      const res = await fetch('/api/estoque');
      if (!res.ok) throw new Error(`Erro ao buscar estoque (${res.status})`);
      const data = await res.json();
      setEstoque(data);
    } catch (err) {
      console.error("Erro ao buscar estoque:", err);
    }
  };

  const fetchSolicitacoes = async () => {
    try {
      const res = await fetch('/api/solicitacoes');
      if (!res.ok) throw new Error(`Erro ao buscar solicitações (${res.status})`);
      const data = await res.json();
      setSolicitacoes(data);
    } catch (err) {
      console.error("Erro ao buscar solicitações:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEstoque();
      fetchSolicitacoes();
    }
  }, [isAuthenticated]);

  // Handlers
  const handleProfileSelect = (p: UserProfile) => {
    setSelectedProfile(p);
    setAuthMode('LOGIN');
    setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !selectedProfile) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, profile: selectedProfile })
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
        setCurrentUser(data);
        setIsAuthenticated(true);
      } else {
        const text = await res.text();
        throw new Error(`Servidor retornou ${res.status} (${contentType}). Verifique se o backend está rodando. Resumo: ${text.substring(0, 50)}...`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, profile: selectedProfile })
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'E-mail ou senha incorretos.');
        setCurrentUser(data);
        setIsAuthenticated(true);
      } else {
        const text = await res.text();
        throw new Error(`Servidor retornou ${res.status} (${contentType}). Resumo: ${text.substring(0, 50)}...`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthMode('SELECT');
    setEmail('');
    setPassword('');
  };

  // RF03: Gerenciar Estoque
  const handleSaveEstoqueItem = async (item: ItemEstoque) => {
    try {
      const res = await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        fetchEstoque();
      }
    } catch (err) {
      console.error("Erro ao salvar item:", err);
    }
  };

  const handleDeleteEstoqueItem = async (id: string) => {
    try {
      const res = await fetch(`/api/estoque/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEstoque();
      }
    } catch (err) {
      console.error("Erro ao deletar item:", err);
    }
  };

  // RF01: Criar Solicitação
  const handleCreateSolicitacao = async (itens: ItemSolicitado[]) => {
    try {
      const res = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitanteNome: currentUser?.email || 'Usuário',
          itens
        })
      });
      if (res.ok) {
        await fetchSolicitacoes();
        setActiveTab('minhas-solicitacoes');
      }
    } catch (err) {
      console.error("Erro ao criar solicitação:", err);
    }
  };

  // RF02 & RF04: Gerenciar Solicitação
  const handleUpdateSolicitacaoStatus = async (id: string, newStatus: SolicitacaoStatus) => {
    try {
      const res = await fetch(`/api/solicitacoes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchSolicitacoes();
        await fetchEstoque(); // Update inventory levels if request was completed
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-8 border-[#1e3a8a] transition-all">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1e3a8a] mb-2">Almoxarifado Digital</h1>
            <p className="text-gray-500 text-sm">Gestão de Materiais Escolares</p>
          </div>
          
          {authMode === 'SELECT' && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700 mb-4">Como deseja acessar hoje?</p>
              <button 
                onClick={() => handleProfileSelect(UserProfile.SOLICITANTE)}
                className="w-full py-4 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-800 hover:text-blue-800 transition-all font-medium flex justify-between items-center group"
              >
                <span>Professor / Administrativo</span>
                <span className="text-xl group-hover:scale-125 transition-transform">👤</span>
              </button>
              <button 
                onClick={() => handleProfileSelect(UserProfile.ALMOXARIFADO)}
                className="w-full py-4 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-800 hover:text-blue-800 transition-all font-medium flex justify-between items-center group"
              >
                <span>Funcionário Almoxarifado</span>
                <span className="text-xl group-hover:scale-125 transition-transform">🛠️</span>
              </button>
            </div>
          )}

          {(authMode === 'LOGIN' || authMode === 'SIGNUP') && (
            <form onSubmit={authMode === 'LOGIN' ? handleLogin : handleSignup} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('SELECT')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >←</button>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-800 bg-blue-50 px-2 py-1 rounded">
                  {selectedProfile}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {authMode === 'LOGIN' ? 'Acesse sua conta' : 'Crie seu cadastro'}
              </h2>

              {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{error}</div>}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail (Gmail)</label>
                <input 
                  type="email" 
                  required
                  placeholder="seuemail@gmail.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processando...' : (authMode === 'LOGIN' ? 'Entrar no Sistema' : 'Finalizar cadastro e entrar')}
              </button>

              <div className="text-center pt-2">
                {authMode === 'LOGIN' ? (
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('SIGNUP'); setError(''); }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Não tem conta? Cadastre-se
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('LOGIN'); setError(''); }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Já tem uma conta? Faça Login
                  </button>
                )}
              </div>
            </form>
          )}
          
          <div className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            Almoxarifado Escolar © 2024
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const profile = currentUser?.profile || UserProfile.SOLICITANTE;
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard estoque={estoque} solicitacoes={solicitacoes} profile={profile} />;
      case 'estoque':
        return <Estoque items={estoque} onSave={handleSaveEstoqueItem} onDelete={handleDeleteEstoqueItem} />;
      case 'nova-solicitacao':
        return <NovaSolicitacao estoque={estoque} onCreate={handleCreateSolicitacao} />;
      case 'minhas-solicitacoes':
        return <MinhasSolicitacoes solicitacoes={solicitacoes} />;
      case 'gerenciar-solicitacoes':
        return <GerenciarSolicitacoes solicitacoes={solicitacoes} onUpdateStatus={handleUpdateSolicitacaoStatus} />;
      default:
        return <Dashboard estoque={estoque} solicitacoes={solicitacoes} profile={profile} />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar 
        currentProfile={currentUser?.profile || UserProfile.SOLICITANTE} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      <main className="flex-1 h-screen overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-800">{currentUser?.email}</p>
                <p className="text-[10px] text-blue-600 uppercase font-bold">{currentUser?.profile}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                {currentUser?.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
