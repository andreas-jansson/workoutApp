from rest_framework import serializers
from .models import Role, ExerciseType, Exercise, Workout, \
    User, scheduledWorkout, Log 

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ('id', 'fname', 'lname', 'email', 'pwhash', 'salt', 'roleid', 'created')


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class ExerciseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseType
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'


class scheduledWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = scheduledWorkout
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'