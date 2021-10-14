from codecs import lookup
from django import http
from django.conf.urls import url
from django.db.models import query
from django.db import connection
from django.shortcuts import render
from django.views.generic.base import RedirectView
from rest_framework import generics, serializers, status
from rest_framework import response
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import UserSerializer, ExerciseSerializer, WorkoutSerializer, UserSerializerPending \
    ,RoleSerializer, scheduledWorkoutSerializer, LogSerializer, LogExtraSerializer, FriendsSerializer
from .models import Role, User, Exercise, ExerciseType, Workout, scheduledWorkout, Log, Friends, CoachHasClient
from .hashUtils import compare_pw_hash, create_pw_hash, create_salt
from .userUtils import email_is_registered, user_is_unauthorized
import io
from rest_framework.parsers import JSONParser
from datetime import date
from datetime import datetime as dt
from datetime import timedelta
import calendar
from itertools import chain
import re

# Create your views here.


class UserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SessionExistView(APIView):

    def get(self, request, format=None):
        if self.request.session.exists(self.request.session.session_key):
            print("**** session Exist ****")
            fname = self.request.session.get('first_name')
            role_id = self.request.session.get('role_id')
            return Response({'fname': fname, 'role_id': role_id}, status=status.HTTP_202_ACCEPTED)
        print("**** session Missing ****")
        return Response({'User New': 'Stay'}, status=status.HTTP_200_OK)


class SignOutView(APIView):

    def get(self, request, format=None):
        print("Signout Triggered")
        self.request.session.flush()
        return Response({'User Sign Out': 'Redirect'}, status=status.HTTP_202_ACCEPTED)


class HashTestView(APIView):
    def get(self, request, format=None):
        password = "abcdefg"
        salt = create_salt()
        print("salt: " + salt)
        pwHash = create_pw_hash(password, salt)
        print("hash: " + pwHash)
        check = compare_pw_hash(password, salt, pwHash)
        print("check: " + str(check))
        return Response({'Hash complete': 'OK'}, status=status.HTTP_200_OK)


class RegisterUserView(APIView):
    def post(self, request, format=None):
        if (email_is_registered(request.data['email'])):
            return Response({'User already exists': 'BAD'}, status=status.HTTP_418_IM_A_TEAPOT)
        else:
            new_salt = create_salt()
            hashed_password = create_pw_hash(request.data['password'], new_salt)
            new_user = User(fname=request.data['fname'],
                            lname=request.data['lname'],
                            email=request.data['email'],
                            salt=new_salt,
                            pwhash=hashed_password,
                            roleid=Role.objects.filter(description='Unauthorized')[0])
            new_user.save()
            return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)


class RegisterCoachView(APIView):
    def post(self, request, format=None):
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        if (email_is_registered(data['email'])):
            print("if")
            return Response({'User already exists': 'BAD'}, status=status.HTTP_418_IM_A_TEAPOT)
        else:
            print("else")
            new_salt = create_salt()
            hashed_password = create_pw_hash(data['password'], new_salt)
            print(data['role'])
            new_user = User(fname=data['fname'],
                            lname=data['lname'],
                            email=data['email'],
                            salt=new_salt,
                            pwhash=hashed_password,
                            roleid=Role.objects.filter(description=data['role'])[0])  # Role.objects.filter(description = 'Coach')[0] ,,,role
            print("roleid")
            new_user.save()
            print("save")
            self.request.session.create()
            return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)


class LoginUserView(generics.ListAPIView):
    def post(self, request, format=None):
        if (email_is_registered(request.data['email'])):
            user = User.objects.filter(email=request.data['email'])[0]
            if(compare_pw_hash(request.data['password'], user.salt, user.pwhash)):
                if (user_is_unauthorized(user)):
                    return Response({'Unauthorized User, Wait to get accepted'}, status=status.HTTP_401_UNAUTHORIZED)
                self.request.session.create()
                self.request.session['user_id'] = user.id
                self.request.session['first_name'] = user.fname
                self.request.session['role_id'] = user.roleid_id
                return Response({'Login OK'}, status=status.HTTP_200_OK)
        return Response({'Invalid Email Or Password'}, status=status.HTTP_406_NOT_ACCEPTABLE)


# Recieves exercise type and returns all exercises
class GetExercisesView(generics.ListAPIView):
    lookup_url_kwarg = 'type'

    def get(self, request, format=None):
        exercise_type = request.GET.get(self.lookup_url_kwarg)
        print("GetExercisesView Triggered!")
        print(exercise_type)
        if exercise_type != None:
            queryset = Exercise.objects.raw(
                'select e.id, e.name from api_exercisetype as et join api_exercise as e on et.id = e.type_id where et.type = \'{}\''.format(exercise_type))
            if len(queryset) > 0:
                data = ExerciseSerializer(queryset, many=True).data
                print(data)
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CreateWorkoutView(APIView):

    def post(self, request, format=None):
        print("CreateWorkoutView Triggered!")

        name = request.data['workoutName']
        description = request.data['workoutDesc']
        active = True

        # checks if user or higher role. users workouts are private
        if(self.request.session.get('role_id') == 2):
            shared = False
        else:
            shared = True

        consistsOf = 'wtf'
        workout = Workout(name=name, description=description,
                          active=True, shared=shared)
        workout.save()

        # Finds user and creates user_hasWorkout - mtm
        user_id = self.request.session.get('user_id')
        print("user_id: " + str(user_id))
        user_has_workout = User.objects.get(id=user_id)
        print("user_has_workout: " + str(user_has_workout))
        user_has_workout.hasWorkouts.add(workout)

        # Find all exercises that the user picked. Finds the specific exercise object and creates mtm with workout
        for exercise in request.data['exercises_list']:
            queryset = Exercise.objects.raw(
                'select e.id, e.name, e.type_id from api_exercise as e where name = \'{}\' limit 1'.format(exercise))
            #var_type = queryset[0].type_id
            var_name = queryset[0].name

            exercise = Exercise.objects.get(name=var_name)
            print(exercise.name)
            workout.consistsOf.add(exercise)
            workout.save()
            print(workout)
        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        # return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CreateExerciseView(APIView):
    #serializer_class = CreateWorkoutInfoSerializer;

    def post(self, request, format=None):
        print("CreateExerciseView Triggered!")
        name = request.data['exerciseName']
        type_id = request.data['exerciseType']

        exercise_type = ExerciseType.objects.get(type=type_id)
        print(exercise_type)

        exercise = Exercise(name=name, type_id=exercise_type.id)
        exercise.save()
        print(exercise)

        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        # return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GetWorkoutView(APIView):
    def get(self, request, format=None):
        print("GetWorkoutView Triggered!")
        shared = False
        if(User.objects.filter(id=self.request.session.get('user_id'))[0].roleid_id > 2):
            print("coach")
            queryset = Workout.objects.raw('select * from api_workout where active = 1 and shared = 1')
            print(queryset)
            shared = True
        else:
            queryset = Workout.objects.raw('select w.id, w.name, w.description, w.active, w.shared from api_user_hasWorkouts as uhw '
            +'inner join api_workout as w on uhw.workout_id = w.id where uhw.user_id = \'{}\' and active =1'.format(self.request.session.get('user_id')))
            print(queryset)

        if len(queryset)>0:
            data = WorkoutSerializer(queryset, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)




class GetStandardWorkoutView(APIView):
    def get(self, request, format=None):
        print("GetWorkoutView Triggered!")
        shared = False

        queryset = Workout.objects.raw('select * from api_workout where active = 1 and shared = 1')
        print(queryset)

        if len(queryset)>0:
            data = WorkoutSerializer(queryset, many=True).data
            print(data)
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class GetWorkoutExercisesView(APIView):
    lookup_url_kwarg = 'name'

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        print("name: " + name)
        print("GetWorkoutExerciseView Triggered!")
        if(User.objects.filter(id=self.request.session.get('user_id'))[0].roleid_id > 2):
            queryset = Workout.objects.raw('select e.id, e.name, e.type_id from api_workout as w '
                                           + 'inner join api_workout_consistsOf as wco on wco.workout_id = w.id '
                                           + 'inner join api_exercise as e on e.id = wco.exercise_id '
                                           + 'where  active = 1  and w.name = \'{}\';'.format(name))
        else:
            queryset = Workout.objects.raw('select e.id, e.name, e.type_id from api_user_hasWorkouts as uhw '
            +'inner join api_workout as w on uhw.workout_id = w.id '
            +'inner join api_workout_consistsOf as wco on wco.workout_id = uhw.workout_id '
            +'inner join api_exercise as e on e.id = wco.exercise_id '
            +'where uhw.user_id = \'{}\' and  active = 1  and w.name = \'{}\''.format(self.request.session.get('user_id'), name))
            #if client, find exercises from their own workout named XYZ, else get exercises from standard workouts
            if(bool(queryset) == False):
                queryset = Workout.objects.raw('select e.id, e.name, e.type_id from api_workout as w '
                +'inner join api_workout_consistsOf as wco on wco.workout_id = w.id '
                +'inner join api_exercise as e on e.id = wco.exercise_id '
                +'where  active = 1  and w.name = \'{}\';'.format(name))
        
        if len(queryset)>0:
            data = WorkoutSerializer(queryset, many=True).data
            print(data)
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class UpdateWorkoutView(APIView):

    def post(self, request, format=None):
        print("UpdateWorkoutView Triggered!")
        print(request.data['workoutName'])
        name = request.data['workoutName']

        # finds the ID of the workout that is active and belongs to this user or is shared if coach
        if(User.objects.filter(id=self.request.session.get('user_id'))[0].roleid_id > 2):
            query_workout = Exercise.objects.raw(
                'select w.id, w.description from api_workout as w where w.name = \'{}\' and w.active = 1'.format(name))
            print(query_workout)
        else:
            query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w '
                                                 + 'inner join api_user_hasWorkouts as uhw '
                                                 + 'on w.id = uhw.workout_id inner join api_user as u '
                                                 + 'on uhw.user_id = u.id where u.id = \'{}\' and w.name = \'{}\' and w.active = 1'.format(self.request.session.get('user_id'), name))

        # print(query_workout[0].id)

        # updates old workout to inactive
        workout = Workout.objects.get(id=query_workout[0].id)
        workout.active = 0
        workout.save()

        if(self.request.session.get('role_id') == 2):
            shared = False
        else:
            shared = True

        workout_new = Workout(
            name=name, description=query_workout[0].description, active=True, shared=shared)
        workout_new.save()

        # Finds user and creates user_hasWorkout - mtm
        user_id = self.request.session.get('user_id')
        print("user_id: " + str(user_id))
        user_has_workout = User.objects.get(id=user_id)
        print("user_has_workout: " + str(user_has_workout))
        user_has_workout.hasWorkouts.add(workout_new)

        # Find all exercises that the user picked. Finds the specific exercise object and creates mtm with workout
        for exercise in request.data['exercises_list']:
            queryset = Exercise.objects.raw('select e.id, e.name, e.type_id from api_exercise as '
                                            + 'e where name = \'{}\' limit 1'.format(exercise))
            #var_type = queryset[0].type_id
            var_name = queryset[0].name

            exercise = Exercise.objects.get(name=var_name)
            print(exercise.name)
            workout_new.consistsOf.add(exercise)
            print(workout_new)
        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        # return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)



class DeleteWorkoutView(APIView):
    def post(self, request, format=None):
        print("DeleteWorkoutView Triggered!")
        name = request.data['workoutName']


        if(User.objects.filter(id=self.request.session.get('user_id'))[0].roleid_id > 2):
            query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w where w.name = \'{}\' and w.active = 1'.format(name))
            print(query_workout[0].id)
        else:
            query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w '
            +'inner join api_user_hasWorkouts as uhw '
            +'on w.id = uhw.workout_id inner join api_user as u '
            +'on uhw.user_id = u.id where u.id = \'{}\' and w.name = \'{}\' and w.active = 1'.format(self.request.session.get('user_id') , name))
            print(query_workout[0].id)
        workout = Workout.objects.get(id=query_workout[0].id)
        workout.active = False
        workout.save()
        return Response({'Workout Deleted': 'OK'}, status=status.HTTP_200_OK)


class GetPendingUsers(APIView):
    def get(self, request, format=None):
        user_list = User.objects.filter(roleid=Role.objects.filter(description='Unauthorized')[0])
        serialized_users = UserSerializerPending(user_list, many=True).data
        return Response(serialized_users, status=status.HTTP_200_OK)


class DenyPendingUsers(APIView):
    def post(self, request, format=None):
        user_id = request.data['id']
        User.objects.filter(id=user_id).delete()
        return Response({'User denied': 'OK'}, status=status.HTTP_200_OK)


class ApprovePendingUsers(APIView):
    def post(self, request, format=None):
        user_id = request.data['id']
        approvedUser = User.objects.get(id=user_id)
        approvedUser.roleid = Role.objects.filter(description='Client')[0]
        approvedUser.save()
        return Response({'User approved': 'OK'}, status=status.HTTP_200_OK)


class CreatePlannedWorkoutView(APIView):
    def post(self, request, format=None):
        print("CreatePlannedWorkout Triggered!")
        monday = bool(request.data['mon'])
        tuesday = bool(request.data['tue'])
        wednesday = bool(request.data['wed'])
        thursday = bool(request.data['thu'])
        friday = bool(request.data['fri'])
        saturday = bool(request.data['sat'])
        sunday = bool(request.data['sun'])
        dateStart = request.data['dateStart']
        dateEnd = request.data['dateEnd']
        restWeek = request.data['restWeek']
        client = request.data['user']

        if(restWeek == ''):  # just in case
            restWeek = 0
        else:
            restWeek = int(restWeek)

        name = request.data['workoutName']

        start_yyyy = int(dateStart[0:4])
        start_mm = int(dateStart[5:7])
        start_dd = int(dateStart[8:])

        end_yyyy = int(dateEnd[0:4])
        end_mm = int(dateEnd[5:7])
        end_dd = int(dateEnd[8:])

        start = date(start_yyyy, start_mm, start_dd)
        end = date(end_yyyy, end_mm, end_dd)

        delta = end - start

        start_week = date(start_yyyy, start_mm, start_dd).isocalendar()[1]
        print(start_week)
        week = start_week

        # returns rest_weeks_list
        rest_weeks_list = []
        flag = True
        counter = 1
        for days in range(int(delta.days)+1):
            current = start + datetime.timedelta(days=days)
            #print("current: " + str(current))
            current_yyyy = current.year
            current_mm = current.month
            current_dd = current.day
            current_week = datetime.date(
                current_yyyy, current_mm, current_dd).isocalendar()[1]
            #print("current week: " + str(current_week))

            if(week == start_week and flag == True and restWeek >= 2):
                flag = False
                counter = counter + 1
                print(str(counter) + " " + str(current) + " week: " + str(week))

            if (week != current_week):
                week = current_week
                print("comparing counter: " + str(counter) +
                      " == " + str(restWeek) + " Rest Week")
                if(counter == restWeek):
                    counter = 1
                    print(str(counter) + " " + str(current) +
                          " week: " + str(week) + " Rest Week")
                    rest_weeks_list.append(week)
                else:
                    print(str(counter) + " " +
                          str(current) + " week: " + str(week))
                    counter = counter + 1

        user = self.request.session.get('user_id')
        if(client == 0):
            # find correct workout id from personal workouts - client
            query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w '
                                                 + 'inner join api_user_hasWorkouts as uhw '
                                                 + 'on w.id = uhw.workout_id inner join api_user as u '
                                                 + 'on uhw.user_id = u.id where u.id = \'{}\' and w.name = \'{}\' and w.active = 1'.format(user, name))
            # print(query_workout[0].id)
        else:
            user = client
            # find correct workout id from shared - coach view
            query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w '
                                                 + 'where  w.name = \'{}\' and w.active = 1'.format(name))
            # print(query_workout[0].id)

        print(rest_weeks_list)
        print(delta.days)
        for days in range(int(delta.days+1)):
            current = start + datetime.timedelta(days=days)
            current_yyyy = current.year
            current_mm = current.month
            current_dd = current.day
            current_week = datetime.date(
                current_yyyy, current_mm, current_dd).isocalendar()[1]
            if(current_week not in rest_weeks_list):
                if(current.strftime("%A") == "Monday" and monday == True):
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                elif(current.strftime("%A") == "Tuesday" and tuesday == True):
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")
                elif(current.strftime("%A") == "Wednesday" and wednesday == True):
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")
                elif(current.strftime("%A") == "Thursday" and thursday == True):
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")
                elif(current.strftime("%A") == "Friday" and friday == True):
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")
                elif(current.strftime("%A") == "Saturday" and saturday == True):
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")
                elif(current.strftime("%A") == "Sunday" and sunday == True):
                    scheduled = scheduledWorkout(
                        scheduledDate=current, user_id=user, workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) +
                          " " + str(current) + " adding")

        # hitta rätt workout id för denna kund baserat på userid och workout namn
        # beräkna vilken vecka som går bort baserat på restweek

        # beräkna antal dagar mellan start och slutdatum
        # loopa igenom alla dagar
            # kolla om veckan är skippveckan
                # kolla datument för varje dag och jämför om vår dag(mon,tue etc) är true
                    # om true så sparas datum, workout id och user id

        return Response({'User approved': 'OK'}, status=status.HTTP_200_OK)


class GetScheduledWorkoutsTodayView(APIView):
    def get(self, request, format=None):

        print("******GetScheduledWorkoutsTodayView Triggered!****")
    
        today = str(dt.today())[:10]+"%"
        print(today)

        queryset = Workout.objects.raw('select * from api_scheduledworkout as sw '
        +'inner join api_workout as w on sw.workout_id = w.id '
        +'where user_id = \'{}\' and scheduledDate like \'{}\''.format(self.request.session.get('user_id'), today, ))
        if len(queryset)>0:
            data = WorkoutSerializer(queryset, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class GetScheduledWorkoutsView(APIView):
    lookup_url_kwarg = ('date', 'user')

    def get(self, request, format=None):

        print("******GetScheduledWorkoutsView Triggered!****")

        #dynamic_date = request.GET.get(self.lookup_url_kwarg)
        dynamic_date = request.GET['date']
        client = int(request.GET['user'])

        print("test: " + str(dynamic_date))
        print(client)

        dyn_yyyy = int(dynamic_date[0:4])
        dyn_mm = int(dynamic_date[5:7])
        dyn_dd = int(dynamic_date[8:])
        print(dyn_yyyy)
        print(dyn_mm)
        print(dyn_dd)

        # get date of the first day in the current month
        first_day_of_month = str(dt(dyn_yyyy, dyn_mm, dyn_dd).replace(day=1))
        print(first_day_of_month)

        # extract year and month as ints
        yyyy = int(first_day_of_month[0:4])
        mm = int(first_day_of_month[5:7])

        # get the number of months for the given year and month
        days_in_month = calendar.monthrange(dyn_yyyy, dyn_mm)[1]
        # get date of last day of current month
        last_day_of_month = str(
            dt(dyn_yyyy, dyn_mm, dyn_dd).replace(day=days_in_month))
        #last_day_of_month = str(dt.today().replace(day=days_in_month))
        print(last_day_of_month)

        # decides if it should get the users or clients schedule
        if(client == 0):
            user_id = self.request.session.get('user_id')
        else:
            user_id = client

        queryset = scheduledWorkout.objects.raw('select * from api_scheduledworkout '
                                                + 'where user_id = \'{}\' and scheduledDate >= \'{}\' and scheduledDate <= \'{}\' order by scheduledDate'.format(user_id, first_day_of_month, last_day_of_month))
        if len(queryset) > 0:
            data = scheduledWorkoutSerializer(queryset, many=True).data
            print(data)
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class GetWorkoutDailyView(APIView):
    lookup_url_kwarg = ('date', 'user')

    def get(self, request, format=None):
        print("******GetWorkoutDailyViewTriggered!****")

        date = request.GET['date'] + "%"
        print("date: " + date)
        client = int(request.GET['user'])
        print("user: " + str(client))

        user = self.request.session.get('user_id')
        if(client == 0):
            queryset = Workout.objects.raw('select * from api_scheduledworkout as sw '
                                           'inner join api_workout as w on sw.workout_id = w.id '
                                           + 'where user_id = \'{}\' and scheduledDate like \'{}\''.format(user, date))
        else:
            user = client
            queryset = Workout.objects.raw('select * from api_scheduledworkout as sw '
                                           'inner join api_workout as w on sw.workout_id = w.id '
                                           + 'where user_id = \'{}\' and scheduledDate like \'{}\''.format(user, date))

        if len(queryset) > 0:
            data = WorkoutSerializer(queryset, many=True).data
            print(data)
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


########### USER MANAGEMENT [TABLE]  #################################
class UserManagementView(APIView):
    def get(self, request, format=None):
        print("GetUserView Triggered!")
        test = request.GET.get('id')
        print(test)
        queryset = User.objects.raw('select * from api_user')

        if len(queryset)>0:
            data = UserSerializer(queryset, many=True).data
            return Response(data, status=status.HTTP_200_OK) 
        return Response({'User FOUND': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, format=None):
        print("PutUserView Triggered!")
        print(request.data)

        user_id = request.data['id']
        fname   = request.data['fname']
        lname   = request.data['lname']
        email   = request.data['email']       
        
        query = User.objects.get(id = user_id)
        query.fname = fname
        query.lname = lname
        query.email = email
        query.save()
        return Response({'User UPDATED': 'OK'}, status=status.HTTP_200_OK)
    
    def delete(self, request, format=None):
        print("DeleteUserView Triggered!")
        user_id = request.GET.get('id')
        print(user_id)
        
        scheduledworkout = scheduledWorkout.objects.raw('select * from api_scheduledWorkout where user_id = \'{}\''.format(user_id))
        print(scheduledworkout)
        for workout in scheduledworkout: 
           workout.delete()
        
        user = User.objects.filter(id = user_id)
        user.delete()     
        return Response({'User DELETED': 'OK'}, status=status.HTTP_200_OK)



class DeleteScheduledWorkout(APIView):
    def post(self, request, format=None):
        print("DeleteScheduledWorkoutView Triggered!")
        name = request.data['workoutName']
        date = request.data['date'] + '%'
        client = request.data['user']
        print(name)
        print(date)



        user = self.request.session.get('user_id')
        if(client == 0):
            # finds correct workout id to remove  - client view
            to_delete = scheduledWorkout.objects.raw('select sw.id from api_workout as w '
                                                     + 'inner join api_user_hasWorkouts as uhw on w.id = uhw.workout_id '
                                                     + 'inner join api_scheduledworkout as sw on w.id = sw.workout_id '
                                                     + 'where sw.user_id = \'{}\' and w.name = \'{}\' and sw.scheduledDate like \'{}\';'.format(user, name, date))
        else:
            user = client
            # finds correct workout id to remove - coach view
            to_delete = scheduledWorkout.objects.raw('select sw.id from api_workout as w '
            +'inner join api_user_hasWorkouts as uhw on w.id = uhw.workout_id '
            +'inner join api_scheduledworkout as sw on w.id = sw.workout_id '
            +'where sw.user_id = \'{}\' and w.name = \'{}\' and sw.scheduledDate like \'{}\';'.format(user , name, date))

        print(to_delete[0].id)
        delete_logs = Log.objects.filter(scheduledWorkout_id=to_delete[0].id)

        for log in delete_logs:
            print("deleting: " + str(log.id))
            log.delete()

        scheduledWorkout.objects.filter(id=to_delete[0].id).delete()

        #delete_workout = scheduledWorkout.objects.raw('delete from api_scheduledworkout '
        #+'where user_id = \'{}\' and workout_id = \'{}\' and scheduledDate like \'{}\';'.format(self.request.session.get('user_id') , query_workout[0].id, date))
        #print(delete_workout[0].id)
        return Response({'Workout Deleted': 'OK'}, status=status.HTTP_200_OK)

class SettingsView(APIView):
    def get(self, request, format=None):
        if(User.objects.filter(id=self.request.session.get('user_id')).exists()):
            user = User.objects.filter(id=self.request.session.get('user_id'))[0]
            data = UserSerializer(user).data
            return Response(data, status=status.HTTP_200_OK) 

    def post(self, request, format=None):
        if(User.objects.filter(id=self.request.session.get('user_id')).exists()):
            user = User.objects.filter(id=self.request.session.get('user_id'))[0]
            user.isVisible = request.data['isVisible']
            user.save()
            return Response({'isVisible toggled': 'OK'}, status=status.HTTP_200_OK)
        else:
            return Response({'Something went wrong': 'BAD'}, status=status.HTTP_418_IM_A_TEAPOT)

class SettingsDeleteView(APIView):
    def post(self, request, format=None):
        if(User.objects.filter(id=self.request.session.get('user_id')).exists()):
            user = User.objects.filter(id=self.request.session.get('user_id'))[0]
            self.request.session.flush()
            user.delete()
            return Response({"User deleted and session flushed"}, status=status.HTTP_200_OK)
        else:
            return Response({'Something went wrong': 'BAD'}, status=status.HTTP_418_IM_A_TEAPOT)

############# Logs ######################

class SaveLogView(APIView):
       def post(self, request, format=None):
        print("SaveLogView Triggered!")
        setnr = request.data['set']
        rep = request.data['rep']
        weight = request.data['weight']
        time = request.data['time']
        workoutId = request.data['workoutId']
        workoutSelected = request.data['workoutSelected']
        schduleId = request.data['schduleId']
        exerciseId = request.data['exerciseId']
        today = str(dt.today())[:10]+"%"
        if(time==0):
            time="00:00:00"

        print(today)
        print(setnr)
        print(rep)
        print(weight)
        print(time)
        print(workoutId)
        print(workoutSelected)
        print(schduleId)
        print(exerciseId)


        #if schduled workout exists, log it. otherwise create a schduled workout and then log it 
        if(schduleId != 0):
            print("first if")
            schedule_workout_id = scheduledWorkout.objects.get(id=schduleId)
            log = Log(sets=setnr, reps=rep, weight=weight, time=time, exercise_id=exerciseId, scheduledWorkout_id=schduleId)
            log.save()
        else:
            print("first else")
            schedule_check = scheduledWorkout.objects.raw('select * from api_scheduledworkout as sw inner join api_workout as w on sw.workout_id = w.id where user_id = \'{}\' and w.name = \'{}\' and scheduledDate like \'{}\''.format(self.request.session.get('user_id'), workoutSelected, today))
            print(bool(schedule_check))
            if(bool(schedule_check) == False):
                print("IF***")
                schedule_workout = scheduledWorkout(scheduledDate=dt.today(),user_id=self.request.session.get('user_id'),workout_id=workoutId)
                schedule_workout.save()
                print("schedule_saved***")
                schedule_workout_id = scheduledWorkout.objects.raw('select * from api_scheduledworkout where user_id = \'{}\' and workout_id = \'{}\'  and scheduledDate like \'{}\''.format(self.request.session.get('user_id'), workoutId, today))[0]
                print(schedule_workout_id.id)
                log = Log(sets=setnr, reps=rep, weight=weight, time=time, exercise_id=exerciseId, scheduledWorkout_id=schedule_workout_id.id)
                log.save()
                print("log_saved")
            else:
                print("ELSE***")
                schedule_workout_id = scheduledWorkout.objects.raw('select * from api_scheduledworkout where user_id = \'{}\' and workout_id = \'{}\'  and scheduledDate like \'{}\''.format(self.request.session.get('user_id'), workoutId, today))[0]
                log = Log(sets=setnr, reps=rep, weight=weight, time=time, exercise_id=exerciseId, scheduledWorkout_id=schedule_workout_id.id)
                log.save()

        data = scheduledWorkoutSerializer(schedule_workout_id).data
        print(data)
        return Response(data, status=status.HTTP_200_OK)


class LoadActiveLogsView(APIView):
    def post(self, request, format=None):
        print("LoadActiveLogsView Triggered!")
        schduleId = request.data['schduleId']
        exerciseId = request.data['exerciseId']
        print(schduleId)
        print(exerciseId)

        active_logs = Log.objects.raw('select * from api_log where scheduledWorkout_id = \'{}\' and exercise_id=\'{}\' order by sets desc'.format(schduleId, exerciseId))
        data = LogSerializer(active_logs, many=True).data
        print(data)
        return Response(data, status=status.HTTP_200_OK)


class LoadPreviousLogsView(APIView):
    def post(self, request, format=None):
        print("LoadPreviousLogsView Triggered!")
        exerciseId = request.data['exerciseId']
        print(exerciseId)
        today = str(dt.today())[:10]

        active_logs = Log.objects.raw('select l.id, l.sets, l.reps, l.weight, l.time, l.exercise_id, l.scheduledWorkout_id '
        +'from api_log as l inner join api_scheduledworkout as sw '
        +'on l.scheduledWorkout_id = sw.id '
        +'inner join api_workout_consistsOf as wco '
        +'on wco.workout_id = sw.workout_id '
        +'where sw.scheduledDate  < \'{}\' and user_id = \'{}\' and wco.exercise_id = \'{}\' and l.exercise_id = \'{}\' order by l.sets desc'.format(today, self.request.session.get('user_id'), exerciseId, exerciseId))

        if len(active_logs)>0:
            data = LogSerializer(active_logs, many=True).data
            print(data)
            return Response(data, status=status.HTTP_200_OK) 
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)

#Loads logs for a specific date
class LoadSpecificLogsView(APIView):
    def post(self, request, format=None):
        print("LoadSpecificLogsView Triggered!")
        workoutName = request.data['workoutName']
        date = request.data['date'] + "%"
        print("x:" + workoutName+ ":x")
        print("x:" + date + ":x")
        print("x:" + str(self.request.session.get('user_id'))+":x")

        active_logs = Log.objects.raw('select e.name, l.id, l.sets, l.reps, l.weight, l.time, l.exercise_id, l.scheduledWorkout_id '
        +'from api_log  as l inner join api_scheduledworkout as sw '
        +'on l.scheduledWorkout_id = sw.id '
        +'inner join api_exercise as e on e.id = l.exercise_id '
        +'inner join api_workout as w on w.id = sw.workout_id '
        +'where sw.scheduledDate like \'{}\' and sw.user_id = \'{}\' and w.name = \'{}\' order by e.name, sets desc'.format(date, self.request.session.get('user_id'), workoutName))
        
        for log in active_logs:
            print(log.name)

        if len(active_logs)>0:
            data = LogExtraSerializer(active_logs, many=True).data
            print(data)
            return Response(data, status=status.HTTP_200_OK) 
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class GetClientView(APIView):
    def get(self, request, format=None):
        print("GetClientView Triggered!")
        #coach = request.GET.get(self.lookup_url_kwarg)
        
        query_set = User.objects.raw('select u.id, u.fname, u.lname from api_coachhasclient as chc '
        +'inner join api_user as u on chc.user_id = u.id '
        +'where chc.coach_id = \'{}\''.format(self.request.session.get('user_id')))
    
        if len(query_set)>0:
            data = UserSerializer(query_set, many=True).data
            #print(data)
            return Response(data, status=status.HTTP_200_OK) 
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class GetAllWorkoutView(APIView):
    def get(self, request, format=None):
        print("GetAllWorkoutView Triggered!")
      
        queryset1 = Workout.objects.raw('select * from api_workout where active = 1 and shared = 1')

        queryset2 = Workout.objects.raw('select w.id, w.name, w.description, w.active, w.shared from api_user_hasWorkouts as uhw '
        +'inner join api_workout as w on uhw.workout_id = w.id where uhw.user_id = \'{}\' and active =1'.format(self.request.session.get('user_id')))

        result_list = list(chain(queryset1, queryset2))

        if len(result_list)>0:
            data = WorkoutSerializer(result_list, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)



class GetFriendsView(APIView):
    def get(self, request, format=None):
        #exercise_type = request.GET.get(self.lookup_url_kwarg)
        print("****GetFriendsView Triggered!")

        #finds all rows with your id in api_friends
        queryset1 = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' or user2_id = \'{}\') and verified = 1'.format(self.request.session.get('user_id'), self.request.session.get('user_id')))
        
        #creates a list of the ids that arent yours
        friend_list = []
        for person in queryset1:
            if(person.user1_id == self.request.session.get('user_id')):
                friend_list.append(person.user2_id)
            else:
                friend_list.append(person.user1_id)

        queryset2 = User.objects.filter(id__in = friend_list)
        
        if len(queryset2)>0:
            data = UserSerializer(queryset2, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)



class GetFriendWorkoutView(APIView):
    lookup_url_kwarg = 'user'
    def get(self, request, format=None):
        print("GetFriendWorkoutView Triggered!")
        user = request.GET.get(self.lookup_url_kwarg)
        print("friend: " + str(user))

        queryset = Workout.objects.raw('select w.id, w.name, w.description, w.active, w.shared from api_user_hasWorkouts as uhw '
        +'inner join api_workout as w on uhw.workout_id = w.id where uhw.user_id = \'{}\' and active =1'.format(user))
        print(queryset)

        if len(queryset)>0:
            data = WorkoutSerializer(queryset, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)



class CopyFriendWorkoutView(APIView):
      def post(self, request, format=None):
        print("CopyFriendWorkoutView Triggered!")
   
        name = request.data['workoutName']
        print(name)
        user = request.data['user']
        print(user)
        #active=True

        queryset_workout_desc = Workout.objects.raw('select * from api_workout as w '
        +'inner join api_user_hasWorkouts as uhw on w.id = uhw.workout_id '
        +'where w.name= \'{}\' and user_id = \'{}\' and w.active = true'.format(name, user))


     

        consistsOf = 'wtf'
        workout = Workout(name=name, description=queryset_workout_desc[0].description, active=True, shared=False)
        workout.save()
        
        #Finds user and creates user_hasWorkout - mtm
        user_id = self.request.session.get('user_id')   
        print("user_id: " + str(user_id))    
        user_has_workout = User.objects.get(id=user_id)
        print("user_has_workout: " + str(user_has_workout))  
        user_has_workout.hasWorkouts.add(workout)


        #Find all exercises that the user picked. Finds the specific exercise object and creates mtm with workout
        for exercise in request.data['exercises_list']:
            queryset = Exercise.objects.raw('select e.id, e.name, e.type_id from api_exercise as e where name = \'{}\' limit 1'.format(exercise))
            #var_type = queryset[0].type_id
            var_name = queryset[0].name

            exercise = Exercise.objects.get(name=var_name)
            print(exercise.name)
            workout.consistsOf.add(exercise)
            workout.save()
            print(workout)
        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        #return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)



class GetFriendInfoView(APIView):
    lookup_url_kwarg = 'user'
    def get(self, request, format=None):
        user = request.GET.get(self.lookup_url_kwarg)
        print("friend: " + str(user))
        queryset = User.objects.raw('select * from api_user where id = \'{}\''.format(user))
        
        if len(queryset)>0:
            data = UserSerializer(queryset[0]).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class GetPendingFriendView(APIView):
    def get(self, request, format=None):
        #exercise_type = request.GET.get(self.lookup_url_kwarg)
        print("****GetPendingFriendView Triggered!")

        #finds all rows with your id in api_friends
        queryset1 = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' or user2_id = \'{}\') and verified = 0'.format(self.request.session.get('user_id'), self.request.session.get('user_id')))
        
        #creates a list of the ids that arent yours
        friend_list = []
        for person in queryset1:
            if(person.user1_id == self.request.session.get('user_id')):
                friend_list.append(person.user2_id)
            else:
                friend_list.append(person.user1_id)

        queryset2 = User.objects.filter(id__in = friend_list)
        
        if len(queryset2)>0:
            data = UserSerializer(queryset2, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


class CreatePendingFriendView(APIView):
    lookup_url_kwarg = 'user'
    def post(self, request, format=None):
        print("****RequestingFriendRequestView Triggered!")
        print("accepting user: " + str(user))

        queryset = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' and user2_id =\'{}\') or (user1_id = \'{}\'  and user2_id =\'{}\') and verified = 0'.format(self.request.session.get('user_id'), user, user, self.request.session.get('user_id')))

        print(queryset)
        print("accepting row: " + str(queryset[0].id))

        friend = Friends.objects.get(id = queryset[0].id)
        friend.verified = True
        friend.save()
        return Response({'Friend Accepted': 'OK'}, status=status.HTTP_200_OK)   


class DenyPendingFriendView(APIView):
    lookup_url_kwarg = 'user'
    def get(self, request, format=None):
        print("****DenyPendingFriend Triggered!")
        user = request.GET.get(self.lookup_url_kwarg)
        print("denying user: " + str(user))
        queryset = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' and user2_id =\'{}\') or (user1_id = \'{}\'  and user2_id =\'{}\') and verified = 0'.format(self.request.session.get('user_id'), user, user, self.request.session.get('user_id')))

        print(queryset)
        print("deleteing row: " + str(queryset[0].id))

        Friends.objects.filter(id = queryset[0].id).delete()
        return Response({'Friend Denied': 'OK'}, status=status.HTTP_200_OK)   

class AcceptPendingFriendView(APIView):
    lookup_url_kwarg = 'user'
    def get(self, request, format=None):
        print("****AcceptPendingFriendView Triggered!")
        user = request.GET.get(self.lookup_url_kwarg)
        print("accepting user: " + str(user))

        queryset = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' and user2_id =\'{}\') or (user1_id = \'{}\'  and user2_id =\'{}\') and verified = 0'.format(self.request.session.get('user_id'), user, user, self.request.session.get('user_id')))

        print(queryset)
        print("accepting row: " + str(queryset[0].id))

        friend = Friends.objects.get(id = queryset[0].id)
        friend.verified = True
        friend.save()
        return Response({'Friend Accepted': 'OK'}, status=status.HTTP_200_OK)   

class DeleteFriendView(APIView):
    lookup_url_kwarg = 'user'
    def get(self, request, format=None):
        print("****DenyPendingFriend Triggered!")
        user = request.GET.get(self.lookup_url_kwarg)
        print("deleteing user: " + str(user))

        queryset = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' and user2_id =\'{}\') or (user1_id = \'{}\' and user2_id =\'{}\') and verified = 1'.format(self.request.session.get('user_id'), user, user, self.request.session.get('user_id')))

        print(queryset)
        print("deleteing row: " + str(queryset[0].id))

        Friends.objects.filter(id = queryset[0].id).delete()
        return Response({'Friend Deleted': 'OK'}, status=status.HTTP_200_OK)   



class SocialFindFriends(APIView):

    def get(self, request, format=None):
        print("****SocialFindFriendsEmail Triggered!")
        queryset1 = Friends.objects.raw('select * from api_friends where (user1_id = \'{}\' or user2_id = \'{}\')'.format(self.request.session.get('user_id'), self.request.session.get('user_id')))
        
        friend_list = []
        for person in queryset1:
            if(person.user1_id == self.request.session.get('user_id')):
                friend_list.append(person.user2_id)
            else:
                friend_list.append(person.user1_id)
        friend_list.append(self.request.session.get('user_id'))

        queryset2 = User.objects.raw('select * from api_user where isVisible == 1 and id not in \'{}\''.format(self.request.session.get('user_id')))
        queryset2 = User.objects.exclude(id__in = friend_list)

    
        if len(queryset2)>0:
            data = UserSerializer(queryset2, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request, format=None):
        print("****SocialFindFriendsEmail-Request Triggered!")

        email = request.data['data']
        print(email)
        print(type(email))
        query = User.objects.filter(email = email['email'])

        print(query)

        if(len(query)>0): 
            query2 = User.objects.raw('select * from api_friends where (user1_id = \'{}\' and user2_id =\'{}\') or (user1_id = \'{}\' and user2_id =\'{}\')'.format(self.request.session.get('user_id'), query[0].id, query[0].id, self.request.session.get('user_id')))
            if(len(query2)>0): 
                return Response({'Cannot Add User': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
            else: 
                print(query2)
                friend = Friends(verified=False, user1_id = self.request.session.get('user_id'), user2_id = query[0].id) 
                print(friend)
                friend.save()
                return Response({'Friend Request Sent': 'OK'}, status=status.HTTP_200_OK)   
        return Response({'Cannot Add User': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class SocialFindFriendsEmail(APIView):
    def post(self, request, format=None):
        print("****SocialFindFriendsEmail-SEND___Request Triggered!")

        email = request.data['data']
        
        print("\n")
        print(email)
        print("\n")

        s = "email': 'elin@gmail.com'"
        pattern = "email\': \'(.*?)\'"
        print('\n\npattern: ')
        print(pattern)


        email = re.search(pattern, str(email)).group(1)
        print('\nemail: ')
        print(email)
        print("\n")
        
        query = User.objects.filter(email = email)
        print(query)

        if(len(query)>0): 
            query2 = User.objects.raw('select * from api_friends where (user1_id = \'{}\' and user2_id =\'{}\') or (user1_id = \'{}\' and user2_id =\'{}\')'.format(self.request.session.get('user_id'), query[0].id, query[0].id, self.request.session.get('user_id')))
            if(len(query2)>0): 
                return Response({'Cannot Add User': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
            else: 
                print(query2)
                friend = Friends(verified=False, user1_id = self.request.session.get('user_id'), user2_id = query[0].id) 
                print(friend)
                friend.save()
                return Response({'Friend Request Sent': 'OK'}, status=status.HTTP_200_OK)   
        return Response({'Cannot Add User': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
        

class SocialFindFriendsVisible(APIView):
    def get(self, request, format=None):
        print("\n\SocialFindFriendsEmail-SEND_REQUEST Triggered!\n\n")
        
        user = self.request.session.get('user_id')
        queryset = User.objects.raw('select * from api_user where isVisible == 1 and id != \'{}\' and roleid_id == 2'.format(user))

        if len(queryset)>0:
            data = UserSerializer(queryset, many=True).data
            return Response(data, status=status.HTTP_200_OK) 
        return Response({'User FOUND': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)

class ListUnassignedClients(APIView):
    def get(self, request, format=None):
        #print("ListUnassignedClients Triggered!")
        coachId = self.request.session.get('user_id')
        role= User.objects.filter(id=coachId)[0]
        if(role.roleid.description=='Coach'):    
            queryset = User.objects.raw(
            'SELECT * FROM api_user WHERE roleid_id=2 AND id NOT IN (SELECT user_id FROM api_coachhasclient)')
            if len(queryset)>0:
                data = UserSerializer(queryset, many=True).data
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)

class AssignClientToCoach(APIView):
    def post(self, request, format=None):
        #TODO: Check if session user is coach
        #TODO: 2. Update table
        coachId = self.request.session.get('user_id')
        clientId = request.data['userId']
        ClientUser=User.objects.filter(id=clientId)[0]
        CoachUser=User.objects.filter(id=coachId)[0]
        CoachClientLink = CoachHasClient(user=ClientUser,coach=CoachUser)
        CoachClientLink.save()
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_200_OK)
        

class RemoveClientFromCoach(APIView):
    def post(self,request,format=None):
        #TODO: 1. Check if session user is coach
        #TODO: 2. Update table
        coachId = self.request.session.get('user_id')
        clientId = request.data['userId']
        ClientUser=User.objects.filter(id=clientId)[0]
        CoachUser=User.objects.filter(id=coachId)[0]
        CoachHasClient.objects.filter(user=ClientUser,coach=CoachUser).delete()
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_200_OK)

class GetDashboardData(APIView):
    def get(self, request, format=None):
        with connection.cursor() as cursor:
            user_id = self.request.session.get('user_id')
            start_date = dt.now() + timedelta(days=-7)
            end_date = dt.now()
            data = []

            get_total_weights_lifted_last_7_days = f'select SUM(l.reps*l.weight) as totalWeight from api_log l where l.scheduledWorkout_id IN (select s.id from api_scheduledWorkout s where s.user_id = {user_id} and s.scheduledDate BETWEEN "{start_date}" AND "{end_date}")'
            cursor.execute(get_total_weights_lifted_last_7_days)
            data.append(cursor.fetchone())

            get_total_reps_last_7_days = f'select SUM(l.reps) as totalReps from api_log l where l.scheduledWorkout_id IN (select s.id from api_scheduledWorkout s where s.user_id = {user_id} and s.scheduledDate BETWEEN "{start_date}" AND "{end_date}")'
            cursor.execute(get_total_reps_last_7_days)
            data.append(cursor.fetchone())

            get_max_lift_last_7_days = f'select MAX(l.weight) as maxWeight from api_log l where l.scheduledWorkout_id IN (select s.id from api_scheduledWorkout s where s.user_id = {user_id} and s.scheduledDate BETWEEN "{start_date}" AND "{end_date}")'
            cursor.execute(get_max_lift_last_7_days)
            data.append(cursor.fetchone())

            get_total_workouts_last_7_days = f'select Count(*) as totalWorkouts from api_scheduledWorkout where user_id = {user_id} and scheduledDate BETWEEN "{start_date}" AND "{end_date}"'
            cursor.execute(get_total_workouts_last_7_days)
            data.append(cursor.fetchone())

            for i in range(len(data)):
                if "None" in str(data[i]):
                    data[i] = "0"

            print(data)
        return Response(data, status=status.HTTP_200_OK)
        
        
        
        
