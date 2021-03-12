import django_filters
from handlers.models import Handler
from handlers.serializers import HandlerSerializer
from rest_framework import viewsets
from rest_framework import filters


class HandlerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows handlers to be viewed or edited.
    """
    queryset = Handler.objects.all()
    serializer_class = HandlerSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    ordering = ['pk']

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
