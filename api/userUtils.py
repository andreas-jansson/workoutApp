from .models import User
from .models import Role

def email_is_registered(myemail):
    return User.objects.filter(email = myemail).exists()

def user_is_unauthorized(user):
    return (user.roleid == Role.objects.filter(description = 'Unauthorized')[0])