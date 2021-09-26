from django.urls import path
from .views import index 

urlpatterns = [
    path('', index),
    path('dashboard', index),
    path('register', index),
    path('login', index),
    path('signup', index),
    path('workout', index),
    path('workout-add', index),
    path('managment', index),

]
