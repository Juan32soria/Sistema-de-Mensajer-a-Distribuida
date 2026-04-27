from rest_framework import serializers
from .models import Grupo, Canal, ParticipacionGrupo


class CanalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canal
        fields = ['id', 'nombre', 'grupo']


class GrupoSerializer(serializers.ModelSerializer):
    canales = CanalSerializer(many=True, read_only=True)

    class Meta:
        model = Grupo
        fields = ['id', 'nombre', 'descripcion', 'canales']


class ParticipacionGrupoSerializer(serializers.ModelSerializer):
    grupo = GrupoSerializer(read_only=True)

    class Meta:
        model = ParticipacionGrupo
        fields = ['id', 'usuario_id', 'rol_usuario', 'grupo']