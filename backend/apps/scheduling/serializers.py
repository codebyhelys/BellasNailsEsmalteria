from datetime import datetime, timedelta

from rest_framework import serializers

from apps.services.models import Servico

from .models import Appointment, BlockedDate, WorkingHours


class WorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = ["id", "dia_semana", "hora_inicio", "hora_fim", "ativo"]


class BlockedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedDate
        fields = ["id", "data", "motivo"]


class AppointmentSerializer(serializers.ModelSerializer):
    servico_nome = serializers.CharField(source="servico.nome", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "cliente_nome",
            "cliente_telefone",
            "servico",
            "servico_nome",
            "data",
            "hora_inicio",
            "hora_fim",
            "status",
            "criado_em",
        ]
        read_only_fields = ["hora_fim", "criado_em"]


class CriarAgendamentoSerializer(serializers.Serializer):
    cliente_nome = serializers.CharField(max_length=150)
    cliente_telefone = serializers.CharField(max_length=30)
    servico_id = serializers.PrimaryKeyRelatedField(
        source="servico", queryset=Servico.objects.filter(ativo=True)
    )
    data = serializers.DateField()
    hora_inicio = serializers.TimeField()

    def create(self, validated_data):
        servico = validated_data["servico"]
        inicio = datetime.combine(validated_data["data"], validated_data["hora_inicio"])
        fim = inicio + timedelta(minutes=servico.duracao_minutos)
        return Appointment.objects.create(
            cliente_nome=validated_data["cliente_nome"],
            cliente_telefone=validated_data["cliente_telefone"],
            servico=servico,
            data=validated_data["data"],
            hora_inicio=validated_data["hora_inicio"],
            hora_fim=fim.time(),
        )
