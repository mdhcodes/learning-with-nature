from django.shortcuts import render

# Create your views here.

def index(request):

    context = {
        'message': 'Let\'s explore national parks!'
    }
    
    return render(request, 'parks/index.html', context)