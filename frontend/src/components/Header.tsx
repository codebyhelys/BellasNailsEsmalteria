"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 border-b border-brand-200/50 bg-cream/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Bellas Nail Designer"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display text-lg font-semibold text-brand-700">Bellas Nail</span>
        </Link>
        <Link href="/agendar" className="btn-primary px-5 py-2.5 text-sm">
          Agendar
        </Link>
      </div>
    </motion.header>
  );
}
