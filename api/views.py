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
from .serializers import UserSerializer, ExerciseSerializer
from .models import Role, User, Exercise, ExerciseType, Workout
from .hashUtils import compare_pw_hash, create_pw_hash, create_salt
import io
from rest_framework.parsers import JSONParser
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
        if (User.objects.filter(email = data['email'])):
            return Response({'User already exists': 'BAD'}, status=status.HTTP_226_IM_USED)
        else:
            new_salt = create_salt()
            new_password = create_pw_hash(data['password'], new_salt)
            u = User(fname = data['fname'],
            lname = data['lname'],
            email = data['email'],
            salt = new_salt,
            pwhash = new_password,
            roleid = Role.objects.filter(description = 'Unauthorized')[0])
            u.save()
            self.request.session.create()
            return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)


class LoginUserView(generics.ListAPIView):
    lookup_url_kwarg = 'email'

    def get(self, request, format=None):
        # print("In LoginUserView!")
        # queryset = User.objects.raw('SELECT * FROM api_user')
        queryset = User.objects.all()
        urlfield = request.GET.get(self.lookup_url_kwarg)
        # Här har vi emailen som en liten, fin string.

        emailstring = urlfield.split("?")[0]
        # Här har vi lösenordet som en lite, ännu finare string.
        pw = urlfield.split("=")[1]
        salt = ''
        pwhash = ''
        # Bear with me
        for p in User.objects.raw('SELECT * FROM api_user'):
            if(p.email == emailstring):
                salt = p.salt
                pwhash = p.pwhash
                roleId = p.roleid_id
                fname = p.fname
                lname = p.lname
                break
        # Efter det här så har vi två fina strings med salt och hash från databasen.
        # Shoutout till Padron

        isCorrect = compare_pw_hash(pw, salt, pwhash)

        print(isCorrect)
        if(isCorrect):
            self.request.session.create() #Ta bort kommentaren om du vill att toolbaren ska hänga med
            self.request.session['role_id'] = roleId
            self.request.session['first_name'] = fname
            self.request.session['last_name'] = lname


            return Response({'Login OK'}, status=status.HTTP_200_OK)
        else:
            return Response({'Login NOT OK'}, status=status.HTTP_401_UNAUTHORIZED)

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
    #serializer_class = CreateWorkoutInfoSerializer;

    def post(self, request, format=None):
        print("CreateWorkoutView Triggered!")
        #print(request.data['workoutName'])
        #print(request.data['workoutDesc'])
        #Creates workout
        name = request.data['workoutName']
        description = request.data['workoutDesc']
        active=True
        shared=False
        consistsOf = 'wtf'
        workout = Workout(name=name, description=description, active=True, shared=False)
        workout.save()
        
        #Finds user and creates user_hasWorkout - mtm
        #user_id = self.request.session.get('user_id')       
        #user_has_workout = User.objects.get(id=user_id)
        #user_has_workout.consistsOf.add(exercise)

        #Find all exercises that the user picked. Finds the specific exercise object and creates mtm with workout
        for exercise in request.data['exercises_list']:
            queryset = Exercise.objects.raw('select e.id, e.name, e.type_id from api_exercise as e where name = \'{}\' limit 1'.format(exercise))
            #var_type = queryset[0].type_id
            var_name = queryset[0].name

            exercise = Exercise.objects.get(name=var_name)
            print(exercise)
            workout.consistsOf.add(exercise)
            print(workout)
        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)
        #return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

