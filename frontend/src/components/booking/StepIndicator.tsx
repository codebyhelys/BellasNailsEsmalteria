const ETAPAS = ["Serviço", "Data", "Horário", "Seus dados"];

export default function StepIndicator({ etapaAtual }: { etapaAtual: number }) {
  return (
    <ol className="mx-auto flex max-w-md items-center justify-between">
      {ETAPAS.map((nome, i) => {
        const numero = i + 1;
        const ativo = numero === etapaAtual;
        const concluido = numero < etapaAtual;
        return (
          <li key={nome} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  concluido
                    ? "bg-brand-600 text-white"
                    : ativo
                      ? "border-2 border-brand-600 text-brand-600"
                      : "border-2 border-brand-200 text-ink-soft"
                }`}
              >
                {numero}
              </div>
              <span
                className={`hidden text-[11px] sm:block ${ativo ? "font-semibold text-brand-700" : "text-ink-soft"}`}
              >
                {nome}
              </span>
            </div>
            {numero !== ETAPAS.length && (
              <div className={`mx-2 h-0.5 flex-1 ${concluido ? "bg-brand-600" : "bg-brand-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
