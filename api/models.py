from django.db import models
from django.db.models.deletion import CASCADE, PROTECT
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Role(models.Model):
    description = models.CharField(max_length=50, null=False)

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
    consistsOf = models.ManyToManyField(Exercise)

class User(models.Model):
    fname = models.CharField(max_length=50, null=False)
    lname = models.CharField(max_length=50, null=False)
    email = models.CharField(max_length=75, null=False)
    pwhash = models.CharField(max_length=100, null=False)
    salt = models.CharField(max_length=100, null=True)
    roleid = models.ForeignKey(Role, null=False, on_delete=PROTECT)
    created = models.DateTimeField(auto_now_add=True)
    hasWorkouts = models.ManyToManyField(Workout)

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