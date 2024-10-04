from django.urls import path
from . import views
from .views import login, registro

urlpatterns = [
    path('', views.index, name="index"),
    path('login/',login, name="Login" ),
    path('registro/',registro, name="Registro")
]