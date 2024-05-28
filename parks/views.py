import json
import requests
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from learning.settings import NP_API_KEY

# Create your views here.

def index(request):

    context = {
        'message': 'Let\'s explore national parks!'
    }
    
    return render(request, 'parks/index.html', context)



def parks(request):

    if request.POST:

        print('Request', request)

        state = request.POST['state']

        print('State Name:', request.POST['state'])

        # https://reintech.io/blog/connecting-to-external-api-in-django
        url = f'https://developer.nps.gov/api/v1/parks?stateCode={state}&api_key={NP_API_KEY}'
        response = requests.get(url)
        park_data = response.json() # Dictionary

        # Return only the data for the learning.

        return JsonResponse(park_data)
    
    else:
        return render(request, 'parks/index.html', { 'message': 'Let\'s explore national parks!' })
        

    
