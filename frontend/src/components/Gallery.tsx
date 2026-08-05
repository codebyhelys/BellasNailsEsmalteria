"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const FOTOS = [
  { src: "/images/gallery/unha-1.png", alt: "Esmaltação azul com glitter" },
  { src: "/images/gallery/unha-2.png", alt: "Unhas nude com strass" },
  { src: "/images/gallery/unha-3.png", alt: "Esmaltação pink com glitter degradê" },
  { src: "/images/gallery/unha-4.png", alt: "Francesinha branca com dourado" },
  { src: "/images/gallery/unha-5.png", alt: "Esmaltação preta com glitter prateado" },
  { src: "/images/gallery/unha-6.png", alt: "Francesinha natural clássica" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="section-label">Nosso trabalho</span>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Cada detalhe, em close
          </h2>
          <div className="gold-divider mt-4" />
          <p className="mt-4 text-ink-soft">
            Uma amostra dos designs que já saíram daqui — do clássico ao mais elaborado.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {FOTOS.map((foto, i) => (
            <motion.div
              key={foto.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative aspect-[3/4] overflow-hidden rounded-t-[3rem] rounded-b-xl border-2 border-brand-200/60 shadow-md transition-shadow duration-300 hover:shadow-[0_20px_40px_-15px_rgba(184,0,95,0.4)] ${
                i === 2 ? "col-span-2 row-span-2 sm:col-span-1" : ""
              }`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-700/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
