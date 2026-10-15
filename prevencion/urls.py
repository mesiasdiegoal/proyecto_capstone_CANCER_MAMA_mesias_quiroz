from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing, name='landing'),
    path('iniciar-sesion/', views.iniciar_sesion, name='iniciar_sesion'),
    path('inicio/', views.inicio, name='inicio'),
    path('cerrar-sesion/', views.cerrar_sesion, name='cerrar_sesion'),
    path('registro/', views.registro_usuario, name='registro'),
    path('educativo/', views.educativo_menu, name='educativo_menu'),
    path('educativo/sesion/<str:tipo_sesion>/', views.educativo_sesion, name='educativo_sesion'),
    path('analisis-imagen/', views.analisis_imagen, name='analisis_imagen'),
    path('asistente-virtual/', views.asistente_virtual, name='asistente_virtual'),
    path('asistente-virtual/mensaje/', views.asistente_virtual_mensaje, name='asistente_virtual_mensaje'),
    path('perfil/', views.perfil_usuario, name='perfil_usuario'),
]