"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import {
  atualizarHorario,
  criarBloqueio,
  excluirBloqueio,
  listarBloqueios,
  listarHorarios,
} from "@/lib/api";
import type { BlockedDate, WorkingHours } from "@/lib/types";

const NOMES_DIA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<WorkingHours[]>([]);
  const [bloqueios, setBloqueios] = useState<BlockedDate[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novaData, setNovaData] = useState("");
  const [novoMotivo, setNovoMotivo] = useState("");

  async function carregar() {
    setCarregando(true);
    try {
      const [h, b] = await Promise.all([listarHorarios(), listarBloqueios()]);
      setHorarios(h.sort((a, c) => a.dia_semana - c.dia_semana));
      setBloqueios(b);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvarHorario(h: WorkingHours, mudancas: Partial<WorkingHours>) {
    const atualizado = await atualizarHorario(h.id, mudancas);
    setHorarios((atual) => atual.map((item) => (item.id === h.id ? atualizado : item)));
  }

  async function adicionarBloqueio(e: FormEvent) {
    e.preventDefault();
    if (!novaData) return;
    await criarBloqueio({ data: novaData, motivo: novoMotivo });
    setNovaData("");
    setNovoMotivo("");
    carregar();
  }

  async function removerBloqueio(b: BlockedDate) {
    await excluirBloqueio(b.id);
    carregar();
  }

  if (carregando) {
    return (
      <div className="flex items-center gap-2 py-16 text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin" /> Carregando…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Horário de funcionamento</h1>
        <p className="mb-4 text-sm text-ink-soft">Defina os dias e horários em que a esmalteria atende.</p>

        <div className="space-y-2">
          {horarios.map((h) => (
            <div key={h.id} className="card-elegant flex flex-wrap items-center gap-3 p-4">
              <label className="flex w-40 items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={h.ativo}
                  onChange={(e) => salvarHorario(h, { ativo: e.target.checked })}
                  className="h-4 w-4 accent-brand-500"
                />
                {NOMES_DIA[h.dia_semana]}
              </label>
              <input
                type="time"
                value={h.hora_inicio.slice(0, 5)}
                disabled={!h.ativo}
                onChange={(e) => salvarHorario(h, { hora_inicio: e.target.value })}
                className="input-field !w-auto py-1.5 text-sm disabled:opacity-50"
              />
              <span className="text-ink-soft">até</span>
              <input
                type="time"
                value={h.hora_fim.slice(0, 5)}
                disabled={!h.ativo}
                onChange={(e) => salvarHorario(h, { hora_fim: e.target.value })}
                className="input-field !w-auto py-1.5 text-sm disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-ink">Bloqueios de data</h2>
        <p className="mb-4 text-sm text-ink-soft">Feriados, folgas ou dias sem atendimento.</p>

        <form onSubmit={adicionarBloqueio} className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Data</label>
            <input
              type="date"
              required
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="input-field !w-auto py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Motivo (opcional)</label>
            <input
              type="text"
              value={novoMotivo}
              onChange={(e) => setNovoMotivo(e.target.value)}
              placeholder="Feriado, folga…"
              className="input-field !w-auto py-1.5 text-sm"
            />
          </div>
          <button type="submit" className="btn-primary px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </form>

        <div className="space-y-2">
          {bloqueios.length === 0 && <p className="text-sm text-ink-soft">Nenhum bloqueio cadastrado.</p>}
          {bloqueios.map((b) => (
            <div key={b.id} className="card-elegant flex items-center justify-between p-4">
              <div>
                <span className="font-medium text-ink">
                  {new Date(`${b.data}T00:00:00`).toLocaleDateString("pt-BR")}
                </span>
                {b.motivo && <span className="ml-2 text-sm text-ink-soft">{b.motivo}</span>}
              </div>
              <button onClick={() => removerBloqueio(b)} className="rounded-full p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
