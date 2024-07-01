from django.urls import path

from . import views

# https://stackoverflow.com/questions/39316948/typeerror-login-takes-1-positional-argument-but-2-were-given
# The app login and logout view must be renamed to avoid clashing with the Django auth login and logout functions.
urlpatterns = [
    path('', views.index, name='index'),
    path("login", views.login_user, name="login"),
    path("logout", views.logout_user, name="logout"),
    path("register", views.register, name="register"),
    path('parks/<str:state>', views.parks, name='parks'),
    path('park_learning/<str:park_code>', views.park_learning, name='park_learning'),
    path('all_park_lessons', views.all_park_lessons, name='all_park_lessons'),
    path('park_lessons/<str:park_code>', views.park_lessons, name='park_lessons'),
    path('save_park_lesson', views.save_park_lesson, name='save_park_lesson'),
    path('saved', views.saved, name='saved'),
    path('edit', views.edit, name='edit'),
    path('get_edit_form', views.get_edit_form, name='get_edit_form'),
    path('get_lesson_to_edit/<int:lesson_id>', views.get_lesson_to_edit, name='get_lesson_to_edit'),
    path('lesson/<int:lesson_id>', views.lesson, name='lesson'),
]