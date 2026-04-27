from rest_framework import serializers
from .models import Mensaje, EstadoMensaje, Archivo


class ArchivoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archivo
        fields = ['id', 'url', 'tipo', 'tamaño']


class MensajeSerializer(serializers.ModelSerializer):
    archivos = ArchivoSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Mensaje
        fields = ['id', 'texto', 'usuario_emisor_id', 'grupo_id', 'canal_id',
                  'usuario_receptor_id', 'tipo_destino', 'created_at', 'archivos']


class EstadoMensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoMensaje
        fields = '__all__'


class ArchivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archivo
        fields = '__all__'