from django.urls import path
from .views import LoginUserView, UserView, SessionExistView, RegisterUserView, GetExercisesView, CreateWorkoutView, SignOutView, CreateExerciseView

urlpatterns = [
    path('', UserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
    path('register-user', RegisterUserView.as_view()),
    path('login-user', LoginUserView.as_view()),
    path('get-exercises', GetExercisesView.as_view()),
    path('create-workout', CreateWorkoutView.as_view()),
    path('sign-out', SignOutView.as_view()),
    path('create-exercise', CreateExerciseView.as_view()),
]