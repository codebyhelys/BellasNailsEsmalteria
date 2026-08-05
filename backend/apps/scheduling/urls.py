from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet, BlockedDateViewSet, DisponibilidadeView, WorkingHoursViewSet

router = DefaultRouter()
router.register("agendamentos", AppointmentViewSet, basename="agendamento")
router.register("horarios-funcionamento", WorkingHoursViewSet, basename="horario-funcionamento")
router.register("bloqueios", BlockedDateViewSet, basename="bloqueio")

urlpatterns = [
    path("disponibilidade/", DisponibilidadeView.as_view(), name="disponibilidade"),
] + router.urls
