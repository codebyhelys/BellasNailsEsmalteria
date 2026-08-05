from rest_framework import viewsets

from .models import Servico
from .serializers import ServicoSerializer


class ServicoViewSet(viewsets.ModelViewSet):
    """Leitura pública (para a landing page); criação/edição exige login (painel admin)."""

    serializer_class = ServicoSerializer

    def get_queryset(self):
        qs = Servico.objects.all()
        if not (self.request.user and self.request.user.is_authenticated):
            qs = qs.filter(ativo=True)
        return qs
