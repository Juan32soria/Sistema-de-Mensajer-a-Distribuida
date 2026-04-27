from django.db import models

class Mensaje(models.Model):

    TIPO_DESTINO_CHOICES = [
        ('grupo', 'Grupo'),
        ('canal', 'Canal'),
        ('privado', 'Privado'),
    ]

    texto = models.TextField()
    usuario_emisor_id = models.IntegerField()

    grupo_id = models.IntegerField(null=True, blank=True)
    canal_id = models.IntegerField(null=True, blank=True)
    usuario_receptor_id = models.IntegerField(null=True, blank=True)

    tipo_destino = models.CharField(max_length=10, choices=TIPO_DESTINO_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje {self.id}"




class EstadoMensaje(models.Model):
    ESTADO_CHOICES = [
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('leido', 'Leído'),
    ]

    mensaje = models.ForeignKey(Mensaje, on_delete=models.CASCADE, related_name='estados')
    usuario_destinatario_id = models.IntegerField()
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES)
    fecha_estado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje {self.mensaje.id} - Usuario {self.usuario_destinatario_id}"
    



class Archivo(models.Model):
    mensaje = models.ForeignKey(Mensaje, on_delete=models.CASCADE, related_name='archivos', null=True, blank=True)
    url = models.URLField()
    tipo = models.CharField(max_length=50)
    tamaño = models.IntegerField()

    def __str__(self):
        return f"Archivo {self.id}"