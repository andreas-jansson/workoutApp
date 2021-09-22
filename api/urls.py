from django.urls import path
from .views import LoginUserView, UserView, SessionExistView, RegisterUserView

urlpatterns = [
    path('', UserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
    path('register-user', RegisterUserView.as_view()),
    path('login-user', LoginUserView.as_view()),
]