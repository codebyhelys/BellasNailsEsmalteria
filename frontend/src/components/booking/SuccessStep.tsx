"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

export default function SuccessStep({
  clienteNome,
  servicoNome,
  dataFormatada,
  horario,
  linkWhatsapp,
}: {
  clienteNome: string;
  servicoNome: string;
  dataFormatada: string;
  horario: string;
  linkWhatsapp: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-sm text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.div>

      <h2 className="font-display mt-5 text-2xl font-bold text-ink">Pedido enviado, {clienteNome.split(" ")[0]}!</h2>
      <p className="mt-2 text-ink-soft">
        Reservamos seu horário. Para confirmar de vez, toque no botão abaixo e envie a mensagem no
        WhatsApp — a Bellas confirma rapidinho.
      </p>

      <div className="card-elegant mt-6 space-y-2 p-5 text-left text-sm">
        <p>
          <span className="text-ink-soft">Serviço: </span>
          <span className="font-semibold text-ink">{servicoNome}</span>
        </p>
        <p>
          <span className="text-ink-soft">Data: </span>
          <span className="font-semibold text-ink">{dataFormatada}</span>
        </p>
        <p>
          <span className="text-ink-soft">Horário: </span>
          <span className="font-semibold text-ink">{horario}</span>
        </p>
      </div>

      <a
        href={linkWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-6 w-full bg-[#25D366] shadow-[#25D366]/30"
        style={{ background: "#25D366" }}
      >
        <MessageCircle className="h-5 w-5" />
        Confirmar no WhatsApp
      </a>

      <Link href="/" className="mt-4 inline-block text-sm text-ink-soft underline underline-offset-4">
        Voltar para o início
      </Link>
    </motion.div>
  );
}
