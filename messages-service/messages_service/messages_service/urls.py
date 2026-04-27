from django.urls import path, include

urlpatterns = [
    path('', include('chat_messages.urls')),
]
