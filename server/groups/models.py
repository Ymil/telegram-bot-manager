from bots.models import Bot
from django.db import models


class Group(models.Model):
    bot_id = models.ForeignKey(Bot, on_delete=models.CASCADE)
    name = models.CharField('name', max_length=100)
    description = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField('Created At', auto_now_add=True)

    def __str__(self):
        return self.name
