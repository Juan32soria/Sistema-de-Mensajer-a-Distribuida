import uuid
import boto3
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Mensaje, EstadoMensaje, Archivo
from .serializers import MensajeSerializer, ArchivoSerializer, ArchivoSimpleSerializer

#Enviar mensaje
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enviar_mensaje(request):
    data = request.data.copy()
    data['usuario_emisor_id'] = request.user.id

    serializer = MensajeSerializer(data=data)

    if serializer.is_valid():
        mensaje = serializer.save()

        # crear estado inicial
        if mensaje.tipo_destino == 'privado':
            EstadoMensaje.objects.create(
                mensaje=mensaje,
                usuario_destinatario_id=mensaje.usuario_receptor_id,
                estado='enviado'
            )

        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)



#Listar mensajes por grupo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mensajes_grupo(request, grupo_id):
    mensajes = Mensaje.objects.filter(
        grupo_id=grupo_id,
        tipo_destino='grupo'
    ).order_by('id')

    serializer = MensajeSerializer(mensajes, many=True)
    return Response(serializer.data)



#Listar mensajes privados
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mensajes_privados(request, usuario_id):
    user_id = request.user.id

    mensajes = (
        Mensaje.objects.filter(
            tipo_destino='privado',
            usuario_emisor_id=user_id,
            usuario_receptor_id=usuario_id
        ) | Mensaje.objects.filter(
            tipo_destino='privado',
            usuario_emisor_id=usuario_id,
            usuario_receptor_id=user_id
        )
    )

    serializer = MensajeSerializer(mensajes.order_by('id'), many=True)
    return Response(serializer.data)



#Marcar mensaje como leído
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marcar_leido(request, mensaje_id):
    try:
        mensaje = Mensaje.objects.get(id=mensaje_id)
    except Mensaje.DoesNotExist:
        return Response({"error": "Mensaje no existe"}, status=404)

    EstadoMensaje.objects.create(
        mensaje=mensaje,
        usuario_destinatario_id=request.user.id,
        estado='leido'
    )

    return Response({"message": "Mensaje marcado como leído"})




#Ver estado de un mensaje
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_estados(request, mensaje_id):
    estados = EstadoMensaje.objects.filter(mensaje_id=mensaje_id)

    data = [
        {
            "usuario_id": e.usuario_destinatario_id,
            "estado": e.estado,
            "fecha": e.fecha_estado
        }
        for e in estados
    ]

    return Response(data)




#Listar mensajes por canal
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mensajes_canal(request, canal_id):
    mensajes = Mensaje.objects.filter(
        canal_id=canal_id,
        tipo_destino='canal'
    ).order_by('id')

    serializer = MensajeSerializer(mensajes, many=True)
    return Response(serializer.data)




#Obtener URL firmada para subir archivo a S3
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def presigned_url(request):
    filename = request.query_params.get('filename', 'file')
    tipo = request.query_params.get('tipo', 'application/octet-stream')
    key = f"attachments/{uuid.uuid4()}/{filename}"

    s3 = boto3.client(
        's3',
        region_name=settings.AWS_S3_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    upload_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': settings.AWS_S3_BUCKET, 'Key': key, 'ContentType': tipo},
        ExpiresIn=300,
    )
    file_url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_S3_REGION}.amazonaws.com/{key}"
    return Response({'upload_url': upload_url, 'file_url': file_url})


#Guardar registro de archivo adjunto en BD
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def guardar_archivo(request):
    serializer = ArchivoSimpleSerializer(data=request.data)
    if serializer.is_valid():
        archivo = Archivo.objects.create(
            mensaje_id=request.data.get('mensaje_id'),
            url=request.data['url'],
            tipo=request.data['tipo'],
            tamaño=request.data.get('tamaño', 0),
        )
        return Response(ArchivoSimpleSerializer(archivo).data, status=201)
    return Response(serializer.errors, status=400)