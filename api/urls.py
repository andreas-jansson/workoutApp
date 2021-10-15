from django.urls import path
from .views import *

urlpatterns = [

    ##     Initalize      ##
    path('', UserView.as_view()),

    ##      User          ##
    path('sign-out', SignOutView.as_view()),
    path('login-user', LoginUserView.as_view()),
    path('session-exist', SessionExistView.as_view()),
    path('register-user', RegisterUserView.as_view()),
    path('register-coach', RegisterCoachView.as_view()),
    path('get-client', GetClientView.as_view()),
    path('change-user-visibility', SettingsView.as_view()),
    path('get-user-visibility', SettingsView.as_view()),
    path('settings-user-delete', SettingsDeleteView.as_view()),
    path('get-user-id', GetUserId.as_view()),

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
    path('get-standard-workouts', GetStandardWorkoutView.as_view()),
    path('get-all-workouts', GetAllWorkoutView.as_view()),
    path('get-friend-workouts', GetFriendWorkoutView.as_view()),
    path('copy-friend-workouts', CopyFriendWorkoutView.as_view()),

    ##     Pending User    ## 
    path('deny-user', DenyPendingUsers.as_view()),
    path('approve-user', ApprovePendingUsers.as_view()),
    path('get-pending-users', GetPendingUsers.as_view()),

    ##     Management      ##
    path('manage-user', UserManagementView.as_view()),

    ##     Logs      ##
    path('save-log', SaveLogView.as_view()),
    path('load-active-log', LoadActiveLogsView.as_view()),
    path('load-previous-log', LoadPreviousLogsView.as_view()),
    path('load-specific-log', LoadSpecificLogsView.as_view()),
    path('delete-log', DeleteLogView.as_view()),
    

    ##     Social     ##
    path('get-friends', GetFriendsView.as_view()),
    path('get-friend-info', GetFriendInfoView.as_view()),
    path('get-pending-friends', GetPendingFriendView.as_view()),
    path('deny-pending-friend', DenyPendingFriendView.as_view()),
    path('accept-pending-friend', AcceptPendingFriendView.as_view()),
    path('delete-friend', DeleteFriendView.as_view()),
    path('social-find-friends', SocialFindFriends.as_view()),
    path('social-find-visible-friends', SocialFindFriendsVisible.as_view()),
    path('social-find-email-friends', SocialFindFriendsEmail.as_view()),
    ##     Management      ##
    #path('get-user', GetUserView.as_view()),
    #path('update-user', UpdateUserView.as_view()),
    #path('delete-user', DeleteUserView.as_view()),
    # Behövs ovanstående fortfarande? Verkar inte som det. 
    path('list-unassigned-clients', ListUnassignedClients.as_view()),
    path('add-client-to-coach',AssignClientToCoach.as_view()),
    path('remove-client-from-coach',RemoveClientFromCoach.as_view()),

    path('get-dashboard-data', GetDashboardData.as_view())

]
