from django.urls import path
from .views import LoginUserView, UserView, SessionExistView, RegisterUserView, RegisterCoachView \
    , GetExercisesView, CreateWorkoutView, SignOutView, CreateExerciseView, GetPendingUsers \
    , GetWorkoutView, GetWorkoutExercisesView,UpdateWorkoutView, DeleteWorkoutView, DenyPendingUsers \
    , ApprovePendingUsers, CreatePlannedWorkoutView, GetScheduledWorkoutsView

urlpatterns = [
    path('', UserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
    path('register-user', RegisterUserView.as_view()),
    path('register-coach', RegisterCoachView.as_view()),
    path('login-user', LoginUserView.as_view()),
    path('get-exercises', GetExercisesView.as_view()),
    path('create-workout', CreateWorkoutView.as_view()),
    path('sign-out', SignOutView.as_view()),
    path('create-exercise', CreateExerciseView.as_view()),
    path('get-workouts', GetWorkoutView.as_view()),
    path('get-workout-exercises', GetWorkoutExercisesView.as_view()),
    path('update-workout', UpdateWorkoutView.as_view()),
    path('delete-workout', DeleteWorkoutView.as_view()),
    path('get-pending-users', GetPendingUsers.as_view()),
    path('deny-user', DenyPendingUsers.as_view()),
    path('approve-user', ApprovePendingUsers.as_view()),
    path('create-planned-workout', CreatePlannedWorkoutView.as_view()),
    path('get-scheduled-workouts', GetScheduledWorkoutsView.as_view()),

]