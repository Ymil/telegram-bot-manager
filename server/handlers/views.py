import django_filters
from django.http import JsonResponse
from handlers.models import Handler
from handlers.serializers import HandlerSerializer
from rest_framework import filters
from rest_framework import viewsets


class HandlerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows handlers to be viewed or edited.
    """
    queryset = Handler.objects.all()
    serializer_class = HandlerSerializer
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    ordering = ['pk']

    def create(self, request, *args, **kwargs):
        command = request.data['command']
        if Handler.objects.filter(command=command):
            return JsonResponse(
                status=412,
                data={
                    'description': f'Already registered handler with command {command}',  # noqa
                },
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
