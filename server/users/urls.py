from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.SimpleRouter()
router.register(r'api/users', views.UserViewSet)

urlpatterns = [
     path('api/users/list/', views.users_list)
]

urlpatterns += router.urls