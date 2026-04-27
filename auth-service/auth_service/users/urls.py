from django.urls import path
from .views import register, login, logout, list_users

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('logout/', logout),
    path('users/', list_users),
]
