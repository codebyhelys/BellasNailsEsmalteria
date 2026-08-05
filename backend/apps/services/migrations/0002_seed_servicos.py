from django.db import migrations


def criar_servicos(apps, schema_editor):
    Servico = apps.get_model("services", "Servico")
    servicos = [
        dict(nome="Manicure", descricao="Cuidado completo das unhas das mãos.", duracao_minutos=45, preco=35, ordem=1),
        dict(nome="Pedicure", descricao="Cuidado completo das unhas dos pés.", duracao_minutos=50, preco=40, ordem=2),
        dict(
            nome="Alongamento em Fibra",
            descricao="Alongamento de unhas em fibra de vidro, natural e resistente.",
            duracao_minutos=120,
            preco=120,
            ordem=3,
        ),
        dict(
            nome="Podologia",
            descricao="Tratamento especializado para saúde dos pés.",
            duracao_minutos=60,
            preco=90,
            ordem=4,
        ),
    ]
    for dados in servicos:
        Servico.objects.get_or_create(nome=dados["nome"], defaults=dados)


def remover_servicos(apps, schema_editor):
    Servico = apps.get_model("services", "Servico")
    Servico.objects.filter(
        nome__in=["Manicure", "Pedicure", "Alongamento em Fibra", "Podologia"]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(criar_servicos, remover_servicos),
    ]
