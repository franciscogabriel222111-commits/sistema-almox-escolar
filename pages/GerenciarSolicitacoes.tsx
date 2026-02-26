
import React from 'react';
import { Solicitacao, SolicitacaoStatus } from '../types';
import { StatusBadge } from './MinhasSolicitacoes';

interface GerenciarProps {
  solicitacoes: Solicitacao[];
  onUpdateStatus: (id: string, status: SolicitacaoStatus) => void;
}

const GerenciarSolicitacoes: React.FC<GerenciarProps> = ({ solicitacoes, onUpdateStatus }) => {
  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gerenciar Pedidos</h2>
        <p className="text-gray-500">Analise e processe as solicitações de materiais pendentes.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Pedido</th>
              <th className="px-6 py-4 font-medium">Solicitante</th>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Materiais</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {solicitacoes.map(sol => (
              <tr key={sol.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-800">{sol.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{sol.solicitanteNome}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sol.dataSolicitacao}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={sol.status} />
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  <div className="max-w-[200px] truncate">
                    {sol.itens.map(i => `${i.quantidadeSolicitada}x ${i.descricao}`).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {sol.status === SolicitacaoStatus.PENDENTE && (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(sol.id, SolicitacaoStatus.APROVADA)}
                          className="p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                          title="Aprovar"
                        >
                          ✅
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(sol.id, SolicitacaoStatus.REJEITADA)}
                          className="p-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                          title="Rejeitar"
                        >
                          ❌
                        </button>
                      </>
                    )}
                    {sol.status === SolicitacaoStatus.APROVADA && (
                      <button 
                        onClick={() => onUpdateStatus(sol.id, SolicitacaoStatus.CONCLUIDA)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                      >
                        ENTREGAR / BAIXAR
                      </button>
                    )}
                    {(sol.status === SolicitacaoStatus.CONCLUIDA || sol.status === SolicitacaoStatus.REJEITADA) && (
                      <span className="text-xs text-gray-400 italic">Finalizado em {sol.dataConclusao || sol.dataSolicitacao}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {solicitacoes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-gray-400 italic">
                  Nenhuma solicitação encontrada no sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GerenciarSolicitacoes;
