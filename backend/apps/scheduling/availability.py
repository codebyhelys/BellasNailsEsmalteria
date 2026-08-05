from datetime import date, datetime, timedelta

from django.utils import timezone

from .models import Appointment, BlockedDate, WorkingHours

SLOT_INTERVALO_MINUTOS = 30


def horarios_disponiveis(data_alvo: date, duracao_minutos: int) -> list[str]:
    """Retorna os horários (HH:MM) livres para um serviço de `duracao_minutos` no dia `data_alvo`."""
    if BlockedDate.objects.filter(data=data_alvo).exists():
        return []

    dia_semana = data_alvo.weekday()
    expediente = WorkingHours.objects.filter(dia_semana=dia_semana, ativo=True).first()
    if not expediente:
        return []

    agora = timezone.localtime()
    inicio_expediente = datetime.combine(data_alvo, expediente.hora_inicio)
    fim_expediente = datetime.combine(data_alvo, expediente.hora_fim)
    duracao = timedelta(minutes=duracao_minutos)
    intervalo = timedelta(minutes=SLOT_INTERVALO_MINUTOS)

    ocupados = list(
        Appointment.objects.filter(
            data=data_alvo,
            status__in=[Appointment.Status.PENDENTE, Appointment.Status.CONFIRMADO],
        ).values_list("hora_inicio", "hora_fim")
    )
    ocupados_dt = [
        (datetime.combine(data_alvo, ini), datetime.combine(data_alvo, fim)) for ini, fim in ocupados
    ]

    slots = []
    cursor = inicio_expediente
    while cursor + duracao <= fim_expediente:
        fim_slot = cursor + duracao
        if data_alvo == agora.date() and cursor <= agora.replace(tzinfo=None):
            cursor += intervalo
            continue
        colide = any(cursor < fim_o and fim_slot > ini_o for ini_o, fim_o in ocupados_dt)
        if not colide:
            slots.append(cursor.strftime("%H:%M"))
        cursor += intervalo

    return slots
