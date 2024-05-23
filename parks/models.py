from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass


class Lesson(models.Model):
    park = models.CharField(max_length=10) # park code

    notes = models.TextField(blank=True)

    image = models.ImageField(upload_to='images/', blank=True)

    # https://www.geeksforgeeks.org/filefield-django-models/
    doc_upload = models.FileField(upload_to='uploads/%Y/%m/%d', blank=True)

    educator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')

    date = models.DateTimeField(auto_now=False,  auto_now_add=True)

    def __str__(self):
        return f'{self.park} / {self.educator}'