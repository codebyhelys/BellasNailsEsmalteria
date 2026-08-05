import type { Metadata } from "next";

import BookingWizard from "@/components/booking/BookingWizard";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Agendar horário | Bellas Nail Designer",
};

export default function AgendarPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-label">Agendamento</span>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Vamos marcar seu horário
          </h1>
          <p className="mt-2 text-ink-soft">Leva menos de um minuto.</p>
        </div>
        <BookingWizard />
      </main>
    </div>
  );
}
