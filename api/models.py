from django.db import models

# Create your models here.


class User(models.Model):
    fname = models.CharField(max_length=50, null=False)
    lname = models.CharField(max_length=50, null=False)
    email = models.CharField(max_length=75, null=False)
    pwhash = models.CharField(max_length=100, null=False)
    salt = models.CharField(max_length=100, null=True)
    roleid = models.IntegerField(default=1)
    created = models.DateTimeField(auto_now_add=True)