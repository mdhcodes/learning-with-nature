# https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project
# If you’re starting a new project, it’s highly recommended to set up a custom user model, even if the default User model is sufficient for you. This model behaves identically to the default user model, but you’ll be able to customize it in the future if the need arises.
from django.contrib.auth.models import AbstractUser
from django.db import models
import json

# Create your models here.

class User(AbstractUser):
    pass


# When a user saves a lesson, a model is created from the json data and stored in the Lesson table.
class Lesson(models.Model):
    npid = models.CharField(max_length=100)
    url = models.URLField()
    title = models.TextField()    
    parks = models.JSONField() # The parkCode is stored in the parks list. Link to these parks in the lesson plan. https://developer.nps.gov/api/v1/lessonplans?parkCode=${park_code}&api_key=${api_key}
    # park = models.CharField(max_length=10) # Only save the one park code that applies to the specified lesson plan.
    questionObjective = models.TextField()
    gradeLevel = models.TextField()
    commonCore = models.JSONField()
    subject = models.JSONField()
    duration = models.TextField()
    hasResources = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='educator')
    date = models.DateTimeField(auto_now=False,  auto_now_add=True)


    # Return data as a JSON object.
    # https://stackoverflow.com/questions/70220201/returning-queryset-as-json-in-django
    # Error - TypeError at /saved Object of type ImageFieldFile/FileFieldFile/User is not JSON serializable django
    # https://stackoverflow.com/questions/7497138/how-do-i-serialize-an-imagefield-in-django
    # https://stackoverflow.com/questions/44429377/class-that-returns-json-python
    def serialize(self):
        return {
            "npid": self.npid,
            "id": self.id,
            "url": self.url,
            "title": self.title,
            "parks": self.parks,
            "questionObjective": self.questionObjective,
            "gradeLevel": self.gradeLevel,
            "commonCore": self.commonCore,
            "subject": self.subject,
            "duration": self.duration,
            "hasResources": self.hasResources,
            "user": json.dumps(str(self.user)), 
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
        }
    
class Resources(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='edited_lesson')
    notes = models.TextField(blank=True) # blank=True - field may be empty.
    image = models.ImageField(upload_to='images/', blank=True)
    # https://www.geeksforgeeks.org/filefield-django-models/
    doc_upload = models.FileField(upload_to='uploads/', blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='edited_by')

    def serialize(self):
        return {
            "id": self.id,
            "lesson": self.lesson,
            "notes": self.notes,
            # https://stackoverflow.com/questions/7497138/how-do-i-serialize-an-imagefield-in-django
            # https://stackoverflow.com/questions/16790375/django-object-is-not-json-serializable
            # https://github.com/encode/django-rest-framework/discussions/8024
            "image": json.dumps(str(self.image)),
            "doc_upload": json.dumps(str(self.doc_upload)),
            "author": json.dumps(str(self.author)), 
        }