
import React from 'react';
import { Solicitacao, SolicitacaoStatus } from '../types';

interface MinhasSolicitacoesProps {
  solicitacoes: Solicitacao[];
}

const MinhasSolicitacoes: React.FC<MinhasSolicitacoesProps> = ({ solicitacoes }) => {
  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Minhas Solicitações</h2>
        <p className="text-gray-500">Acompanhe o status dos seus pedidos de material.</p>
      </header>

      <div className="space-y-4">
        {solicitacoes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300 text-gray-400">
            Você ainda não realizou nenhuma solicitação.
          </div>
        ) : (
          solicitacoes.map(sol => (
            <div key={sol.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-shrink-0 bg-blue-50 p-4 rounded-lg text-blue-800 font-bold">
                {sol.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-gray-400">{sol.dataSolicitacao}</span>
                  <StatusBadge status={sol.status} />
                </div>
                <div className="font-semibold text-gray-800">
                  {sol.itens.map(i => `${i.quantidadeSolicitada}x ${i.descricao}`).join(', ')}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <button className="text-blue-600 hover:underline text-sm font-medium">Ver Detalhes</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: SolicitacaoStatus }> = ({ status }) => {
  const styles = {
    [SolicitacaoStatus.PENDENTE]: 'bg-yellow-100 text-yellow-800',
    [SolicitacaoStatus.APROVADA]: 'bg-blue-100 text-blue-800',
    [SolicitacaoStatus.REJEITADA]: 'bg-red-100 text-red-800',
    [SolicitacaoStatus.CONCLUIDA]: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
};

export default MinhasSolicitacoes;
