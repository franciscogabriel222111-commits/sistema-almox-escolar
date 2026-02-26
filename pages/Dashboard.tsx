
import React from 'react';
import { ItemEstoque, Solicitacao, UserProfile, SolicitacaoStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  estoque: ItemEstoque[];
  solicitacoes: Solicitacao[];
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ estoque, solicitacoes, profile }) => {
  const totalItens = estoque.length;
  const itensAbaixoMinimo = estoque.filter(i => i.quantidadeAtual <= i.quantidadeMinima).length;
  const solicitacoesPendentes = solicitacoes.filter(s => s.status === SolicitacaoStatus.PENDENTE).length;
  const totalSolicitacoesMes = solicitacoes.length;

  const chartData = estoque.slice(0, 8).map(item => ({
    name: item.descricao.length > 15 ? item.descricao.substring(0, 12) + '...' : item.descricao,
    qtd: item.quantidadeAtual,
    min: item.quantidadeMinima
  }));

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>
        <p className="text-gray-500">Bem-vindo ao painel de controle do almoxarifado.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total em Estoque" value={totalItens} icon="📦" color="bg-blue-500" />
        <StatCard title="Itens Críticos (Reposição)" value={itensAbaixoMinimo} icon="⚠️" color="bg-orange-500" />
        <StatCard title="Pedidos Pendentes" value={solicitacoesPendentes} icon="⏳" color="bg-yellow-500" />
        <StatCard title="Total Pedidos" value={totalSolicitacoesMes} icon="📄" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Níveis de Estoque (Principais Itens)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qtd" fill="#1e3a8a">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.qtd <= entry.min ? '#ef4444' : '#1e3a8a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Items Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-700">Itens com Estoque Baixo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Unidade</th>
                  <th className="pb-3 font-medium">Qtd Atual</th>
                  <th className="pb-3 font-medium text-right">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {estoque.filter(i => i.quantidadeAtual <= i.quantidadeMinima).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">Nenhum item em nível crítico.</td>
                  </tr>
                ) : (
                  estoque.filter(i => i.quantidadeAtual <= i.quantidadeMinima).map(item => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-800">{item.descricao}</td>
                      <td className="py-4 text-gray-500 text-sm">{item.unidadeMedida}</td>
                      <td className="py-4 font-bold text-red-600">{item.quantidadeAtual}</td>
                      <td className="py-4 text-right text-gray-500">{item.quantidadeMinima}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl shadow-inner`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
