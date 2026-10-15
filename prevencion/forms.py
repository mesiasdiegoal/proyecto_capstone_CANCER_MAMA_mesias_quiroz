from django import forms
from django.contrib.auth.models import User
from .models import Perfil

class FormularioUsuario(forms.ModelForm):
    first_name = forms.CharField(label="Nombre", max_length=30, required=False)
    last_name = forms.CharField(label="Apellido", max_length=30, required=False)
    email = forms.EmailField(label="Correo electrónico", required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class FormularioPerfil(forms.ModelForm):
    alias = forms.CharField(label="Alias o Nombre preferido", max_length=50, required=False)
    foto_perfil = forms.ImageField(label="Foto de Perfil (Opcional)", required=False)

    class Meta:
        model = Perfil
        fields = ['alias', 'foto_perfil']