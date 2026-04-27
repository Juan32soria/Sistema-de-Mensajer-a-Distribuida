from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):

    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.username
