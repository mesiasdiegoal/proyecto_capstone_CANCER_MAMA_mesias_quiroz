/* ===================================================
   MAPA DE CENTROS DE SALUD (Leaflet + OpenStreetMap)
   Datos: listado oficial del MINSAL (centros_salud.json).
   - Se carga solo cuando la sección aparece en pantalla.
   - Filtros por tipo y buscador por comuna, región o nombre.
   - No usa la ubicación de la persona.
   =================================================== */
document.addEventListener('DOMContentLoaded', function () {

    const contenedor = document.getElementById('mapaCentros');
    if (!contenedor || typeof L === 'undefined') return;

    const TIPOS = {
        cesfam:   { nombre: 'CESFAM / Consultorio', color: '#7c3aed' },
        hospital: { nombre: 'Hospital',             color: '#2563eb' },
        clinica:  { nombre: 'Clínica',              color: '#db2777' },
        urgencia: { nombre: 'Urgencias',            color: '#ea580c' },
    };

    const contador = document.getElementById('contadorCentros');
    const buscador = document.getElementById('buscarCentro');
    const botonesTipo = document.querySelectorAll('.mapa-centros .tipo-centro');
    const tiposActivos = new Set(Object.keys(TIPOS));

    let mapa, grupo, centros = [];

    // Texto sin tildes y en minúscula, para buscar "maipu" y encontrar "Maipú"
    function normalizar(texto) {
        return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    }

    function escapar(texto) {
        const div = document.createElement('div');
        div.textContent = texto || '';
        return div.innerHTML;
    }

    function contenidoPopup(c) {
        const tipo = TIPOS[c.t];
        const lineas = [
            '<strong>' + escapar(c.n) + '</strong>',
            '<span style="color:' + tipo.color + ';font-weight:600;">' + tipo.nombre + '</span>' +
                (c.s ? ' · ' + escapar(c.s) : ''),
            escapar(c.d) + (c.d ? ', ' : '') + escapar(c.c) + ' (' + escapar(c.r) + ')',
        ];
        if (c.f) {
            lineas.push('<i class="bi bi-telephone"></i> <a href="tel:' + escapar(c.f) + '">' + escapar(c.f) + '</a>');
        }
        lineas.push('<a href="https://www.google.com/maps/search/?api=1&query=' + c.la + ',' + c.lo +
            '" target="_blank" rel="noopener">Cómo llegar <i class="bi bi-box-arrow-up-right"></i></a>');
        return lineas.join('<br>');
    }

    function crearMarcador(c) {
        const icono = L.divIcon({
            className: '',
            html: '<span style="display:block;width:14px;height:14px;border-radius:50%;' +
                  'background:' + TIPOS[c.t].color + ';border:2px solid #fff;' +
                  'box-shadow:0 0 0 1px rgba(0,0,0,.25);"></span>',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });
        return L.marker([c.la, c.lo], { icon: icono, title: c.n }).bindPopup(contenidoPopup(c));
    }

    function mostrar() {
        const consulta = normalizar(buscador ? buscador.value : '');
        const visibles = centros.filter(function (c) {
            return tiposActivos.has(c.t) && (!consulta || c.texto.includes(consulta));
        });

        grupo.clearLayers();
        grupo.addLayers(visibles.map(function (c) { return c.marcador; }));

        if (!visibles.length) {
            contador.textContent = consulta
                ? 'No encontramos centros para "' + buscador.value.trim() + '".'
                : 'Activa al menos un tipo de centro.';
            return;
        }

        contador.textContent = 'Mostrando ' + visibles.length.toLocaleString('es-CL') + ' centros de salud';

        // Al buscar, el mapa se acerca a los resultados
        if (consulta.length >= 3) {
            mapa.fitBounds(L.latLngBounds(visibles.map(function (c) { return [c.la, c.lo]; })),
                { padding: [30, 30], maxZoom: 14 });
        }
    }

    function iniciar() {
        mapa = L.map(contenedor, { scrollWheelZoom: false }).setView([-33.45, -70.66], 5);

        // Fondo del mapa: OpenStreetMap (gratis, sin clave de API).
        // Su política de uso exige que cada imagen indique desde qué sitio se
        // pide (cabecera "Referer"). Django, por privacidad, no la envía a otros
        // sitios, y sin ella OpenStreetMap devuelve "Access blocked". Por eso se
        // pide que se envíe SOLO el origen (ej: https://mi-sitio.vercel.app/),
        // sin la ruta ni ningún dato de la persona.
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            referrerPolicy: 'strict-origin-when-cross-origin',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Datos: MINSAL',
        }).addTo(mapa);

        // La rueda del mouse hace zoom solo después de hacer clic en el mapa,
        // para no "atrapar" el desplazamiento de la página.
        mapa.on('click', function () { mapa.scrollWheelZoom.enable(); });
        contenedor.addEventListener('mouseleave', function () { mapa.scrollWheelZoom.disable(); });

        // Grupos de centros: círculos morados con la cantidad (más grandes
        // mientras más centros agrupan), en vez de los colores por defecto.
        grupo = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 45,
            chunkedLoading: true,
            iconCreateFunction: function (cluster) {
                const n = cluster.getChildCount();
                const tam = n < 10 ? 32 : n < 100 ? 38 : 46;
                return L.divIcon({
                    className: '',
                    html: '<span style="display:flex;align-items:center;justify-content:center;' +
                          'width:' + tam + 'px;height:' + tam + 'px;border-radius:50%;' +
                          'background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;' +
                          'font:600 13px Outfit,sans-serif;border:3px solid rgba(255,255,255,.9);' +
                          'box-shadow:0 4px 12px rgba(124,58,237,.35);">' + n + '</span>',
                    iconSize: [tam, tam],
                });
            },
        });
        mapa.addLayer(grupo);

        fetch(contenedor.dataset.centros)
            .then(function (r) { return r.json(); })
            .then(function (datos) {
                centros = datos.centros.map(function (c) {
                    c.texto = normalizar(c.c + ' ' + c.r + ' ' + c.n);
                    c.marcador = crearMarcador(c);
                    return c;
                });
                mapa.fitBounds(L.latLngBounds(centros.map(function (c) { return [c.la, c.lo]; })), { padding: [20, 20] });
                mostrar();
            })
            .catch(function () {
                contador.textContent = 'No se pudieron cargar los centros de salud. Intenta recargar la página.';
            });

        botonesTipo.forEach(function (boton) {
            boton.addEventListener('click', function () {
                const tipo = boton.dataset.tipo;
                if (tiposActivos.has(tipo)) tiposActivos.delete(tipo); else tiposActivos.add(tipo);
                boton.classList.toggle('apagado', !tiposActivos.has(tipo));
                boton.setAttribute('aria-pressed', tiposActivos.has(tipo));
                if (centros.length) mostrar();
            });
        });

        let espera;
        if (buscador) {
            buscador.addEventListener('input', function () {
                clearTimeout(espera);
                espera = setTimeout(function () { if (centros.length) mostrar(); }, 250);
            });
        }
    }

    // El mapa se crea solo cuando la sección está por aparecer en pantalla
    if ('IntersectionObserver' in window) {
        const observador = new IntersectionObserver(function (entradas) {
            if (entradas.some(function (e) { return e.isIntersecting; })) {
                observador.disconnect();
                iniciar();
            }
        }, { rootMargin: '300px' });
        observador.observe(contenedor);
    } else {
        iniciar();
    }
});
