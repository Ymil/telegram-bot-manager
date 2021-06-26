from django.urls import path
from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r'api/bots', views.BotViewSet)

urlpatterns = [
    path('api/bot/run/<int:bot_id>/', views.bot_run),
    path('api/bot/status/<int:bot_id>/', views.bot_status),
    path('api/bot/stop/<int:bot_id>/', views.bot_stop),
]

urlpatterns += router.urls
