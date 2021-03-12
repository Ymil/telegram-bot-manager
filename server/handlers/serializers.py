from rest_framework import serializers
from .models import Handler

class HandlerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Handler
        fields = ('pk', 'bot', 'name', 'description', 'command', "enabled", "payload", 'createdAt')