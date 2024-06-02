# https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project
# If you’re starting a new project, it’s highly recommended to set up a custom user model, even if the default User model is sufficient for you. This model behaves identically to the default user model, but you’ll be able to customize it in the future if the need arises.
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass


# When a user saves a lesson, a model is created from the json data and stored in the Lesson table.
class Lesson(models.Model):
    url = models.URLField()
    title = models.TextField()
    parks = models.JSONField() # The parkCode is stored in the parks list. Link to these parks in the lesson plan. https://developer.nps.gov/api/v1/lessonplans?parkCode=${park_code}&api_key=${api_key}
    questionObjective = models.TextField()
    gradeLevel = models.TextField()
    commonCore = models.JSONField()
    subject = models.JSONField()
    duration = models.TextField()
    notes = models.TextField(blank=True)
    image = models.ImageField(upload_to='images/', blank=True)
    # https://www.geeksforgeeks.org/filefield-django-models/
    doc_upload = models.FileField(upload_to='uploads/%Y/%m/%d', blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='educator')
    date = models.DateTimeField(auto_now=False,  auto_now_add=True)

    # Return data as a JSON object.
    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
            "title": self.title,
            "parks": self.parks,
            "questionObjective": self.questionObjective,
            "gradeLevel": self.gradeLevel,
            "commonCore": self.commonCore,
            "subject": self.subject,
            "duration": self.duration,
            "notes": self.notes,
            "image": self.image,
            "doc_upload": self.doc_upload,
            "user": self.user,
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
        }