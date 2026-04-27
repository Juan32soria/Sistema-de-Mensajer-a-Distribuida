from django.urls import path
from .views import (
    crear_grupo,
    mis_grupos,
    eliminar_grupo,
    crear_canal,
    canales_grupo,
    unirse_grupo,
    salir_grupo,
    listar_miembros,
    agregar_miembro,
)

urlpatterns = [
    path('groups/', crear_grupo),
    path('groups/mine/', mis_grupos),
    path('groups/<int:grupo_id>/', eliminar_grupo),

    path('groups/<int:grupo_id>/join/', unirse_grupo),
    path('groups/<int:grupo_id>/leave/', salir_grupo),

    path('channels/', crear_canal),
    path('groups/<int:grupo_id>/channels/', canales_grupo),
    path('groups/<int:grupo_id>/members/', listar_miembros),
    path('groups/<int:grupo_id>/members/add/', agregar_miembro),
]