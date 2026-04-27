from django.urls import path, include

urlpatterns = [
    path('', include('groups.urls')),
]