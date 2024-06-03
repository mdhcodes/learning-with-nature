from django.urls import path

from . import views

# https://stackoverflow.com/questions/39316948/typeerror-login-takes-1-positional-argument-but-2-were-given
# The app login and logout view must be renamed to avoid clashing with the Django auth login and logout functions.
urlpatterns = [
    path('', views.index, name='index'),
    path("login", views.login_user, name="login"),
    path("logout", views.logout_user, name="logout"),
    path("register", views.register, name="register"),
    path('parks', views.parks, name='parks'),
]