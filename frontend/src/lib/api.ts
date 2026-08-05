import axios from "axios";

import { clearToken, getToken } from "./auth";
import type { Appointment, BlockedDate, Servico, WorkingHours } from "./types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
        window.location.href = "/dashboard/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function listarServicos(somenteAtivos = true): Promise<Servico[]> {
  const { data } = await api.get<Servico[]>("/servicos/");
  return somenteAtivos ? data.filter((s) => s.ativo) : data;
}

export async function buscarDisponibilidade(dataISO: string, servicoId: number): Promise<string[]> {
  const { data } = await api.get<{ horarios: string[] }>("/disponibilidade/", {
    params: { data: dataISO, servico_id: servicoId },
  });
  return data.horarios;
}

export interface NovoAgendamentoPayload {
  cliente_nome: string;
  cliente_telefone: string;
  servico_id: number;
  data: string;
  hora_inicio: string;
}

export async function criarAgendamento(payload: NovoAgendamentoPayload): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/agendamentos/", payload);
  return data;
}

export async function login(username: string, password: string): Promise<string> {
  const { data } = await api.post<{ access: string; refresh: string }>("/auth/login/", {
    username,
    password,
  });
  return data.access;
}

export async function listarAgendamentos(params?: {
  status?: string;
  data?: string;
}): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/agendamentos/", { params });
  return data;
}

export async function atualizarStatusAgendamento(
  id: number,
  status: Appointment["status"]
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(`/agendamentos/${id}/`, { status });
  return data;
}

export async function criarServico(payload: Partial<Servico>): Promise<Servico> {
  const { data } = await api.post<Servico>("/servicos/", payload);
  return data;
}

export async function atualizarServico(id: number, payload: Partial<Servico>): Promise<Servico> {
  const { data } = await api.patch<Servico>(`/servicos/${id}/`, payload);
  return data;
}

export async function excluirServico(id: number): Promise<void> {
  await api.delete(`/servicos/${id}/`);
}

export async function listarHorarios(): Promise<WorkingHours[]> {
  const { data } = await api.get<WorkingHours[]>("/horarios-funcionamento/");
  return data;
}

export async function atualizarHorario(
  id: number,
  payload: Partial<WorkingHours>
): Promise<WorkingHours> {
  const { data } = await api.patch<WorkingHours>(`/horarios-funcionamento/${id}/`, payload);
  return data;
}

export async function listarBloqueios(): Promise<BlockedDate[]> {
  const { data } = await api.get<BlockedDate[]>("/bloqueios/");
  return data;
}

export async function criarBloqueio(payload: Partial<BlockedDate>): Promise<BlockedDate> {
  const { data } = await api.post<BlockedDate>("/bloqueios/", payload);
  return data;
}

export async function excluirBloqueio(id: number): Promise<void> {
  await api.delete(`/bloqueios/${id}/`);
}
