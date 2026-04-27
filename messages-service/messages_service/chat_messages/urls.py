from django.urls import path
from .views import (
    enviar_mensaje,
    mensajes_grupo,
    mensajes_canal,
    mensajes_privados,
    marcar_leido,
    ver_estados,
    presigned_url,
    guardar_archivo,
)

urlpatterns = [
    path('chat_messages/', enviar_mensaje),
    path('chat_messages/grupo/<int:grupo_id>/', mensajes_grupo),
    path('chat_messages/canal/<int:canal_id>/', mensajes_canal),
    path('chat_messages/privados/<int:usuario_id>/', mensajes_privados),
    path('chat_messages/<int:mensaje_id>/read/', marcar_leido),
    path('chat_messages/<int:mensaje_id>/estados/', ver_estados),
    path('chat_archivos/presigned/', presigned_url),
    path('chat_archivos/', guardar_archivo),
]
