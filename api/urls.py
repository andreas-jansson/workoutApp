from django.urls import path
from .views import UserView, SessionExistView

urlpatterns = [
    path('', UserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
]