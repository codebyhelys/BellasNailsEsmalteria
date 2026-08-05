"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo"),
  telefone: z
    .string()
    .trim()
    .min(10, "Informe um telefone válido com DDD")
    .max(20, "Telefone inválido"),
});

export type DadosContato = z.infer<typeof schema>;

export default function ContactStep({
  valorInicial,
  onSubmit,
  enviando,
}: {
  valorInicial: DadosContato;
  onSubmit: (dados: DadosContato) => void;
  enviando: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosContato>({
    resolver: zodResolver(schema),
    defaultValues: valorInicial,
  });

  return (
    <form id="form-contato" onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-sm space-y-4">
      <div>
        <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-ink">
          Nome completo
        </label>
        <input
          id="nome"
          type="text"
          autoComplete="name"
          placeholder="Como podemos te chamar?"
          className="input-field"
          {...register("nome")}
        />
        {errors.nome && <p className="mt-1 text-xs text-brand-600">{errors.nome.message}</p>}
      </div>

      <div>
        <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-ink">
          WhatsApp / Telefone
        </label>
        <input
          id="telefone"
          type="tel"
          autoComplete="tel"
          placeholder="(88) 99999-0000"
          className="input-field"
          {...register("telefone")}
        />
        {errors.telefone && <p className="mt-1 text-xs text-brand-600">{errors.telefone.message}</p>}
      </div>

      <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
        {enviando ? "Confirmando…" : "Confirmar agendamento"}
      </button>
    </form>
  );
}
