import json
import requests
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth.decorators import login_required

from .models import User, Lesson

from learning.settings import NP_API_KEY

# Create your views here.

def index(request):

    # context = {
    #     'task': 'Let\'s explore national parks!'
    # }
    
    return render(request, 'parks/index.html') #, context)


# https://docs.djangoproject.com/en/5.0/topics/auth/default/#how-to-log-a-user-in
def login_user(request):
    if request.method == 'POST':

        # Attempt to sign user in
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
        if user is not None:
            login(request, user)

            return HttpResponseRedirect(reverse('index'))
        else:
            context = {
                'message': 'Invalid username and/or password.'
            }
            return render(request, 'parks/login.html', context)
    else:
        return render(request, 'parks/login.html')


# https://docs.djangoproject.com/en/5.0/topics/auth/default/#how-to-log-a-user-out
def logout_user(request):
    logout(request)        
    return HttpResponseRedirect(reverse('index'))


def register(request):
    if request.method == 'POST':
        # Ensure username submitted
        if not request.POST['username']:
            context = {
                'message' : 'Please provide username'
            }
            return render(request, 'parks/register.html', context)
        
        # Ensure email submitted
        if not request.POST['email']:
            context = {
                'message' : 'Please provide email'
            }
            return render(request, 'parks/register.html', context)

        # Ensure password submitted
        if not request.POST['password']:
            context = {
                'message' : 'Please provide password'
            }
            return render(request, 'parks/register.html', context)

        # Ensure password confirmation
        if not request.POST['confirmation']:
            context = {
                'message' : 'Please provide password confirmation'
            }
            return render(request, 'parks/register.html', context)        

        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            context = {
                'message': 'Username already taken.'
            }
            return render(request, 'parks/register.html', context)
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'parks/register.html')


# def parks(request):

#     if request.POST:

#         print('Request', request)

#         state = request.POST['state']

#         print('State Name:', request.POST['state'])

#         # https://reintech.io/blog/connecting-to-external-api-in-django
#         url = f'https://developer.nps.gov/api/v1/parks?stateCode={state}&api_key={NP_API_KEY}'
#         response = requests.get(url)
#         park_data = response.json() # Dictionary

#         return JsonResponse(park_data)
    
#     else:
#         return render(request, 'parks/index.html', { 'message': 'Let\'s explore national parks!' })
       

    
@login_required
def save_park_lesson(request):

    if request.method == 'POST':

        username = request.user
        # print('Username:', username)
        # Check for user in the database. Ensure the user captured by client side javascript is registered in the database.
        park_user = User.objects.get(username=username)
        # print('User in database:', park_user)

        if username == park_user:
            # Get data/lesson components from JS POST request.
            data = json.loads(request.body)
            # print('Data:', data) # Python dictionary - access values using [] or get() method.

            url = data['url']
            # url = data.get('url')
            title = data.get('title')
            parks = data.get('parks')
            questionObjective = data.get('questionObjective')
            gradeLevel = data.get('gradeLevel')
            commonCore = data.get('commonCore')
            subject = data.get('subject')
            duration = data.get('duration')
            user = park_user

            lesson = Lesson(
                url=url,
                title=title,
                parks=parks,
                questionObjective=questionObjective,
                gradeLevel=gradeLevel,
                commonCore=commonCore,
                subject=subject,
                duration=duration,
                user=user
            )
            lesson.save()

        return JsonResponse({'message': 'Lesson saved successfully.'})
    
    return JsonResponse({'error': 'POST request required.'})