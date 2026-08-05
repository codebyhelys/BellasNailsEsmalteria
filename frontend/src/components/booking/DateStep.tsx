"use client";

import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SEMANAS_A_MOSTRAR = 9; // ~2 meses pra frente, cobrindo o mês seguinte

export default function DateStep({
  selecionado,
  onSelecionar,
}: {
  selecionado: Date | null;
  onSelecionar: (data: Date) => void;
}) {
  const [semana, setSemana] = useState(0);
  const hoje = startOfDay(new Date());
  const inicioSemana = addDays(hoje, semana * 7);
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSemana((s) => Math.max(0, s - 1))}
          disabled={semana === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-200/60 text-brand-600 transition-colors disabled:opacity-30"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <AnimatePresence mode="wait">
          <motion.span
            key={semana}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="font-display text-sm font-semibold text-ink sm:text-base"
          >
            {format(inicioSemana, "d 'de' MMM", { locale: ptBR })} –{" "}
            {format(dias[6], "d 'de' MMM", { locale: ptBR })}
          </motion.span>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setSemana((s) => Math.min(SEMANAS_A_MOSTRAR - 1, s + 1))}
          disabled={semana === SEMANAS_A_MOSTRAR - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-200/60 text-brand-600 transition-colors disabled:opacity-30"
          aria-label="Próxima semana"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
        {dias.map((dia) => {
          const ativo = selecionado && isSameDay(dia, selecionado);
          return (
            <motion.button
              key={dia.toISOString()}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelecionar(dia)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 transition-colors sm:rounded-2xl sm:py-4 ${
                ativo
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-brand-200/60 bg-white text-ink hover:border-brand-300"
              }`}
            >
              <span className={`text-[9px] uppercase sm:text-[11px] ${ativo ? "text-white/80" : "text-ink-soft"}`}>
                {format(dia, "EEE", { locale: ptBR })}
              </span>
              <span className="font-display text-base font-bold sm:text-xl">{format(dia, "d")}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
