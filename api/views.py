from django.shortcuts import render
from rest_framework import generics, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import UserSerializer
from .models import Role, User
from .hashUtils import compare_pw_hash, create_pw_hash, create_salt
import io
from rest_framework.parsers import JSONParser
# Create your views here.


class UserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class SessionExistView(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None):
        self.request.session.create()
        #request.session['user-id'] = 420
        #print("**** sessionID: " +  str(request.session['user-id']))
        # serializer = self.serializer_class(data=request.data)

        if self.request.session.exists(self.request.session.session_key):
            print("**** session Exist ****")
            return Response({'User Exist': 'Redirect'}, status=status.HTTP_202_ACCEPTED)
        print("**** session Missing ****")
        return Response({'User New': 'Stay'}, status=status.HTTP_200_OK)
        

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
        print(self.request.body.decode())
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        if (User.objects.filter(email = data['email'])):
            return Response({'User already exists': 'BAD'}, status=status.HTTP_226_IM_USED)
        u = User(fname = data['fname'],
        lname = data['lname'],
        email = data['email'],
        pwhash = data['password'],
        roleid = Role.objects.filter(description = 'Unauthorized')[0])
        u.save()
        self.request.session.create()
        return Response({'User registered': 'OK'}, status=status.HTTP_200_OK)