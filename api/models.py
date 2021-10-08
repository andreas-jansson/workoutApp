from django.db import models
from django.db.models.constraints import UniqueConstraint
from django.db.models.deletion import CASCADE, PROTECT
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Role(models.Model):
    description = models.CharField(max_length=50, null=False, unique=True)

class ExerciseType(models.Model):
    type = models.CharField(max_length=50, unique=True)

class Exercise(models.Model):
    name = models.CharField(max_length=50, unique=True)
    type = models.ForeignKey(ExerciseType, null=False, on_delete=PROTECT)

class Workout(models.Model):
    name = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    shared = models.BooleanField(default=True)
    consistsOf = models.ManyToManyField(Exercise, blank=True)

class User(models.Model):
    fname = models.CharField(max_length=50, null=False)
    lname = models.CharField(max_length=50, null=False)
    email = models.CharField(max_length=75, null=False, unique=True)
    pwhash = models.CharField(max_length=100, null=False)
    salt = models.CharField(max_length=100, null=True)
    roleid = models.ForeignKey(Role, null=False, on_delete=PROTECT)
    created = models.DateTimeField(auto_now_add=True)
    hasWorkouts = models.ManyToManyField(Workout, blank=True)
    isVisible = models.BooleanField(default=False)

class scheduledWorkout(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=PROTECT)
    workout = models.ForeignKey(Workout, null=False, on_delete=PROTECT)
    scheduledDate = models.DateTimeField(null=False)

class Log(models.Model):
    sets = models.IntegerField()
    reps = models.IntegerField()
    weight = models.IntegerField()
    time = models.TimeField()
    scheduledWorkout = models.ForeignKey(scheduledWorkout, null=False, on_delete=PROTECT)
    exercise = models.ForeignKey(Exercise, null=False, on_delete=PROTECT)

class Friends(models.Model):
    class Meta:
        UniqueConstraint(fields = ['user1', 'user2'], name = 'Friend_Relation')

    user1 = models.ForeignKey(User, null=False, related_name='user1', on_delete=PROTECT)
    user2 = models.ForeignKey(User, null=False, related_name='user2', on_delete=PROTECT)
    verified = models.BooleanField(default = False)

class CoachHasClient(models.Model):
    class Meta:
        UniqueConstraint(fields = ['user', 'coach'], name = 'Coach_Coaches_User')
    user = models.ForeignKey(User, null=False, related_name='user', on_delete=PROTECT)
    coach = models.ForeignKey(User, null=False, related_name='coach', on_delete=PROTECT)
