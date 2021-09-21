from django.urls import path
from .views import UserView, SessionExistView, RegisterUserView

urlpatterns = [
    path('', UserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
    path('register-user', RegisterUserView.as_view()),
]