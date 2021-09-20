import hashlib
import random
import string

def create_salt():
    return ''.join([random.choice(string.ascii_letters) for x in range(10)])


def create_pw_hash(password, salt):
    password = password+salt
    return hashlib.sha256(str.encode(password)).hexdigest()


def compare_pw_hash(password, salt, hash):
    if create_pw_hash(password, salt) == hash:
        return True
    else:
        return False


#skapa salt
#sammanfoga password+salt
#skapa hash
#spara password och salt i separat column