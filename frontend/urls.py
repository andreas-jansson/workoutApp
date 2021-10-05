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
    path('management', index),
    path('workout-management', index),
    path('workout-planner', index),
    path('workout-planner-view', index),
    path('workout-planner-manage', index),
    path('workout-standard', index),

]
