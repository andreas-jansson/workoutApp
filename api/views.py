from codecs import lookup
from django import http
from django.conf.urls import url
from django.db.models import query
from django.shortcuts import render
from django.views.generic.base import RedirectView
from rest_framework import generics, serializers, status
from rest_framework import response
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import UserSerializer, ExerciseSerializer, WorkoutSerializer, UserSerializerPending, RoleSerializer, scheduledWorkoutSerializer
from .models import Role, User, Exercise, ExerciseType, Workout, scheduledWorkout
from .hashUtils import compare_pw_hash, create_pw_hash, create_salt
from .userUtils import email_is_registered
import io
from rest_framework.parsers import JSONParser
from datetime import date
from datetime import datetime as dt
import datetime
import calendar
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
            return Response({'fname' : fname, 'role_id' : role_id}, status=status.HTTP_202_ACCEPTED)
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
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        if (email_is_registered(data['email'])):
            print("if")
            return Response({'User already exists': 'BAD'}, status=status.HTTP_226_IM_USED)
        else:
            print("else")
            new_salt = create_salt()
            hashed_password = create_pw_hash(data['password'], new_salt)
            new_user = User(fname = data['fname'],
            lname = data['lname'],
            email = data['email'],
            salt = new_salt,
            pwhash = hashed_password,
            roleid = Role.objects.filter(description = 'Unauthorized')[0])
            print("roleid")
            new_user.save()
            print("save")
            self.request.session.create()
            return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)


class RegisterCoachView(APIView):
    def post(self, request, format=None):
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        if (email_is_registered(data['email'])):
            print("if")
            return Response({'User already exists': 'BAD'}, status=status.HTTP_226_IM_USED)
        else:
            print("else")
            new_salt = create_salt()
            hashed_password = create_pw_hash(data['password'], new_salt)
            new_user = User(fname = data['fname'],
            lname = data['lname'],
            email = data['email'],
            salt = new_salt,
            pwhash = hashed_password,
            roleid = Role.objects.filter(description = data['role'])[0]) # Role.objects.filter(description = 'Coach')[0] ,,,role
            print("roleid")
            new_user.save()
            print("save")
            self.request.session.create()
            return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)


class LoginUserView(generics.ListAPIView):
    def post(self, request, format=None):
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        if (email_is_registered(data['email'])):
            user = User.objects.filter(email = data['email'])[0]
            if(compare_pw_hash(data['password'], user.salt, user.pwhash)):
                self.request.session.create()
                self.request.session['user_id'] = user.id
                self.request.session['first_name'] = user.fname
                self.request.session['role_id'] = user.roleid_id
                return Response({'Login OK'}, status=status.HTTP_200_OK)
        return Response({'Invalid Email Or Password'}, status=status.HTTP_401_UNAUTHORIZED)


# Recieves exercise type and returns all exercises 
class GetExercisesView(generics.ListAPIView):
    lookup_url_kwarg = 'type'
    def get(self, request, format=None):
        exercise_type = request.GET.get(self.lookup_url_kwarg)
        print("GetExercisesView Triggered!")
        print(exercise_type)
        if exercise_type != None:
            queryset = Exercise.objects.raw('select e.id, e.name from api_exercisetype as et join api_exercise as e on et.id = e.type_id where et.type = \'{}\''.format(exercise_type))
            if len(queryset)>0:
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
        active=True

        #checks if user or higher role. users workouts are private
        if(self.request.session.get('role_id') == 2):
            shared=False
        else:
            shared=True

        consistsOf = 'wtf'
        workout = Workout(name=name, description=description, active=True, shared=shared)
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



class CreateExerciseView(APIView):
    #serializer_class = CreateWorkoutInfoSerializer;

    def post(self, request, format=None):
        print("CreateExerciseView Triggered!")      
        name = request.data['exerciseName']
        type_id= request.data['exerciseType']

        exercise_type = ExerciseType.objects.get(type=type_id)
        print(exercise_type)

        exercise = Exercise(name=name, type_id = exercise_type.id)
        exercise.save()
        print(exercise)
        
    

        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        #return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class GetWorkoutView(APIView):
    def get(self, request, format=None):
        print("GetWorkoutView Triggered!")
        queryset = Workout.objects.raw('select * from api_user_hasWorkouts as uhw '
        +'inner join api_workout as w on uhw.workout_id = w.id where uhw.user_id = \'{}\' and active =1'.format(self.request.session.get('user_id')))
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
        queryset = Workout.objects.raw('select e.id, e.name, e.type_id from api_user_hasWorkouts as uhw '
        +'inner join api_workout as w on uhw.workout_id = w.id '
        +'inner join api_workout_consistsOf as wco on wco.workout_id = uhw.workout_id '
        +'inner join api_exercise as e on e.id = wco.exercise_id '
        +'where uhw.user_id = \'{}\' and  active = 1  and w.name = \'{}\''.format(self.request.session.get('user_id'), name))
        
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

        #finds the ID of the excercise that is active and belongs to this user
        query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w '
        +'inner join api_user_hasWorkouts as uhw '
        +'on w.id = uhw.workout_id inner join api_user as u '
        +'on uhw.user_id = u.id where u.id = \'{}\' and w.name = \'{}\' and w.active = 1'.format(self.request.session.get('user_id') , name))

        print(query_workout[0].id)

        #updates old workout to inactive
        workout = Workout.objects.get(id=query_workout[0].id)
        workout.active=0
        workout.save()

        if(self.request.session.get('role_id') == 2):
            shared=False
        else:
            shared=True

        workout_new = Workout(name=name, description=query_workout[0].description, active=True, shared=shared)
        workout_new.save()
      
        
        #Finds user and creates user_hasWorkout - mtm
        user_id = self.request.session.get('user_id')   
        print("user_id: " + str(user_id))    
        user_has_workout = User.objects.get(id=user_id)
        print("user_has_workout: " + str(user_has_workout))  
        user_has_workout.hasWorkouts.add(workout_new)


        #Find all exercises that the user picked. Finds the specific exercise object and creates mtm with workout
        for exercise in request.data['exercises_list']:
            queryset = Exercise.objects.raw('select e.id, e.name, e.type_id from api_exercise as ' 
            +'e where name = \'{}\' limit 1'.format(exercise))
            #var_type = queryset[0].type_id
            var_name = queryset[0].name

            exercise = Exercise.objects.get(name=var_name)
            print(exercise.name)
            workout_new.consistsOf.add(exercise)
            print(workout_new)
        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        #return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)



class DeleteWorkoutView(APIView):
    def post(self, request, format=None):
        print("DeleteWorkoutView Triggered!")
        name = request.data['workoutName']

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
        user_list = User.objects.filter(roleid = Role.objects.filter(description = 'Unauthorized')[0])
        serialized_users = UserSerializerPending(user_list, many=True).data
        print(serialized_users)
        return Response(serialized_users, status=status.HTTP_200_OK)


class DenyPendingUsers(APIView):
    def post(self, request, format=None):
        user_id = request.data['id']
        User.objects.filter(id = user_id).delete()
        return Response({'User denied': 'OK'}, status=status.HTTP_200_OK)   


class ApprovePendingUsers(APIView):
    def post(self, request, format=None):
        user_id = request.data['id']
        approvedUser = User.objects.get(id = user_id)
        approvedUser.roleid = Role.objects.filter(description = 'Client')[0]
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
        if(restWeek ==''): #just in case
            restWeek = 0
        else:
            restWeek = int(restWeek)
        
        name = request.data['workoutName']


        start_yyyy=int(dateStart[0:4])
        start_mm=int(dateStart[5:7])
        start_dd=int(dateStart[8:])

        end_yyyy=int(dateEnd[0:4])
        end_mm=int(dateEnd[5:7])
        end_dd=int(dateEnd[8:])

        start = date(start_yyyy, start_mm, start_dd)
        end = date(end_yyyy, end_mm, end_dd)

        delta = end - start

        start_week = date(start_yyyy, start_mm, start_dd).isocalendar()[1]
        print(start_week)
        week = start_week

        #returns rest_weeks_list
        rest_weeks_list = []
        flag = True
        counter = 1
        for days in range(int(delta.days)+1):
            current = start + datetime.timedelta(days=days)
            #print("current: " + str(current))
            current_yyyy = current.year
            current_mm = current.month
            current_dd = current.day
            current_week = datetime.date(current_yyyy, current_mm, current_dd).isocalendar()[1]
            #print("current week: " + str(current_week))

            if(week == start_week and flag == True and restWeek >= 2):
                flag = False
                counter = counter + 1 
                print(str(counter) + " " + str(current) + " week: " + str(week))

            
            if (week != current_week):
                week = current_week
                print("comparing counter: " + str(counter) + " == " + str(restWeek) + " Rest Week")
                if(counter == restWeek):
                    counter = 1
                    print(str(counter) + " " + str(current) + " week: " + str(week) + " Rest Week")
                    rest_weeks_list.append(week)
                else:
                    print(str(counter) + " " + str(current) + " week: " + str(week))
                    counter = counter + 1



        #find correct workout id
        query_workout = Exercise.objects.raw('select w.id, w.description from api_workout as w '
        +'inner join api_user_hasWorkouts as uhw '
        +'on w.id = uhw.workout_id inner join api_user as u '
        +'on uhw.user_id = u.id where u.id = \'{}\' and w.name = \'{}\' and w.active = 1'.format(self.request.session.get('user_id') , name))
        #print(query_workout[0].id)

        print(rest_weeks_list)
        print(delta.days)
        for days in range(int(delta.days+1)):
            current = start + datetime.timedelta(days=days)
            current_yyyy = current.year
            current_mm = current.month
            current_dd = current.day
            current_week = datetime.date(current_yyyy, current_mm, current_dd).isocalendar()[1]
            if(current_week not in rest_weeks_list):
                if(current.strftime("%A") == "Monday" and monday == True):
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                elif(current.strftime("%A") == "Tuesday" and tuesday == True):
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
                elif(current.strftime("%A") == "Wednesday" and wednesday == True):
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
                elif(current.strftime("%A") == "Thursday" and thursday == True):
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
                elif(current.strftime("%A") == "Friday" and friday == True):
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
                elif(current.strftime("%A") == "Saturday" and saturday == True):
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
                elif(current.strftime("%A") == "Sunday" and sunday == True):
                    scheduled = scheduledWorkout(scheduledDate=current, user_id=self.request.session.get('user_id'), workout_id=query_workout[0].id)
                    scheduled.save()
                    print(str(current.strftime("%A")) + " " + str(current) + " adding" )
            

        #hitta rätt workout id för denna kund baserat på userid och workout namn
        #beräkna vilken vecka som går bort baserat på restweek

        #beräkna antal dagar mellan start och slutdatum
        #loopa igenom alla dagar
            #kolla om veckan är skippveckan
                #kolla datument för varje dag och jämför om vår dag(mon,tue etc) är true
                    #om true så sparas datum, workout id och user id 
        
        return Response({'User approved': 'OK'}, status=status.HTTP_200_OK)


class GetScheduledWorkoutsView(APIView):
    def get(self, request, format=None):
        print("******GetScheduledWorkoutsView Triggered!****")
        first_day_of_month = str(dt.today().replace(day=1))
        print(first_day_of_month[:10])

        yyyy = int(first_day_of_month[0:4])
        mm = int(first_day_of_month[5:7])
        print(yyyy)
        print(mm)
        days_in_month = calendar.monthrange(yyyy, mm)[1]
        last_day_of_month = str(dt.today().replace(day=days_in_month))
        print(last_day_of_month)



        queryset = scheduledWorkout.objects.raw('select * from api_scheduledworkout '
        +'where user_id = \'{}\' and scheduledDate >= \'{}\' and scheduledDate <= \'{}\' order by scheduledDate'.format(self.request.session.get('user_id'), first_day_of_month, last_day_of_month))
        if len(queryset)>0:
            data = scheduledWorkoutSerializer(queryset, many=True).data
            print(data)                    
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)


    
########### USER MANAGEMENT [TABLE]  #################################
class GetUserView(APIView):
    def get(self, request, format=None):
        print("GetUserView Triggered!")
        queryset = User.objects.raw('select * from api_user')

        #for i in range(len(queryset)):
            #print('\nID:',queryset[i].id,'\nFname:',queryset[i].fname,'\nLname:',queryset[i].lname,'\nEmail:',queryset[i].email,'\nCreated:',queryset[i].created,'\nWorkouts?:',queryset[i].hasWorkouts,'\n\n')
            #print(queryset[i])
        
        if len(queryset)>0:
            data = UserSerializer(queryset, many=True).data
            return Response(data, status=status.HTTP_200_OK) 
        return Response({'Not Found': 'Code parameter not found in request'}, status=status.HTTP_404_NOT_FOUND)

class UpdateUserView(APIView):
    
    def post(self, request, format=None):
        print("UpdateUserView Triggered!")

        #finds the ID of the modifed User
        query = User.objects.raw('select * from api_user where id= \'{p}\'')

        print(query[0].id)

        #updates old User to inactive
        user = User.objects.get(id=query[0].id)
        user.active=0
        user.save()

        user_new = User(roleid=roleid, id=id, fname=fname, lname=lname, email=email)
        user_new.save()
        return Response({'User Updated': 'OK'}, status=status.HTTP_200_OK)

class DeleteUserView(APIView):
    def post(self, request, format=None):
        print("DeleteUserView Triggered!")
        query = User.objects.get('select * from api_user where id= \'{pk}\'')

        print(query[0].id)
        user_id = request.data['id']
        user = User.objects.filter(id = user_id).delete()
        user.delete()     
        return Response({'User Deleted': 'OK'}, status=status.HTTP_200_OK)
#############################################################################
