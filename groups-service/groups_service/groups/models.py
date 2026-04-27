from django.db import models

class Grupo(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre




class Canal(models.Model):
    nombre = models.CharField(max_length=255)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, related_name='canales')

    def __str__(self):
        return self.nombre




class ParticipacionGrupo(models.Model):
    usuario_id = models.IntegerField()  # viene de auth_service
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    rol_usuario = models.CharField(max_length=50)

    def __str__(self):
        return f"Usuario {self.usuario_id} en Grupo {self.grupo.id}"
