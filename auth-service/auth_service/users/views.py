from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import AccessToken

from .serializers import RegisterSerializer
from .models import Usuario


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)




@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'error': 'Credenciales inválidas'}, status=401)

    token = AccessToken.for_user(user)

    return Response({
        'access': str(token),
        'user': {
            'id': user.id,
            'username': user.username,
        }
    })




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    return Response({"message": "Logout exitoso"})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    q = request.query_params.get('q', '').strip()
    users = Usuario.objects.exclude(id=request.user.id)
    if q:
        users = users.filter(username__icontains=q)
    data = [{'id': u.id, 'username': u.username} for u in users]
    return Response(data)