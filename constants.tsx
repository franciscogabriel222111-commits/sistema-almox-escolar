
import { ItemEstoque, Solicitacao, SolicitacaoStatus } from './types';

export const INITIAL_ESTOQUE: ItemEstoque[] = [
  { id: '1', descricao: 'Papel A4 Branco', unidadeMedida: 'Resma', quantidadeAtual: 50, quantidadeMinima: 10, localizacao: 'Armário A1' },
  { id: '2', descricao: 'Caneta Esferográfica Azul', unidadeMedida: 'Caixa 50un', quantidadeAtual: 15, quantidadeMinima: 5, localizacao: 'Gaveta B2' },
  { id: '3', descricao: 'Toner HP LaserJet 1020', unidadeMedida: 'Unidade', quantidadeAtual: 3, quantidadeMinima: 2, localizacao: 'Prateleira C1' },
  { id: '4', descricao: 'Clips N. 2/0', unidadeMedida: 'Caixa 100un', quantidadeAtual: 100, quantidadeMinima: 20, localizacao: 'Armário A2' },
  { id: '5', descricao: 'Borracha Branca', unidadeMedida: 'Unidade', quantidadeAtual: 2, quantidadeMinima: 10, localizacao: 'Gaveta B3' }, // Abaixo do mínimo
];

export const INITIAL_SOLICITACOES: Solicitacao[] = [];

export const COLORS = {
  primary: '#1e3a8a', // Institutional Blue
  secondary: '#64748b', // Neutral Slate
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b'
};
