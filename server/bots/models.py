from django.db import models


class Bot(models.Model):
    token = models.CharField('token', max_length=100)
    name = models.CharField('name', max_length=50)
    response_all = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField('Created At', auto_now_add=True)

    def __str__(self):
        return str(self.name)
