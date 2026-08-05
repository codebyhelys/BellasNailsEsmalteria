from django.db import migrations


def criar_horarios(apps, schema_editor):
    WorkingHours = apps.get_model("scheduling", "WorkingHours")
    # Padrão inicial: terça a sábado, 09:00–19:00. A dona pode ajustar no painel.
    dias_abertos = [1, 2, 3, 4, 5]  # terça(1) a sábado(5)
    for dia in range(0, 7):
        WorkingHours.objects.get_or_create(
            dia_semana=dia,
            defaults=dict(hora_inicio="09:00", hora_fim="19:00", ativo=dia in dias_abertos),
        )


def remover_horarios(apps, schema_editor):
    WorkingHours = apps.get_model("scheduling", "WorkingHours")
    WorkingHours.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("scheduling", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(criar_horarios, remover_horarios),
    ]
