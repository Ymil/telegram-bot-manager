#!/bin/sh

#docker exec -it telegram-bot-db psql --user postgres -c "create database botmanager"

#docker exec -it telegram-bot-server bash -c "python manager.py makemigrates; python manager.py migrate";

echo "Define name of bot"
read bot_name
echo "Set token of bot"
read bot_token

bot_insert='INSERT INTO public.bots_bot (id, token, name, response_all, description) VALUES (1, "$bot_name", "$bot_token", false, NULL);'
echo $bot_insert