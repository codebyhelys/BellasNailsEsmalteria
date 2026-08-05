/** Normaliza um telefone digitado pelo cliente (DDD + número, sem código do país) para o formato do wa.me. */
export function linkWhatsappCliente(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  const comDDI = digitos.startsWith("55") ? digitos : `55${digitos}`;
  return `https://wa.me/${comDDI}`;
}

export function linkConfirmacaoWhatsApp(params: {
  clienteNome: string;
  servicoNome: string;
  dataFormatada: string;
  horario: string;
}) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const texto = `Olá! Sou ${params.clienteNome} e gostaria de confirmar meu agendamento:\n\n💅 Serviço: ${params.servicoNome}\n📅 Data: ${params.dataFormatada}\n🕐 Horário: ${params.horario}\n\nAguardo a confirmação, obrigada!`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
