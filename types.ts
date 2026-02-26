
export enum UserProfile {
  SOLICITANTE = 'Solicitante',
  ALMOXARIFADO = 'Funcionário Almoxarifado',
  SUPERVISOR = 'Supervisor'
}

export enum SolicitacaoStatus {
  PENDENTE = 'Pendente',
  APROVADA = 'Aprovada',
  REJEITADA = 'Rejeitada',
  CONCLUIDA = 'Concluída'
}

export interface User {
  email: string;
  password: string;
  profile: UserProfile;
}

export interface ItemEstoque {
  id: string;
  descricao: string;
  unidadeMedida: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  localizacao: string;
}

export interface ItemSolicitado {
  itemId: string;
  descricao: string;
  quantidadeSolicitada: number;
}

export interface Solicitacao {
  id: string;
  solicitanteNome: string;
  dataSolicitacao: string;
  dataConclusao?: string;
  status: SolicitacaoStatus;
  itens: ItemSolicitado[];
}
