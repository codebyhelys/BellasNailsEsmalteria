"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Phone, X } from "lucide-react";

import { atualizarStatusAgendamento, listarAgendamentos } from "@/lib/api";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { linkWhatsappCliente } from "@/lib/whatsapp";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  pendente: "bg-gold-300/50 text-gold-600",
  confirmado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-600",
};

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Appointment[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      const dados = await listarAgendamentos({
        status: filtroStatus || undefined,
        data: filtroData || undefined,
      });
      setAgendamentos(dados);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroStatus, filtroData]);

  async function alterarStatus(id: number, status: AppointmentStatus) {
    setAtualizandoId(id);
    try {
      const atualizado = await atualizarStatusAgendamento(id, status);
      setAgendamentos((atual) => atual.map((a) => (a.id === id ? atualizado : a)));
    } finally {
      setAtualizandoId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Agendamentos</h1>
          <p className="text-sm text-ink-soft">Acompanhe e confirme os pedidos recebidos pelo site.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="input-field !w-auto py-2 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="input-field !w-auto py-2 text-sm"
          />
        </div>
      </div>

      {carregando ? (
        <div className="flex items-center gap-2 py-16 text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin" /> Carregando…
        </div>
      ) : agendamentos.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((ag) => (
            <div
              key={ag.id}
              className="card-elegant flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-ink">{ag.cliente_nome}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[ag.status]}`}>
                    {STATUS_LABEL[ag.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {ag.servico_nome} · {new Date(`${ag.data}T00:00:00`).toLocaleDateString("pt-BR")} às{" "}
                  {ag.hora_inicio.slice(0, 5)}
                </p>
                <a
                  href={linkWhatsappCliente(ag.cliente_telefone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm text-brand-600 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" /> {ag.cliente_telefone}
                </a>
              </div>

              {ag.status === "pendente" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => alterarStatus(ag.id, "confirmado")}
                    disabled={atualizandoId === ag.id}
                    className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" /> Confirmar
                  </button>
                  <button
                    onClick={() => alterarStatus(ag.id, "cancelado")}
                    disabled={atualizandoId === ag.id}
                    className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 disabled:opacity-60"
                  >
                    <X className="h-3.5 w-3.5" /> Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
