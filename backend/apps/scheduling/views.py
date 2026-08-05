from datetime import date

from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.services.models import Servico

from .availability import horarios_disponiveis
from .models import Appointment, BlockedDate, WorkingHours
from .serializers import (
    AppointmentSerializer,
    BlockedDateSerializer,
    CriarAgendamentoSerializer,
    WorkingHoursSerializer,
)


class DisponibilidadeView(APIView):
    """Endpoint público: GET /api/disponibilidade/?data=YYYY-MM-DD&servico_id=1"""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        data_str = request.query_params.get("data")
        servico_id = request.query_params.get("servico_id")
        if not data_str or not servico_id:
            raise ValidationError("Informe 'data' (YYYY-MM-DD) e 'servico_id'.")
        try:
            data_alvo = date.fromisoformat(data_str)
        except ValueError:
            raise ValidationError("Data inválida, use o formato YYYY-MM-DD.")
        servico = Servico.objects.filter(pk=servico_id, ativo=True).first()
        if not servico:
            raise ValidationError("Serviço inválido.")
        if data_alvo < date.today():
            return Response({"horarios": []})
        horarios = horarios_disponiveis(data_alvo, servico.duracao_minutos)
        return Response({"horarios": horarios})


class AppointmentViewSet(viewsets.ModelViewSet):
    """Criação é pública (formulário de agendamento); demais ações exigem login (painel)."""

    queryset = Appointment.objects.select_related("servico").all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        status_filtro = self.request.query_params.get("status")
        data_filtro = self.request.query_params.get("data")
        if status_filtro:
            qs = qs.filter(status=status_filtro)
        if data_filtro:
            qs = qs.filter(data=data_filtro)
        return qs

    def create(self, request, *args, **kwargs):
        entrada = CriarAgendamentoSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        servico = entrada.validated_data["servico"]
        data_alvo = entrada.validated_data["data"]
        hora_inicio = entrada.validated_data["hora_inicio"]

        with transaction.atomic():
            livres = horarios_disponiveis(data_alvo, servico.duracao_minutos)
            if hora_inicio.strftime("%H:%M") not in livres:
                return Response(
                    {"detail": "Esse horário não está mais disponível. Escolha outro."},
                    status=status.HTTP_409_CONFLICT,
                )
            agendamento = entrada.save()

        saida = AppointmentSerializer(agendamento)
        return Response(saida.data, status=status.HTTP_201_CREATED)


class WorkingHoursViewSet(viewsets.ModelViewSet):
    queryset = WorkingHours.objects.all()
    serializer_class = WorkingHoursSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class BlockedDateViewSet(viewsets.ModelViewSet):
    queryset = BlockedDate.objects.all()
    serializer_class = BlockedDateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
