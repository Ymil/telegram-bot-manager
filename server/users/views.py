import django_filters
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from users.models import User
from users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


@csrf_exempt
def users_list(request):
    bot_id = request.POST.get('bot_id')
    users = User.objects.filter(bot=bot_id)
    response = 'User List\n'
    for user in users:
        response += f'\t{user.pk} {user.first_name} '
        response += '{user.last_name} {user.profile.name}\n'
    return JsonResponse(data={'data': response})
