"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarX, Loader2 } from "lucide-react";

import { buscarDisponibilidade } from "@/lib/api";

export default function TimeStep({
  data,
  servicoId,
  selecionado,
  onSelecionar,
}: {
  data: Date;
  servicoId: number;
  selecionado: string | null;
  onSelecionar: (horario: string) => void;
}) {
  const [horarios, setHorarios] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    buscarDisponibilidade(format(data, "yyyy-MM-dd"), servicoId)
      .then(setHorarios)
      .catch(() => setHorarios([]))
      .finally(() => setCarregando(false));
  }, [data, servicoId]);

  if (carregando) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-ink-soft">
        <Loader2 className="h-6 w-6 animate-spin" />
        Buscando horários livres…
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-ink-soft">
        <CalendarX className="h-8 w-8" />
        Não há horários livres nesse dia.
        <span className="text-sm">Volte e escolha outra data.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {horarios.map((horario) => {
        const ativo = horario === selecionado;
        return (
          <motion.button
            key={horario}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelecionar(horario)}
            className={`rounded-xl border-2 py-3 text-center font-medium transition-colors ${
              ativo
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-brand-200/60 bg-white text-ink hover:border-brand-300"
            }`}
          >
            {horario}
          </motion.button>
        );
      })}
    </div>
  );
}
