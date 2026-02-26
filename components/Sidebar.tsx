
import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentProfile: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentProfile, activeTab, setActiveTab, onLogout }) => {
  const isAlmoxarifado = currentProfile === UserProfile.ALMOXARIFADO;
  const isSolicitante = currentProfile === UserProfile.SOLICITANTE;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', show: true },
    { id: 'estoque', label: 'Estoque', icon: '📦', show: isAlmoxarifado },
    { id: 'nova-solicitacao', label: 'Nova Solicitação', icon: '➕', show: isSolicitante },
    { id: 'minhas-solicitacoes', label: 'Minhas Solicitações', icon: '📋', show: isSolicitante },
    { id: 'gerenciar-solicitacoes', label: 'Gerenciar Pedidos', icon: '⚙️', show: isAlmoxarifado },
  ];

  return (
    <div className="w-64 h-screen bg-[#1e3a8a] text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-blue-900">
        <h1 className="text-xl font-bold">ALMOXARIFADO</h1>
        <p className="text-xs text-blue-300 mt-1 uppercase tracking-widest">{currentProfile}</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.filter(item => item.show).map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-800 border-l-4 border-white' 
                : 'hover:bg-blue-800/50 border-l-4 border-transparent'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-900">
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium hover:bg-red-900/40 text-red-100 transition-colors rounded"
        >
          <span className="mr-3">🚪</span> Sair do Sistema
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
