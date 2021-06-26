from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'pk', 'bot', 'groups', 'profile', 'chat_id',
            'first_name', 'last_name', 'username', 'response_enabled',
        )
