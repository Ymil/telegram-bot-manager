from bots.models import Bot
from bots.serializers import BotSerializer
from django.http import JsonResponse
from rest_framework import viewsets


class BotViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Bot.objects.all()
    serializer_class = BotSerializer


def bot_run(request, bot_id):
    import docker

    client = docker.from_env()

    try:
        bot_runner = client.containers.get(f'telegram-bot-manager-runner-{bot_id}')
        bot_runner.remove()
    except docker.errors.ContainerError:
        pass
    except Exception:
        pass

    try:
        client.containers.run(
            detach=True,
            image='telegram_bot:dev',
            network='telegram_bot_manager_default',
            name=f'telegram-bot-manager-runner-{bot_id}',
            volumes={
                'telegram_bot_manager_djangoproject': {
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
    try:
        bot_runner = client.containers.get(f'telegram-bot-manager-runner-{bot_id}')
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
    try:
        bot_runner = client.containers.get(f'telegram-bot-manager-runner-{bot_id}')
        bot_runner.stop()
        return JsonResponse(status=200, data={})
    except docker.errors.ContainerError:
        return JsonResponse(status=500, data={'message': ''})
    except Exception as e:
        return JsonResponse(status=500, data={'message': str(e)})
