FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV DJANGOPROJECT=/opt/telegramBotManager/server
ENV POSTGRES_HOST=telegram-bot-db

CMD [ "python", "./main.py" ]
