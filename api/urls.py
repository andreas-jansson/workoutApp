from django.urls import path
from .views import DeleteUserView, LoginUserView, UserView, SessionExistView, RegisterUserView, RegisterCoachView \
    , GetExercisesView, CreateWorkoutView, SignOutView, CreateExerciseView, GetPendingUsers \
    , GetWorkoutView, GetWorkoutExercisesView,UpdateWorkoutView, DeleteWorkoutView, DenyPendingUsers \
    , ApprovePendingUsers, CreatePlannedWorkoutView, GetScheduledWorkoutsView \
    , ApprovePendingUsers, GetUserView, UpdateUserView, DeleteUserView, GetWorkoutDailyView, DeleteScheduledWorkout \
    , GetScheduledWorkoutsTodayView, SaveLogView, LoadActiveLogsView, LoadPreviousLogsView, LoadSpecificLogsView

urlpatterns = [

    ##     Initalize      ##
    path('', UserView.as_view()),

    ##      User          ##
    path('sign-out', SignOutView.as_view()),
    path('login-user', LoginUserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
    path('register-user', RegisterUserView.as_view()),
    path('register-coach', RegisterCoachView.as_view()),

    ##      Exercise       ##
    path('get-exercises', GetExercisesView.as_view()),
    path('create-exercise', CreateExerciseView.as_view()),

    ##      Workout        ##
    path('get-workouts', GetWorkoutView.as_view()),
    path('get-workouts-daily', GetWorkoutDailyView.as_view()),
    path('create-workout', CreateWorkoutView.as_view()),
    path('update-workout', UpdateWorkoutView.as_view()),
    path('delete-workout', DeleteWorkoutView.as_view()),
    path('get-workout-exercises', GetWorkoutExercisesView.as_view()),
    path('create-planned-workout', CreatePlannedWorkoutView.as_view()),
    path('get-scheduled-workouts', GetScheduledWorkoutsView.as_view()),
    path('delete-scheduled-workout', DeleteScheduledWorkout.as_view()),
    path('get-scheduled-workouts-today', GetScheduledWorkoutsTodayView.as_view()),

    ##     Pending User    ## 
    path('deny-user', DenyPendingUsers.as_view()),
    path('approve-user', ApprovePendingUsers.as_view()),
    path('get-pending-users', GetPendingUsers.as_view()),

    ##     Management      ##
    path('get-user', GetUserView.as_view()),
    path('update-user', UpdateUserView.as_view()),
    path('delete-user', DeleteUserView.as_view()),

    ## Logs ##
    path('save-log', SaveLogView.as_view()),
    path('load-active-log', LoadActiveLogsView.as_view()),
    path('load-previous-log', LoadPreviousLogsView.as_view()),
    path('load-specific-log', LoadSpecificLogsView.as_view()),


]
