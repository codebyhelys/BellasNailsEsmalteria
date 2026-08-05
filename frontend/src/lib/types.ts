export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao_minutos: number;
  preco: string;
  ativo: boolean;
  ordem: number;
}

export type AppointmentStatus = "pendente" | "confirmado" | "cancelado";

export interface Appointment {
  id: number;
  cliente_nome: string;
  cliente_telefone: string;
  servico: number;
  servico_nome: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: AppointmentStatus;
  criado_em: string;
}

export interface WorkingHours {
  id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

export interface BlockedDate {
  id: number;
  data: string;
  motivo: string;
}
