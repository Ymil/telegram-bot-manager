from django.db import models


class Profile(models.Model):
    name = models.CharField('name', max_length=100)
    description = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField('Created At', auto_now_add=True)

    def __str__(self):
        return self.name
