from bots.models import Bot
from bots.serializers import BotSerializer
from django.http import JsonResponse
from rest_framework import viewsets
import os

cotainer_botRunner = 'telegram-bot-runner-%d'

class BotViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Bot.objects.all()
    serializer_class = BotSerializer


def bot_run(request, bot_id):
    import docker

    client = docker.from_env()
    container_name = cotainer_botRunner % bot_id
    try:
        bot_runner = client.containers.get(container_name)
        bot_runner.remove()
    except docker.errors.ContainerError:
        pass
    except Exception:
        pass

    try:
        client.containers.run(
            detach=True,
            image=os.environ["BOTRUNNER_IMAGE"],
            network='telegram-bot-manager-network',
            name=container_name,
            volumes={
                'telegram-bot-manager_djangoproject': {
                    'bind': '/opt/telegramBotManager/server',
                    'mode': 'ro',
                },
            },
            environment={
                'BOT_ID': bot_id,
            },

        )
        return JsonResponse(status=200, data={})
    except docker.errors.ContainerError:
        return JsonResponse(status=500, data={})


def bot_status(request, bot_id):
    import docker
    client = docker.from_env()
    container_name = cotainer_botRunner % bot_id
    try:
        bot_runner = client.containers.get(container_name)
        data = {
            'status': bot_runner.status,
            'logs': str(bot_runner.logs(timestamps=False).decode()),
            # "attrs": str(bot_runner.attrs)
        }
        # print(data)
        return JsonResponse(
            status=200,
            data=data,
        )
    except docker.errors.ContainerError:
        return JsonResponse(status=500, data={'message': ''})
    except Exception as e:
        return JsonResponse(status=500, data={'message': str(e)})


def bot_stop(request, bot_id):
    import docker
    client = docker.from_env()
    container_name = cotainer_botRunner % bot_id
    try:
        bot_runner = client.containers.get(container_name)
        bot_runner.stop()
        return JsonResponse(status=200, data={})
    except docker.errors.ContainerError:
        return JsonResponse(status=500, data={'message': ''})
    except Exception as e:
        return JsonResponse(status=500, data={'message': str(e)})
