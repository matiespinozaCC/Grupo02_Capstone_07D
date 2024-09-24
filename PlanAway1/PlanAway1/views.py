from django.shortcuts import render

def home(request):
    return render(request, 'PlanAway1/templates/login.html')