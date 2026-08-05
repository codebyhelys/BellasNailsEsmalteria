from django.contrib import admin

from .models import Appointment, BlockedDate, WorkingHours


@admin.register(WorkingHours)
class WorkingHoursAdmin(admin.ModelAdmin):
    list_display = ("get_dia_semana_display", "hora_inicio", "hora_fim", "ativo")
    list_editable = ("hora_inicio", "hora_fim", "ativo")

    @admin.display(description="Dia")
    def get_dia_semana_display(self, obj):
        return obj.get_dia_semana_display()


@admin.register(BlockedDate)
class BlockedDateAdmin(admin.ModelAdmin):
    list_display = ("data", "motivo")
    ordering = ("data",)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("cliente_nome", "cliente_telefone", "servico", "data", "hora_inicio", "status")
    list_filter = ("status", "data", "servico")
    search_fields = ("cliente_nome", "cliente_telefone")
    list_editable = ("status",)
