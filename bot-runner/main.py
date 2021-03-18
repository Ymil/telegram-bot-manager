


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

from server import settings
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

from message import Message
from responseProcessor.textProccesor import TextProccesor
from endPoints.http_api import HTTPApi_EndPoint
from endPoints.message import Message_EndPoint




MSG_UNKNOWN_COMMAND = "Unknown command: %s"
MSG_WELCOME_ALL = "Welcome {{ fist_name }}"
MSG_WELCOME_WAIT_FOR_APROBE = "Welcome {{ first_name }}, you must be approved by an administrator"
MSG_USER_DISABLED = "Your user is not enabled"
MSG_FAILED_COMMAND = "Failed processing command: %s"
MSG_UNREGISTER_USER = "You need send /start"
MSG_USER_REGISTER = "You are already registered"

#logging.getLogger("telegramBot")
logging.basicConfig(level=logging.DEBUG)
telegram_logger = logging.getLogger("telegram")
telegram_logger.setLevel(logging.CRITICAL)


bot = Bot.objects.get(pk=BOT_ID)
bot_token = bot.token
updater = Updater(token=bot_token, use_context=True)
dispatcher = updater.dispatcher


def cmd_handler_start(message: Message):
    chat_id = message.get_chat_id()
    user_data = message.get_user_data()
    try:
        User.objects.get(username=user_data.username, bot=bot)
        return False
    except User.DoesNotExist:                 
        User(
            first_name = user_data.first_name, 
            last_name=user_data.last_name, 
            username=user_data.username, 
            chat_id=chat_id, 
            bot=bot, 
            profile=Profile.objects.get(name='Default')
        ).save()
        return True
    

def handlerProcessor(handler, **kwargs):
    if 'args' in kwargs:
        args = kwargs['args']
    if handler.payload['type'] == "message":                
        end_Point = Message_EndPoint( ** handler.payload)
    elif handler.payload['type'] == "http":
        end_Point = HTTPApi_EndPoint(bot, **handler.payload, args=args)                
    else:
        raise ValueError(f"Unsupported endpoint type: {handler.payload['type']}")
    
    return end_Point

def commandsHandler(update, context): 
    message = Message(update)
    command, args = message.get_command()
    user_data = message.get_user_data()   
    if command == "/start":
        reg = cmd_handler_start(message)
        if reg:
            if bot.response_all:
                t = TextProccesor(MSG_WELCOME_ALL, message, context)
                t.execute()
                return
            else:
                t = TextProccesor(MSG_WELCOME_WAIT_FOR_APROBE, message, context)
                t.execute()
                return
        else:
            t = TextProccesor(MSG_USER_REGISTER, message, context)
            t.execute()
            return
    else:
        try:        
            user = User.objects.get(username=user_data.username, bot=bot)
        except User.DoesNotExist:
            user = False
        if user:
            try:
                handler = Handler.objects.get(command=command)
            except Handler.DoesNotExist:
                handler = False
            if handler:
                response = False
                if handler.enabled:
                    if bot.response_all:
                        response = True
                    else:
                        if user.response_enabled:
                            if user.profile == handler.response_profile:
                                response = True
                            elif user.profile.pk == 1:
                                # User is administrator
                                response = True
                            else:
                                t = TextProccesor(MSG_UNKNOWN_COMMAND % command, message, context)
                                t.execute()          
                                return
                        else:
                            t = TextProccesor(MSG_USER_DISABLED, message, context)
                            t.execute()
                            return
                else:
                    t = TextProccesor(MSG_UNKNOWN_COMMAND % command, message, context)
                    t.execute()
                    return

                if response:
                    try:                   
                        dp = handlerProcessor(handler, args=args)
                        if dp.execute():
                            msg = dp.get_response()
                            t = TextProccesor(msg, message, context)
                            t.execute()
                    except:
                        t = TextProccesor(MSG_FAILED_COMMAND % command, message, context)
                        t.execute()
            else:
                t = TextProccesor(MSG_UNKNOWN_COMMAND % command, message, context)
                t.execute()
                return
        else:
            t = TextProccesor(MSG_UNREGISTER_USER, message, context)
            t.execute()
            return

def start_bot():   
    all_commands = RegexHandler(r"^/(.*)", commandsHandler)
    dispatcher.add_handler(all_commands)
    updater.start_polling()

if __name__ == "__main__":
    start_bot()