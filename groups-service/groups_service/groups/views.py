from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Grupo, Canal, ParticipacionGrupo
from .serializers import GrupoSerializer, CanalSerializer, ParticipacionGrupoSerializer


#Crear grupo
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_grupo(request):
    if not request.data.get('nombre'):
        return Response({"error": "Nombre requerido"}, status=400)

    serializer = GrupoSerializer(data=request.data)

    if serializer.is_valid():
        grupo = serializer.save()

        participacion = ParticipacionGrupo.objects.create(
            usuario_id=request.user.id,
            grupo=grupo,
            rol_usuario='admin'
        )

        return Response({
            "message": "Grupo creado",
            "grupo": GrupoSerializer(grupo).data,
            "rol": participacion.rol_usuario
        }, status=201)

    return Response(serializer.errors, status=400)




#Listar grupos para cierto usuario
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mis_grupos(request):

    participaciones = ParticipacionGrupo.objects.filter(
        usuario_id=request.user.id
    ).select_related('grupo').prefetch_related('grupo__canales')

    data = []

    for p in participaciones:
        grupo_data = GrupoSerializer(p.grupo).data
        grupo_data['rol'] = p.rol_usuario

        data.append(grupo_data)

    return Response(data)




#Eliminar grupo
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_grupo(request, grupo_id):

    try:
        grupo = Grupo.objects.get(id=grupo_id)
    except Grupo.DoesNotExist:
        return Response({"error": "Grupo no existe"}, status=404)

    participacion = ParticipacionGrupo.objects.filter(
        usuario_id=request.user.id,
        grupo_id=grupo_id
    ).first()

    if not participacion:
        return Response({"error": "No pertenece al grupo"}, status=403)

    if participacion.rol_usuario != 'admin':
        return Response({"error": "Solo admin puede eliminar"}, status=403)

    grupo.delete()

    return Response({
        "message": "Grupo eliminado",
        "grupo_id": grupo_id
    })




#Crear canal
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_canal(request):

    grupo_id = request.data.get('grupo')

    if not grupo_id:
        return Response({"error": "grupo requerido"}, status=400)

    participacion = ParticipacionGrupo.objects.filter(
        usuario_id=request.user.id,
        grupo_id=grupo_id
    ).first()

    if not participacion:
        return Response({"error": "No pertenece al grupo"}, status=403)

    if participacion.rol_usuario != 'admin':
        return Response({"error": "Solo admin puede crear canales"}, status=403)

    serializer = CanalSerializer(data=request.data)

    if serializer.is_valid():
        canal = serializer.save()

        return Response({
            "message": "Canal creado",
            "canal": CanalSerializer(canal).data
        }, status=201)

    return Response(serializer.errors, status=400)




#Listar canales de un grupo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def canales_grupo(request, grupo_id):

    if not ParticipacionGrupo.objects.filter(
        usuario_id=request.user.id,
        grupo_id=grupo_id
    ).exists():
        return Response({"error": "No pertenece al grupo"}, status=403)

    canales = Canal.objects.filter(grupo_id=grupo_id)

    return Response({
        "grupo_id": grupo_id,
        "canales": CanalSerializer(canales, many=True).data
    })




#Unirse a un grupo
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unirse_grupo(request, grupo_id):

    if not Grupo.objects.filter(id=grupo_id).exists():
        return Response({"error": "Grupo no existe"}, status=404)

    if ParticipacionGrupo.objects.filter(
        usuario_id=request.user.id,
        grupo_id=grupo_id
    ).exists():
        return Response({"message": "Ya pertenece al grupo"})

    participacion = ParticipacionGrupo.objects.create(
        usuario_id=request.user.id,
        grupo_id=grupo_id,
        rol_usuario='miembro'
    )

    return Response({
        "message": "Unido al grupo",
        "grupo_id": grupo_id,
        "rol": participacion.rol_usuario
    }, status=201)




#Listar miembros de un grupo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_miembros(request, grupo_id):
    if not ParticipacionGrupo.objects.filter(usuario_id=request.user.id, grupo_id=grupo_id).exists():
        return Response({"error": "No pertenece al grupo"}, status=403)
    miembros = ParticipacionGrupo.objects.filter(grupo_id=grupo_id)
    return Response([{'usuario_id': m.usuario_id, 'rol': m.rol_usuario} for m in miembros])


#Agregar miembro (solo admin)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agregar_miembro(request, grupo_id):
    participacion = ParticipacionGrupo.objects.filter(usuario_id=request.user.id, grupo_id=grupo_id).first()
    if not participacion or participacion.rol_usuario != 'admin':
        return Response({"error": "Solo admin puede agregar miembros"}, status=403)
    usuario_id = request.data.get('usuario_id')
    if not usuario_id:
        return Response({"error": "usuario_id requerido"}, status=400)
    if ParticipacionGrupo.objects.filter(usuario_id=usuario_id, grupo_id=grupo_id).exists():
        return Response({"error": "Ya es miembro"}, status=400)
    ParticipacionGrupo.objects.create(usuario_id=usuario_id, grupo_id=grupo_id, rol_usuario='miembro')
    return Response({"message": "Miembro agregado"}, status=201)


#Salir de un grupo
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def salir_grupo(request, grupo_id):

    participacion = ParticipacionGrupo.objects.filter(
        usuario_id=request.user.id,
        grupo_id=grupo_id
    ).first()

    if not participacion:
        return Response({"error": "No pertenece al grupo"}, status=403)

    participacion.delete()

    return Response({
        "message": "Saliste del grupo",
        "grupo_id": grupo_id
    })