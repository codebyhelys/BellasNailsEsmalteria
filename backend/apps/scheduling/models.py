from django.db import models

from apps.services.models import Servico


class WorkingHours(models.Model):
    class DiaSemana(models.IntegerChoices):
        SEGUNDA = 0, "Segunda-feira"
        TERCA = 1, "Terça-feira"
        QUARTA = 2, "Quarta-feira"
        QUINTA = 3, "Quinta-feira"
        SEXTA = 4, "Sexta-feira"
        SABADO = 5, "Sábado"
        DOMINGO = 6, "Domingo"

    dia_semana = models.IntegerField(choices=DiaSemana.choices, unique=True)
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    ativo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Horário de funcionamento"
        verbose_name_plural = "Horários de funcionamento"
        ordering = ["dia_semana"]

    def __str__(self):
        return f"{self.get_dia_semana_display()}: {self.hora_inicio}–{self.hora_fim}"


class BlockedDate(models.Model):
    data = models.DateField(unique=True)
    motivo = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Bloqueio de data"
        verbose_name_plural = "Bloqueios de data"
        ordering = ["data"]

    def __str__(self):
        return f"{self.data} ({self.motivo or 'sem motivo'})"


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDENTE = "pendente", "Pendente"
        CONFIRMADO = "confirmado", "Confirmado"
        CANCELADO = "cancelado", "Cancelado"

    cliente_nome = models.CharField(max_length=150)
    cliente_telefone = models.CharField(max_length=30)
    servico = models.ForeignKey(Servico, on_delete=models.PROTECT, related_name="agendamentos")
    data = models.DateField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDENTE)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Agendamento"
        verbose_name_plural = "Agendamentos"
        ordering = ["data", "hora_inicio"]

    def __str__(self):
        return f"{self.cliente_nome} - {self.servico} em {self.data} {self.hora_inicio}"
