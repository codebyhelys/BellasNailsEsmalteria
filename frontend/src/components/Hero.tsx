"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import DripDivider from "./DripDivider";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream pt-10 pb-0 sm:pt-14">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-gold-300/30 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <span className="section-label">
            <Sparkles className="mr-1 inline h-3.5 w-3.5" />
            Esmalteria &amp; Nail Designer
          </span>
          <h1 className="font-display text-4xl leading-[1.1] font-bold text-ink sm:text-5xl lg:text-6xl">
            Unhas impecáveis,
            <br />
            <span className="text-brand-600">no seu horário.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-soft sm:text-lg lg:mx-0 mx-auto">
            Manicure, pedicure, alongamento em fibra e podologia com o capricho que suas mãos merecem.
            Escolha o serviço, veja os horários livres e agende em menos de um minuto.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center">
            <Link href="/agendar" className="btn-primary w-full sm:w-auto">
              Agendar horário
            </Link>
            <a href="#galeria" className="btn-secondary w-full sm:w-auto">
              Ver trabalhos
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto flex w-full max-w-sm justify-center lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[3rem] border-4 border-white shadow-[0_30px_60px_-20px_rgba(184,0,95,0.35)]">
            <Image
              src="/images/gallery/unha-3.png"
              alt="Trabalho de unhas Bellas Nail Designer"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 hidden overflow-hidden rounded-3xl border-4 border-white shadow-xl sm:block"
          >
            <div className="relative h-28 w-28">
              <Image
                src="/images/gallery/unha-5.png"
                alt="Detalhe de unha"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </motion.div>
          <div className="absolute -top-4 -right-2 flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/60 bg-white p-1 shadow-lg sm:h-28 sm:w-28">
            <Image
              src="/images/logo.png"
              alt="Bellas Nail Designer"
              width={112}
              height={112}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      <div className="mt-14 text-white">
        <DripDivider />
      </div>
    </section>
  );
}
