import json
import requests
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth.decorators import login_required

from itertools import chain

from .models import User, Lesson, Resources

from learning.settings import NP_API_KEY

from .forms import CreateResourcesForm

# Create your views here.

def index(request): 
    return render(request, 'parks/index.html')


@login_required
def edit(request):

    # FormData
    # https://docs.djangoproject.com/en/5.0/topics/http/file-uploads/
    if request.method == 'POST':

        # print('Edit Request:', request)
        # print('Edit Request.FILES:', request.FILES)

        id = request.POST.get('id')
        # print('Edit ID:', id)

        # Capture the edit form data values.
        notes = request.POST.get('notes')
        # print('Edit Notes:', notes)
        image = request.FILES['image'] 
        # print('Edit Image:', image)
        doc_upload = request.FILES['doc-file']
        # print('Edit Doc Upload:', doc_upload)

        # Get user from the POST request.
        user_name = request.user
        author = user_name

        lesson_id = Lesson.objects.get(pk=id) # Lesson object (#)      
        # print('Lesson ID Line 55:', lesson_id)

        lesson = Lesson.objects.get(pk=id) 
        # print('Lesson:', lesson)
        # print('Lesson.hasResources:', lesson.hasResources)

        # If Lesson.hasResources, update that .hasResources entry
        if lesson.hasResources:
            # Get the Resources object for this lesson and user.
            resources = Resources.objects.filter(lesson_id=id).filter(author=author).values()
            resources_to_update_id = resources[0]['id']
            # print('Resources to Update ID:', resources[0]['id'])
            # print('Resources to Update:', resources)

            resource_to_update = Resources.objects.get(pk=resources_to_update_id)
            # print('Resource to Update:', resource_to_update)

            # Update Resources
            # https://stackoverflow.com/questions/3681627/how-to-update-fields-in-a-model-without-creating-a-new-record-in-django
            resource_to_update.notes = notes            
            resource_to_update.image = image
            resource_to_update.doc_upload = doc_upload

            resource_to_update.save()

            return JsonResponse({'message': 'Lesson updated successfully.'})

        # If Lesson.hasResources == False, create a new Resources entry
        else:
            # Set/Save Lesson object hasResources field as True.
            lesson_id.hasResources = True
            lesson_id.save()

            resources = Resources()
            resources.lesson = lesson_id
            resources.notes = notes
            resources.author = author

            # The notes, author_id, and lesson_id are saved. The file uploads trigger a TypeError. The file objects are captured in JS but appear empty in the views.py.  
            if len(image) != 0: # TypeError: object of type 'NoneType' has no len()
                resources.image = image
            
            if len(doc_upload) != 0:
                resources.doc_upload = doc_upload

            resources.save()

            return JsonResponse({'message': 'Lesson updated successfully.'})
    
    else:
        return JsonResponse({'error': 'POST request required.'}) 


def get_lesson_to_edit(request, lesson_id):

    # print('Request', request)
    # print('Lesson ID:', lesson_id)

    # Get the saved lesson data with the given lesson_id for the specified user.
    lesson = Lesson.objects.get(pk=lesson_id)     
    # print('Lesson (to Edit):', lesson)
        
    # https://stackoverflow.com/questions/70220201/returning-queryset-as-json-in-django
    return JsonResponse(lesson.serialize())


def lesson(request, lesson_id):

    # print('Lesson ID', lesson_id)

    current_user_id = request.user.id
    # print('Current User:', current_user_id)

    # Get data from both tables:
    # Lesson - lesson_id
    lesson = Lesson.objects.get(pk=lesson_id)
    # print('Edited Lesson to Display:', lesson) # Returns a Lesson object

    # Resources - author and lesson_id

    # https://stackoverflow.com/questions/15874233/how-to-output-django-queryset-as-json
    resources = Resources.objects.filter(lesson_id=lesson_id, author=current_user_id).values() # Returns a QuerySet
    # resources = Resources.objects.filter(lesson_id=lesson_id, author=current_user_id) # Returns a QuerySet [<Resources: Resources object (6)>]
    # print('Edited Lesson Resources to Display:', resources) 

    # Check that resources QuerySet is not empty
    # https://stackoverflow.com/questions/1387727/checking-for-empty-queryset-in-django
    if not resources: 

        return JsonResponse(lesson.serialize())
    
    else:

        for resource in resources: # Look inside the QuerySet list to access its ID
            # print('Resource:', resource)
            # print('Resource ID:', resource['id']) 

            resource_id = resource['id']

            # After getting the ID, access the object. However, this object is not JSON serializable
            # lesson_resources = Resources.objects.get(pk=resource_id)

            # After getting the ID, access the notes, image, and doc_upload field values.
            # https://docs.djangoproject.com/en/5.0/ref/models/querysets/#values - "... specify field names to which the SELECT should be limited."
            lesson_resources = Resources.objects.filter(pk=resource_id).values('notes', 'image', 'doc_upload')
            
            print('Lesson Resources:', lesson_resources)         
    
        data_chain = list(chain([lesson.serialize()], lesson_resources)) # WORKS - returns lesson as a dictionary with key value pairs
        # data_chain = list(chain(lesson.serialize(), lesson_resources)) # DOES NOT WORK - returns lesson with keys only
        # print('Data Chain:', data_chain)

        # In order to allow non-dict objects to be serialized set the safe parameter to False.
        # https://docs.djangoproject.com/en/5.0/ref/request-response/#serializing-non-dictionary-objects
        return JsonResponse(data_chain, safe=False)


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


def parks(request, state):

    # print('Request:', request)
    # print('State:', state)

    # https://reintech.io/blog/connecting-to-external-api-in-django
    url = f'https://developer.nps.gov/api/v1/parks?stateCode={state}&api_key={NP_API_KEY}'
    response = requests.get(url)
    park_data = response.json() # Dictionary

    return JsonResponse(park_data) 


def park_learning(request, park_code):

    # print('Request:', request)
    # print('Park Code:', park_code)
    
    url = f'https://developer.nps.gov/api/v1/parks?parkCode={park_code}&api_key={NP_API_KEY}'
    response = requests.get(url)
    park_link_data = response.json() # Dictionary
    # print('Park Link Data:', park_link_data)

    return JsonResponse(park_link_data)


@login_required
def update_password(request):

    if request.method == 'POST':

        data = json.loads(request.body)
        # print('Update Profile Data:', data)

        current_user = request.user
        # print('Current User:', current_user) # Username
        # print('Type Current User:', type(current_user))

        # Store user input
        old_password = data['old_password']
        # print('Old Password:', old_password)
        new_password = data['new_password']
        # print('New Password:', new_password)
        new_confirmation = data['new_confirmation']
        # print('New Confirmation:', new_confirmation)

        # https://docs.djangoproject.com/en/5.0/topics/auth/default/#authenticating-users
        # https://stackoverflow.com/questions/71882177/how-to-update-user-password-in-django

        # Authenticate user
        user = authenticate(username=current_user.username, password=old_password)
        # print('User:', user)

        # Try to update/reset password
        if user is not None:
            if new_password == new_confirmation:
                user.set_password(new_password)
                user.save()

                return JsonResponse({'message': 'Password updated successfully.'})
            else:
                return JsonResponse({'message': 'Your new password and new password confirmation do not match.'})

        return JsonResponse({'message': 'Your old password does not match'})
    
    return JsonResponse({'error': 'POST request required.'})


@login_required
def update_username(request):

    if request.method == 'POST':

        data = json.loads(request.body)
        # print('Update Profile Data:', data)

        current_user = request.user
        # print('Current User:', current_user) # Username
        # print('Type Current User:', type(current_user))

        # Store user input
        old_username = data['old_username']
        # print('Old Username:', old_username)
        new_username = data['new_username']
        # print('New Username:', new_username)

        user = User.objects.get(username=current_user.username)
        # print('User:', user)
        
        # Try to update/reset username
        if old_username == current_user.username:
            user.username = new_username
            user.save()
    
            return JsonResponse({'message': 'Username updated successfully.'})
        else:
            return JsonResponse({'message': 'Old username does not match.'})
    
    return JsonResponse({'error': 'POST request required.'})


def all_park_lessons(request):

    # print('Request:', request)
    
    url = f'https://developer.nps.gov/api/v1/lessonplans?limit=1270&api_key={NP_API_KEY}' # total number of lessons: 1270
    response = requests.get(url)
    park_lessons = response.json() # Dictionary
    # print('Park Lessons:', park_lessons)

    return JsonResponse(park_lessons)


def park_lessons(request, park_code): #, lesson_id): could have used lesson_id here but identified lesson in Javascript.

    # print('Request:', request)
    # print('Park Code for Lessons:', park_code)
    # print('Park Lesson ID:', lesson_id)

    url= f'https://developer.nps.gov/api/v1/lessonplans?parkCode={park_code}&api_key={NP_API_KEY}'
    response = requests.get(url)
    park_lesson_data = response.json() # Dictionary
    # print('Park Lesson Data:', park_lesson_data)

    return JsonResponse(park_lesson_data)


def register(request):
    if request.method == 'POST':
        # Ensure username submitted
        if not request.POST['username']:
            context = {
                'message' : 'Please provide username'
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
        password = request.POST['password']

        # Attempt to create new user
        try:
            # Don't require an email to register. 
            # https://stackoverflow.com/questions/48448563/my-password-is-stored-inside-the-email-field-in-django-admin
            # The second argument of the create_user method is email. 
            # Fix - Change code to pass password as a keyword argument. 
            # user = User.objects.create_user(username, email, password)
            user = User.objects.create_user(username, password=password)
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
            
            np_lesson_id = data['id']
            # print('NP Lesson_ID:', np_lesson_id)

            # Check if this lesson is already saved
            # if object has npid == np_lesson_id and user_id == request.user 

            lesson_exists = Lesson.objects.filter(npid=np_lesson_id).filter(user_id=request.user)
            # print('Lesson Exists:', lesson_exists)
            
            if not lesson_exists:

                url = data['url']
                # url = data.get('url')
                title = data.get('title')
                park = data.get('park')
                # print('Save park_code:', park)
                questionObjective = data.get('questionObjective')
                gradeLevel = data.get('gradeLevel')
                commonCore = data.get('commonCore')
                subject = data.get('subject')
                duration = data.get('duration')
                user = park_user
                npid = data.get('id')

                lesson = Lesson(
                    url=url,
                    title=title,
                    park=park,
                    questionObjective=questionObjective,
                    gradeLevel=gradeLevel,
                    commonCore=commonCore,
                    subject=subject,
                    duration=duration,
                    user=user,
                    npid=npid
                )
                lesson.save()

            else:
                return JsonResponse({'message': 'This lesson is already saved.'})

        return JsonResponse({'message': 'Lesson saved successfully.'})
    
    return JsonResponse({'error': 'POST request required.'})


@login_required
def saved(request):

        print('Request', request)

        # current_username = request.user
        current_user_id = request.user.id

        # Get all saved lessons for the specified user.
        lessons = Lesson.objects.filter(user_id=current_user_id) # Returns QuerySet of populated Django models - python objects that contain fields and functions.     
        # lessons = Lesson.objects.filter(user_id=current_user_id).values() # Returns QuerySet of dictionaries for each row in the database. (Performance is very efficient) These dictionaries can then be placed in a list [] or calling the list() constructor - dict object has no attribute serialize
        # print('Saved Lessons Line 361:', lessons)

        if lessons == None:
            return JsonResponse({'message': 'There are no saved lessons.'})
        else:

            # TypeError at /saved - In order to allow non-dict objects to be serialized set the safe parameter to False.
            # https://docs.djangoproject.com/en/5.0/ref/request-response/#serializing-non-dictionary-objects
            
            # https://stackoverflow.com/questions/70220201/returning-queryset-as-json-in-django
            return JsonResponse([lesson.serialize() for lesson in lessons], safe=False)