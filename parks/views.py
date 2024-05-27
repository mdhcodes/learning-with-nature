import json
import requests
from django.http import JsonResponse
from django.shortcuts import render

from learning.settings import NP_API_KEY

# Create your views here.

def index(request):

    context = {
        'message': 'Let\'s explore national parks!'
    }
    
    return render(request, 'parks/index.html', context)



def parks(request):

    print('Request', request)

    # data = json.loads(request.body)

    state = request.POST['state']

    print('State Name:', request.POST['state'])

    # https://reintech.io/blog/connecting-to-external-api-in-django
    url = f'https://developer.nps.gov/api/v1/parks?stateCode={state}&api_key={NP_API_KEY}'
    response = requests.get(url)
    data = response.json()

    # return JsonResponse({"message": "Response successful."}, status=201)
    return JsonResponse(data)
