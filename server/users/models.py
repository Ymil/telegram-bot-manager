from bots.models import Bot
from django.db import models
from groups.models import Group
from profiles.models import Profile


class User(models.Model):
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    groups = models.ManyToManyField(Group)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, default=2)
    chat_id = models.CharField('chat_id', max_length=100)
    first_name = models.CharField(max_length=100, default='', null=True)
    last_name = models.CharField(max_length=100, default='', null=True)
    username = models.CharField(max_length=100, default='', null=True)
    response_enabled = models.BooleanField(default=False)
    createdAt = models.DateTimeField('Created At', auto_now_add=True)

    def __str__(self):
        return self.username
