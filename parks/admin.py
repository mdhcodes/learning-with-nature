from django.contrib import admin

# Register your models here.

from django.contrib.auth.admin import UserAdmin
from .models import User, Lesson, Resources


class UserAdmin(admin.ModelAdmin):
    pass

class LessonAdmin(admin.ModelAdmin):
    pass

class ResourcesAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Resources, ResourcesAdmin)