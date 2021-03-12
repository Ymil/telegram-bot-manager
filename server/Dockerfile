FROM conda/miniconda3:latest

COPY enviroment.yml /tmp

RUN conda config --env --set always_yes true
RUN conda env update -n base --file /tmp/enviroment.yml

WORKDIR /usr/src/app

ENV DJANGOPROJECT=/opt/telegramBotManager/server
ENV POSTGRES_HOST=telegram-bot-db

CMD [ "python", "manage.py", "runserver", "0:8000"]
