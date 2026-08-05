"use client";

import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { criarAgendamento } from "@/lib/api";
import type { Servico } from "@/lib/types";
import { linkConfirmacaoWhatsApp } from "@/lib/whatsapp";

import ContactStep, { type DadosContato } from "./ContactStep";
import DateStep from "./DateStep";
import ServiceStep from "./ServiceStep";
import StepIndicator from "./StepIndicator";
import SuccessStep from "./SuccessStep";
import TimeStep from "./TimeStep";

type Etapa = 1 | 2 | 3 | 4;

export default function BookingWizard() {
  const [etapa, setEtapa] = useState<Etapa>(1);
  const [servico, setServico] = useState<Servico | null>(null);
  const [data, setData] = useState<Date | null>(null);
  const [horario, setHorario] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [agendamentoConcluido, setAgendamentoConcluido] = useState<DadosContato | null>(null);

  const podeAvancar =
    (etapa === 1 && servico !== null) ||
    (etapa === 2 && data !== null) ||
    (etapa === 3 && horario !== null);

  function avancar() {
    if (etapa < 4) setEtapa((e) => (e + 1) as Etapa);
  }

  function voltar() {
    setErroEnvio(null);
    if (etapa > 1) setEtapa((e) => (e - 1) as Etapa);
  }

  async function confirmarAgendamento(contato: DadosContato) {
    if (!servico || !data || !horario) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      await criarAgendamento({
        cliente_nome: contato.nome,
        cliente_telefone: contato.telefone,
        servico_id: servico.id,
        data: format(data, "yyyy-MM-dd"),
        hora_inicio: horario,
      });
      setAgendamentoConcluido(contato);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setErroEnvio("Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário.");
        setHorario(null);
        setEtapa(3);
      } else {
        setErroEnvio("Não foi possível concluir o agendamento. Tente novamente em instantes.");
      }
    } finally {
      setEnviando(false);
    }
  }

  if (agendamentoConcluido && servico && data && horario) {
    return (
      <SuccessStep
        clienteNome={agendamentoConcluido.nome}
        servicoNome={servico.nome}
        dataFormatada={format(data, "EEEE, d 'de' MMMM", { locale: ptBR })}
        horario={horario}
        linkWhatsapp={linkConfirmacaoWhatsApp({
          clienteNome: agendamentoConcluido.nome,
          servicoNome: servico.nome,
          dataFormatada: format(data, "dd/MM/yyyy"),
          horario,
        })}
      />
    );
  }

  return (
    <div>
      <StepIndicator etapaAtual={etapa} />

      <div className="mt-10 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {etapa === 1 && <ServiceStep selecionado={servico} onSelecionar={setServico} />}
            {etapa === 2 && <DateStep selecionado={data} onSelecionar={setData} />}
            {etapa === 3 && servico && data && (
              <TimeStep data={data} servicoId={servico.id} selecionado={horario} onSelecionar={setHorario} />
            )}
            {etapa === 4 && (
              <ContactStep
                valorInicial={{ nome: "", telefone: "" }}
                onSubmit={confirmarAgendamento}
                enviando={enviando}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {erroEnvio && <p className="mt-4 text-center text-sm text-brand-600">{erroEnvio}</p>}

      {etapa !== 4 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={voltar}
            disabled={etapa === 1}
            className="flex items-center gap-1 text-sm font-medium text-ink-soft disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar
          </button>
          <button
            type="button"
            onClick={avancar}
            disabled={!podeAvancar}
            className="btn-primary px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {etapa === 4 && (
        <div className="mt-6 text-center">
          <button type="button" onClick={voltar} className="text-sm font-medium text-ink-soft">
            <ChevronLeft className="mr-1 inline h-4 w-4" /> Voltar
          </button>
        </div>
      )}
    </div>
  );
}
