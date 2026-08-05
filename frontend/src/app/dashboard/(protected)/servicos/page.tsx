"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { atualizarServico, criarServico, excluirServico, listarServicos } from "@/lib/api";
import type { Servico } from "@/lib/types";

const VAZIO = { nome: "", descricao: "", duracao_minutos: 30, preco: "0", ativo: true, ordem: 0 };

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState<Servico | (typeof VAZIO) | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      setServicos(await listarServicos(false));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!editando) return;
    setSalvando(true);
    try {
      const payload = {
        nome: editando.nome,
        descricao: editando.descricao,
        duracao_minutos: Number(editando.duracao_minutos),
        preco: String(editando.preco),
        ativo: editando.ativo,
        ordem: Number(editando.ordem),
      };
      if ("id" in editando) {
        await atualizarServico(editando.id, payload);
      } else {
        await criarServico(payload);
      }
      setEditando(null);
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(servico: Servico) {
    await atualizarServico(servico.id, { ativo: !servico.ativo });
    carregar();
  }

  async function remover(servico: Servico) {
    if (!confirm(`Excluir o serviço "${servico.nome}"?`)) return;
    await excluirServico(servico.id);
    carregar();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Serviços</h1>
          <p className="text-sm text-ink-soft">Gerencie o que aparece no site para os clientes.</p>
        </div>
        <button onClick={() => setEditando(VAZIO)} className="btn-primary px-4 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Novo serviço
        </button>
      </div>

      {carregando ? (
        <div className="flex items-center gap-2 py-16 text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin" /> Carregando…
        </div>
      ) : (
        <div className="space-y-3">
          {servicos.map((servico) => (
            <div key={servico.id} className="card-elegant flex items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-ink">{servico.nome}</span>
                  {!servico.ativo && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs text-ink-soft">Inativo</span>
                  )}
                </div>
                <p className="text-sm text-ink-soft">
                  {servico.duracao_minutos} min · R$ {Number(servico.preco).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alternarAtivo(servico)}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  {servico.ativo ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => setEditando(servico)}
                  className="rounded-full p-2 text-ink-soft hover:bg-brand-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remover(servico)}
                  className="rounded-full p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={salvar} className="card-elegant w-full max-w-md space-y-3 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              {"id" in editando ? "Editar serviço" : "Novo serviço"}
            </h2>
            <input
              required
              placeholder="Nome"
              value={editando.nome}
              onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
              className="input-field"
            />
            <textarea
              placeholder="Descrição"
              value={editando.descricao}
              onChange={(e) => setEditando({ ...editando, descricao: e.target.value })}
              className="input-field"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-ink-soft">Duração (min)</label>
                <input
                  required
                  type="number"
                  min={5}
                  value={editando.duracao_minutos}
                  onChange={(e) => setEditando({ ...editando, duracao_minutos: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-ink-soft">Preço (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min={0}
                  value={editando.preco}
                  onChange={(e) => setEditando({ ...editando, preco: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft"
              >
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn-primary px-5 py-2 text-sm disabled:opacity-60">
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
