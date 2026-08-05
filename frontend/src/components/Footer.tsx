import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";

import InstagramIcon from "./icons/InstagramIcon";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left lg:px-8">
        <div className="flex flex-col items-center gap-3 lg:items-start">
          <Image
            src="/images/logo.png"
            alt="Bellas Nail Designer"
            width={64}
            height={64}
            className="rounded-full border border-gold-500/60"
          />
          <p className="max-w-xs text-sm text-cream/70">
            Esmalteria &amp; Nail Designer — manicure, pedicure, alongamento em fibra e podologia.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 lg:items-start">
          <h3 className="font-display text-lg text-gold-300">Contato</h3>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-gold-300"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-gold-300"
          >
            <InstagramIcon className="h-4 w-4" /> @bellas.nailsesmalteria
          </a>
          <span className="flex items-center gap-2 text-sm text-cream/60">
            <MapPin className="h-4 w-4" /> Atendimento com hora marcada
          </span>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Bellas Nail Designer. Todos os direitos reservados.
      </div>
    </footer>
  );
}
