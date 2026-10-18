# Red Mamaria Preventiva

## Plataforma Web para Educación Preventiva y Análisis Preliminar de Imágenes Mamarias mediante Inteligencia Artificial

Red Mamaria Preventiva es un proyecto Capstone desarrollado por estudiantes de Ingeniería en Informática de Duoc UC.

La solución consiste en una plataforma web orientada a la educación y prevención del cáncer de mama, integrando contenidos educativos interactivos, inteligencia artificial y herramientas de apoyo dentro de una misma plataforma.

**Plataforma web:**  
https://red-mamaria-preventiva.vercel.app

---

## Descripción del proyecto

Red Mamaria Preventiva busca facilitar el acceso a información preventiva sobre el cáncer de mama mediante una experiencia interactiva y educativa.

La plataforma está dirigida principalmente a personas interesadas en aprender sobre prevención, factores de riesgo y salud mamaria.

Entre sus principales funcionalidades se encuentran:

- Registro e inicio de sesión de usuarios.
- Módulo educativo interactivo.
- Preguntas con retroalimentación.
- Seguimiento del progreso del usuario.
- Asistente virtual Sonia integrado con Google Gemini.
- Análisis preliminar de imágenes mamarias mediante una red neuronal convolucional CNN.
- Generación de mapas de calor mediante Grad-CAM.
- Panel administrativo mediante Django Admin.
- Mapa interactivo de centros de salud en Chile.
- Persistencia de usuarios, preguntas y actividades educativas.

Las imágenes utilizadas en el módulo de análisis son procesadas temporalmente por la CNN y posteriormente eliminadas, por lo que no se almacenan de forma persistente en la plataforma.

> El módulo de análisis de imágenes fue desarrollado con fines académicos y educativos. Sus resultados no constituyen un diagnóstico médico ni reemplazan la evaluación de un profesional de la salud.

---

## Tecnologías utilizadas

| Área | Tecnologías |
|---|---|
| Frontend | HTML, CSS, JavaScript, Django Templates |
| Backend | Python, Django |
| Base de datos | SQLite, Django ORM |
| Inteligencia Artificial | TensorFlow, Keras, CNN, Grad-CAM |
| Asistente virtual | Google Gemini API |
| Mapas | Leaflet, OpenStreetMap |
| Control de versiones | Git, GitHub |
| Desarrollo | Visual Studio Code |
| Despliegue | Vercel |

---

## Instrucciones para ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/mesiasdiegoal/proyecto_capstone_CANCER_MAMA_mesias_quiroz.git
```

### 2. Ingresar a la carpeta del prototipo

```bash
cd proyecto_capstone_CANCER_MAMA_mesias_quiroz/prototipo
```

### 3. Crear un entorno virtual

```bash
python -m venv venv
```

### 4. Activar el entorno virtual

En Windows:

```bash
venv\Scripts\activate
```

### 5. Instalar las dependencias

```bash
pip install -r requirements.txt
```

### 6. Configurar las variables de entorno

El proyecto incluye un archivo:

```text
.env.example
```

Se debe crear un archivo `.env` con las variables necesarias para el funcionamiento de los servicios externos.

Las claves API y credenciales reales no se almacenan en el repositorio por motivos de seguridad.

### 7. Ejecutar las migraciones

```bash
python manage.py migrate
```

### 8. Iniciar el servidor local

```bash
python manage.py runserver
```

La aplicación estará disponible localmente en:
http://127.0.0.1:8000/


---

## Integrantes del equipo y roles

### Diego Mesias

- Desarrollo Frontend.
- Desarrollo del módulo educativo.
- Desarrollo e integración del módulo CNN.
- Integración del análisis de imágenes mediante inteligencia artificial.

### Francisco Quiroz

- Desarrollo e integración del asistente virtual Sonia.
- Integración con Google Gemini API.
- Trabajo con base de datos.
- Gestión mediante Django Admin.

### Matías Moya

- Desarrollo Backend con Django.
- Integración de módulos.
- Pruebas funcionales del sistema.
- Apoyo en la integración general de la plataforma.

---

Metodología de trabajo

El proyecto fue desarrollado utilizando una metodología basada en Scrum, adaptada al contexto académico del proyecto Capstone.

Durante el desarrollo se utilizaron prácticas y herramientas como:

- Product Backlog.
- Sprint Backlog.
- Definition of Done.
- Retrospectivas.
- Asignación de responsabilidades.
- Desarrollo incremental.
- Pruebas e integración progresiva.
- Control de versiones mediante Git y GitHub.

Esta metodología permitió organizar el desarrollo en distintas etapas, distribuir responsabilidades entre los integrantes e incorporar mejoras progresivamente.

---

Arquitectura de la solución

La plataforma está organizada principalmente en tres capas.

Capa de presentación

Corresponde a las interfaces con las que interactúa el usuario.

Tecnologías utilizadas:

- Django Templates.
- HTML.
- CSS.
- JavaScript.

Incluye las interfaces de registro, inicio de sesión, módulo educativo, asistente Sonia, análisis de imágenes, perfil de usuario y mapa de centros de salud.

Capa de aplicación

Desarrollada principalmente mediante Python y Django.

Incluye:

- Gestión de usuarios.
- Módulo educativo.
- Django Admin.
- Asistente virtual Sonia.
- Integración con Google Gemini.
- Procesamiento de imágenes mediante CNN.
- Generación de mapas de calor mediante Grad-CAM.
- Gestión de centros de salud.

 Capa de datos

La plataforma utiliza Django ORM y SQLite para administrar la información relacionada con usuarios, preguntas, respuestas y otras funcionalidades del sistema.

---

Estructura del repositorio

```text
proyecto_capstone_CANCER_MAMA_mesias_quiroz/
│
├── Fase 1/
├── Fase 2/
├── prototipo/
│   ├── media/
│   ├── modelo_cnn/
│   ├── modelo_cnn_v2/
│   ├── prevencion/
│   ├── salud_mamaria_project/
│   ├── staticfiles/
│   ├── .env.example
│   ├── .gitignore
│   ├── db.sqlite3
│   ├── manage.py
│   ├── preguntas.json
│   └── requirements.txt
│
└── README.md
```

Las carpetas correspondientes a las distintas fases contienen la documentación y evidencias desarrolladas durante el proyecto Capstone.

La carpeta prototipo contiene el código fuente de Red Mamaria Preventiva y su historial de desarrollo.

---

Pilotaje y mejoras implementadas

La plataforma fue piloteada con un grupo de 7 mujeres de diferentes edades.

A partir de la retroalimentación obtenida durante el pilotaje se identificaron oportunidades de mejora que posteriormente fueron implementadas.

 Privacidad de las imágenes

Las participantes señalaron que sería más seguro que las imágenes utilizadas en el análisis no permanecieran almacenadas.

Como respuesta, se modificó el funcionamiento del módulo para que la imagen sea utilizada únicamente de forma temporal durante el procesamiento mediante la CNN y posteriormente sea eliminada.

Acceso a centros de salud

Las participantes también señalaron la importancia de facilitar la búsqueda de lugares donde obtener atención.

A partir de esta observación se incorporó un mapa interactivo con centros de salud de Chile utilizando Leaflet y OpenStreetMap.

---

Proyecto académico

Proyecto desarrollado en el contexto del proceso Capstone de la carrera de Ingeniería en Informática de Duoc UC.
