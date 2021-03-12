from bots.models import Bot
from django.db import models
from django.db.models import JSONField
from profiles.models import Profile


class Handler(models.Model):
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    payload = JSONField(default=dict)
    response_profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, default=2,
    )
    enabled = models.BooleanField(default=False)
    name = models.CharField('name', max_length=100)
    description = models.TextField(blank=True, null=True)
    command = models.CharField('command', max_length=100)
    createdAt = models.DateTimeField('Created At', auto_now_add=True)

    def __str__(self):
        return str(self.name)
