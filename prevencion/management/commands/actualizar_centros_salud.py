"""
Genera los datos del mapa de centros de salud a partir del listado oficial
de establecimientos del Ministerio de Salud (DEIS / datos.gob.cl, licencia CC0).

Uso:
    python manage.py actualizar_centros_salud            # descarga el listado actual
    python manage.py actualizar_centros_salud --csv archivo.csv

Solo se conservan los centros útiles para la página (CESFAM y consultorios,
hospitales, clínicas y urgencias), vigentes y con coordenadas. El resultado se
guarda como JSON en los archivos estáticos: el mapa no depende de ninguna API
externa mientras la página está funcionando.
"""

import csv
import io
import json
from datetime import date
from pathlib import Path

import requests
from django.core.management.base import BaseCommand, CommandError


URL_LISTADO = (
    'https://datos.gob.cl/dataset/3bf4cf7c-f638-4735-9a01-f65faae4beca/'
    'resource/2c44d782-3365-44e3-aefb-2c8b8363a1bc/download/'
    'establecimientos_20261014.csv'
)

SALIDA = (
    Path(__file__).resolve().parents[2]
    / 'static' / 'prevencion' / 'data' / 'centros_salud.json'
)

# Tipo del MINSAL -> categoría del mapa
CATEGORIAS = {
    'Centro de Salud Familiar (CESFAM)': 'cesfam',
    'Consultorio General Urbano (CGU)': 'cesfam',
    'Consultorio General Rural (CGR)': 'cesfam',
    'Hospital': 'hospital',
    'Clínica': 'clinica',
    'Servicio de Atención Primaria de Urgencia (SAPU)': 'urgencia',
    'Servicio de Atención Primaria de Urgencia de Alta Resolutividad (SAR)': 'urgencia',
    'Servicio de Urgencia Rural (SUR)': 'urgencia',
}

# Límites aproximados de Chile (incluye Isla de Pascua) para descartar
# coordenadas erróneas
LAT_MIN, LAT_MAX = -56.5, -17.0
LON_MIN, LON_MAX = -110.0, -66.0


def limpiar(texto):
    return ' '.join((texto or '').split())


class Command(BaseCommand):

    help = 'Genera centros_salud.json (mapa) desde el listado oficial del MINSAL.'

    def add_arguments(self, parser):
        parser.add_argument('--csv', help='Usar un CSV ya descargado en vez de descargarlo.')
        parser.add_argument('--url', default=URL_LISTADO, help='URL del CSV del MINSAL.')

    def handle(self, *args, **opciones):

        if opciones['csv']:
            texto = Path(opciones['csv']).read_text(encoding='utf-8-sig')
        else:
            self.stdout.write('Descargando el listado del MINSAL...')
            respuesta = requests.get(opciones['url'], timeout=60)
            if respuesta.status_code != 200:
                raise CommandError(f'No se pudo descargar (HTTP {respuesta.status_code}).')
            texto = respuesta.content.decode('utf-8-sig')

        filas = list(csv.DictReader(io.StringIO(texto), delimiter=';'))
        centros, descartados = [], 0

        for fila in filas:
            categoria = CATEGORIAS.get(limpiar(fila.get('TipoEstablecimientoGlosa')))
            if not categoria:
                continue
            if 'vigente' not in (fila.get('EstadoFuncionamiento') or '').lower():
                continue
            # Centros de Fuerzas Armadas y Gendarmería: no atienden al público general
            sistema = limpiar(fila.get('TipoSistemaSaludGlosa')).lower()
            if 'fuerzas armadas' in sistema or 'gend' in sistema:
                continue
            try:
                lat = float(fila['Latitud'].replace(',', '.'))
                lon = float(fila['Longitud'].replace(',', '.'))
            except (KeyError, ValueError):
                descartados += 1
                continue
            if not (LAT_MIN <= lat <= LAT_MAX and LON_MIN <= lon <= LON_MAX):
                descartados += 1
                continue

            direccion = limpiar(' '.join([
                fila.get('TipoViaGlosa', ''), fila.get('NombreVia', ''), fila.get('Numero', '')
            ]))
            if direccion.lower().startswith('sin información'):
                direccion = ''

            centros.append({
                'n': limpiar(fila.get('EstablecimientoGlosa')),
                't': categoria,
                'd': direccion,
                'c': limpiar(fila.get('ComunaGlosa')),
                'r': limpiar(fila.get('RegionGlosa')),
                'f': limpiar(fila.get('TelefonoMovil_TelefonoFijo')),
                's': limpiar(fila.get('TipoSistemaSaludGlosa')),
                'la': round(lat, 5),
                'lo': round(lon, 5),
            })

        if not centros:
            raise CommandError('No quedó ningún centro: ¿cambió el formato del archivo?')

        centros.sort(key=lambda c: (c['r'], c['c'], c['n']))
        SALIDA.parent.mkdir(parents=True, exist_ok=True)
        SALIDA.write_text(json.dumps({
            'fuente': 'Ministerio de Salud de Chile (DEIS), datos.gob.cl - licencia CC0',
            'actualizado': date.today().isoformat(),
            'centros': centros,
        }, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

        resumen = {}
        for c in centros:
            resumen[c['t']] = resumen.get(c['t'], 0) + 1
        self.stdout.write(self.style.SUCCESS(
            f'{len(centros)} centros guardados en {SALIDA.name} '
            f'({SALIDA.stat().st_size / 1024:.0f} KB): {resumen}. '
            f'Descartados por coordenadas: {descartados}.'
        ))
