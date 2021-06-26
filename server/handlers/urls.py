from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r'api/handlers', views.HandlerViewSet)

urlpatterns = router.urls
