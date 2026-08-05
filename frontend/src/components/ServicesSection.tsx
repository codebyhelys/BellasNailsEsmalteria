"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Sparkle } from "lucide-react";

import { listarServicos } from "@/lib/api";
import type { Servico } from "@/lib/types";

function formatarPreco(preco: string) {
  const valor = Number(preco);
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServicesSection() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarServicos()
      .then(setServicos)
      .catch(() => setServicos([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <section id="servicos" className="bg-cream-deep/60 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="section-label">O que fazemos</span>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Nossos serviços</h2>
          <div className="gold-divider mt-4" />
        </motion.div>

        {carregando && (
          <p className="mt-12 text-center text-ink-soft">Carregando serviços…</p>
        )}

        {!carregando && servicos.length === 0 && (
          <p className="mt-12 text-center text-ink-soft">
            Nenhum serviço disponível no momento. Volte em breve!
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {servicos.map((servico, i) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-elegant flex flex-col p-6"
            >
              <Sparkle className="h-6 w-6 text-gold-500" />
              <h3 className="font-display mt-3 text-xl font-semibold text-ink">{servico.nome}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{servico.descricao}</p>
              <div className="mt-4 flex items-center justify-between border-t border-brand-200/60 pt-4">
                <span className="flex items-center gap-1 text-xs text-ink-soft">
                  <Clock className="h-3.5 w-3.5" />
                  {servico.duracao_minutos} min
                </span>
                <span className="font-display text-lg font-bold text-brand-600">
                  {formatarPreco(servico.preco)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/agendar" className="btn-primary">
            Agendar horário
          </Link>
        </div>
      </div>
    </section>
  );
}
