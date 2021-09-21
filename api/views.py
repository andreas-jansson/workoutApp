from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import UserSerializer
from .models import User
from .hashUtils import compare_pw_hash, create_pw_hash, create_salt
# Create your views here.


class UserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class SessionExistView(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None):
        #self.request.session.create()
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
