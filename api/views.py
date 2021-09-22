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
        # self.request.session.create()
        # request.session['user-id'] = 420
        # print("**** sessionID: " +  str(request.session['user-id']))
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
        customRole = Role()
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        u = User(fname=data['fname'],
                 lname=data['lname'],
                 email=data['email'],
                 pwhash=data['password'],
                 roleid=Role.objects.filter(description='Unauthorized')[0])
        u.save()
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
                break
        # Efter det här så har vi två fina strings med salt och hash från databasen.
        # Shoutout till Padron

        isCorrect = compare_pw_hash(pw, salt, pwhash)

        print(isCorrect)
        if(isCorrect):
            #self.request.session.create() #Ta bort kommentaren om du vill att toolbaren ska hänga med
            return Response({'Login OK'}, status=status.HTTP_200_OK)
        else:
            return Response({'Login NOT OK'}, status=status.HTTP_401_UNAUTHORIZED)

