"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock, Loader2, Scissors } from "lucide-react";

import { listarServicos } from "@/lib/api";
import type { Servico } from "@/lib/types";

function formatarPreco(preco: string) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServiceStep({
  selecionado,
  onSelecionar,
}: {
  selecionado: Servico | null;
  onSelecionar: (servico: Servico) => void;
}) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    listarServicos()
      .then(setServicos)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-ink-soft">
        <Loader2 className="h-6 w-6 animate-spin" />
        Carregando serviços…
      </div>
    );
  }

  if (erro) {
    return (
      <p className="py-16 text-center text-ink-soft">
        Não foi possível carregar os serviços. Verifique sua conexão e tente novamente.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {servicos.map((servico) => {
        const ativo = selecionado?.id === servico.id;
        return (
          <motion.button
            key={servico.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelecionar(servico)}
            className={`flex items-start gap-3 rounded-2xl border-2 p-5 text-left transition-colors ${
              ativo
                ? "border-brand-500 bg-brand-50"
                : "border-brand-200/60 bg-white hover:border-brand-300"
            }`}
          >
            <span
              className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                ativo ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-500"
              }`}
            >
              <Scissors className="h-4 w-4" />
            </span>
            <span className="flex-1">
              <span className="font-display block text-lg font-semibold text-ink">{servico.nome}</span>
              <span className="mt-0.5 block text-sm text-ink-soft">{servico.descricao}</span>
              <span className="mt-2 flex items-center gap-3 text-xs text-ink-soft">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {servico.duracao_minutos} min
                </span>
                <span className="font-semibold text-brand-600">{formatarPreco(servico.preco)}</span>
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
