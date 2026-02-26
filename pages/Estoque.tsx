
import React, { useState } from 'react';
import { ItemEstoque } from '../types';

interface EstoqueProps {
  items: ItemEstoque[];
  onSave: (item: ItemEstoque) => void;
  onDelete: (id: string) => void;
}

const Estoque: React.FC<EstoqueProps> = ({ items, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemEstoque | null>(null);

  const openAddModal = () => {
    setEditingItem({
      id: Math.random().toString(36).substr(2, 9),
      descricao: '',
      unidadeMedida: '',
      quantidadeAtual: 0,
      quantidadeMinima: 0,
      localizacao: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ItemEstoque) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onSave(editingItem);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Controle de Estoque</h2>
          <p className="text-gray-500">Gerencie os materiais disponíveis na unidade escolar.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors flex items-center shadow-lg"
        >
          <span className="mr-2 text-xl">+</span> Novo Item
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Descrição</th>
              <th className="px-6 py-4 font-medium">Localização</th>
              <th className="px-6 py-4 font-medium">Estoque Atual</th>
              <th className="px-6 py-4 font-medium">Mínimo</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800">{item.descricao}</div>
                  <div className="text-xs text-gray-400">{item.unidadeMedida}</div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{item.localizacao}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.quantidadeAtual <= item.quantidadeMinima 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                  }`}>
                    {item.quantidadeAtual} {item.unidadeMedida}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{item.quantidadeMinima}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 mx-2 text-sm font-medium">Editar</button>
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 mx-2 text-sm font-medium">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              {editingItem.id ? 'Editar Item' : 'Novo Item de Estoque'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Material</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingItem.descricao}
                  onChange={e => setEditingItem({...editingItem, descricao: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                  <input 
                    type="text" required placeholder="Ex: Unidade, Caixa, Resma"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingItem.unidadeMedida}
                    onChange={e => setEditingItem({...editingItem, unidadeMedida: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <input 
                    type="text" placeholder="Ex: Corredor B, Prateleira 2"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingItem.localizacao}
                    onChange={e => setEditingItem({...editingItem, localizacao: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd em Estoque</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingItem.quantidadeAtual}
                    onChange={e => setEditingItem({...editingItem, quantidadeAtual: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd Mínima (Alerta)</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingItem.quantidadeMinima}
                    onChange={e => setEditingItem({...editingItem, quantidadeMinima: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-800 text-white font-medium hover:bg-blue-900 rounded-lg transition-colors shadow-md"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;
