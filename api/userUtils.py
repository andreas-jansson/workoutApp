from .models import User

def email_is_registered(myemail):
    return User.objects.filter(email = myemail).exists()