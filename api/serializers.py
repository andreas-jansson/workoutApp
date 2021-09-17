from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ('id', 'fname', 'lname', 'email', 'pwhash', 'salt', 'roleid', 'created')