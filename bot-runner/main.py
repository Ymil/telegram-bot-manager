


import os
import django
import django.conf
import sys

DJANGOPROJECT_PATH = os.environ["DJANGOPROJECT"]
POSTGRES_HOST = os.environ["POSTGRES_HOST"]
BOT_ID = os.environ["BOT_ID"]

sys.path.append(DJANGOPROJECT_PATH)
try:
    import endPoints
except:
    sys.path.append("telegram_bot/")

from djangoproject import settings
settings.DATABASES['default']['HOST'] = POSTGRES_HOST
if "django_filters" in settings.INSTALLED_APPS:
    settings.INSTALLED_APPS.remove("django_filters")
if "rest_framework" in settings.INSTALLED_APPS:
    settings.INSTALLED_APPS.remove("rest_framework")
if "corsheaders" in settings.INSTALLED_APPS:
    settings.INSTALLED_APPS.remove("corsheaders")   
django.conf.settings.configure(DATABASES=settings.DATABASES, INSTALLED_APPS=settings.INSTALLED_APPS)
django.setup()

from bots.models import Bot
from users.models import User
from profiles.models import Profile
from handlers.models import Handler

from telegram.ext import Updater
from telegram.ext import CommandHandler, RegexHandler
import logging

from endPoints.http_api import HTTPApi_EndPoint
from endPoints.message import Message_EndPoint

logging.getLogger("telegramBot")
logging.basicConfig(level=logging.DEBUG)


bot_model = Bot.objects.get(pk=BOT_ID)
bot_token = bot_model.token
updater = Updater(token=bot_token, use_context=True)
dispatcher = updater.dispatcher

from jinja2 import Template

def messageProcessor(msg, context_variables):
    print(context_variables)
    template = Template(msg)
    return template.render(context_variables)

def start_bot():   
    all_commands = RegexHandler(r"^/(.*)", commandsHandler)
    dispatcher.add_handler(all_commands)
    updater.start_polling()


def cmd_handler_start(update, context):
    chat_id = update.message.chat_id
    user_data = update.message.from_user
    user = User.objects.get(username=user_data.username, bot=bot_model)
    if not user:                    
        User(
            first_name = user_data.first_name, 
            last_name=user_data.last_name, 
            username=user_data.username, 
            chat_id=chat_id, 
            bot=bot_model, 
            profile=Profile.objects.get(name='Default')
        ).save()

def commandsHandler(update, context): 
    chat_id = update.message.chat_id
    user_data = update.message.from_user
    command = update.message.text.split(" ")[0]
    args = update.message.text.split(" ")[0:]
    user = User.objects.get(username=user_data.username, bot=bot_model)
    try:
        handler = Handler.objects.get(command=command)       
        if not handler.enabled:
            raise Handler.DoesNotExist

        if command == "/start":
            cmd_handler_start(update, context)

        if user.response_enabled:
            msg = f"Procesando comando {command} con arguments {args}"
            if handler.payload['type'] == "message":                
                end_Point = Message_EndPoint( ** handler.payload)
            elif handler.payload['type'] == "http":
                end_Point = HTTPApi_EndPoint(bot_model, **handler.payload, args=args)                
            else:
                raise ValueError(f"Unsupported endpoint type: {handler.payload['type']}")
            
            if end_Point.execute():
                msg = end_Point.get_response()
                msg = messageProcessor(msg, vars(user_data))
            else:
                logging.error("Failed to process endpoint")
                raise

        else:
            msg = "Your user is not enabled"
    except Handler.DoesNotExist:
        msg = "Unknown command"
    logging.debug(msg)
    context.bot.sendMessage(chat_id=chat_id, text=msg)


if __name__ == "__main__":
    start_bot()