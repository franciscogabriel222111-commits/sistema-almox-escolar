
import React, { useState } from 'react';
import { ItemEstoque, ItemSolicitado } from '../types';

interface NovaSolicitacaoProps {
  estoque: ItemEstoque[];
  onCreate: (itens: ItemSolicitado[]) => void;
}

const NovaSolicitacao: React.FC<NovaSolicitacaoProps> = ({ estoque, onCreate }) => {
  const [selectedItems, setSelectedItems] = useState<ItemSolicitado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEstoque = estoque.filter(item => 
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (item: ItemEstoque) => {
    if (selectedItems.find(i => i.itemId === item.id)) return;
    setSelectedItems([...selectedItems, { itemId: item.id, descricao: item.descricao, quantidadeSolicitada: 1 }]);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.itemId !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setSelectedItems(selectedItems.map(i => i.itemId === id ? { ...i, quantidadeSolicitada: Math.max(1, qty) } : i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert('Selecione pelo menos um item.');
    onCreate(selectedItems);
  };

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Nova Solicitação</h2>
        <p className="text-gray-500">Selecione os materiais que você necessita.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selection Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Procurar Materiais</h3>
          <div className="relative mb-6">
            <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar itens em estoque..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredEstoque.map(item => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 border border-gray-50 rounded-lg hover:bg-gray-50 cursor-pointer group transition-all"
                onClick={() => addItem(item)}
              >
                <div>
                  <div className="font-medium text-gray-800">{item.descricao}</div>
                  <div className="text-xs text-gray-400">Disponível: {item.quantidadeAtual} {item.unidadeMedida}</div>
                </div>
                <button className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Area */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-800 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
            Seus Pedidos
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{selectedItems.length} itens</span>
          </h3>
          
          {selectedItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-4xl mb-4">🛒</span>
              <p>Nenhum item selecionado</p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 mb-6">
                {selectedItems.map(item => (
                  <div key={item.itemId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 font-medium">{item.descricao}</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="1"
                        className="w-16 border rounded px-2 py-1 text-center"
                        value={item.quantidadeSolicitada}
                        onChange={e => updateQuantity(item.itemId, parseInt(e.target.value))}
                      />
                      <button 
                        onClick={() => removeItem(item.itemId)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition-all shadow-lg active:scale-95"
              >
                Confirmar Solicitação
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovaSolicitacao;
