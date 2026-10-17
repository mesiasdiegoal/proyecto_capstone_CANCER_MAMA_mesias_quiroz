/* ===================================================
   LANDING — aparición al hacer scroll, contadores y menú
   Red Mamaria Preventiva
   =================================================== */
document.addEventListener('DOMContentLoaded', function () {
    iniciarApariciones();
    iniciarMenuMovil();
});

/* ---- Contador animado para las cifras ---- */
function contar(el) {
    const meta = parseFloat(el.dataset.contar);
    const decimales = parseInt(el.dataset.decimales || '0', 10);
    const prefijo = el.dataset.prefijo || '';
    const sufijo = el.dataset.sufijo || '';
    const duracion = 1400;
    const inicio = performance.now();

    function paso(ahora) {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const valor = meta * (1 - Math.pow(1 - t, 3));
        el.textContent = prefijo + valor.toFixed(decimales) + sufijo;
        if (t < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
}

/* ---- Aparición de secciones al hacer scroll ---- */
function iniciarApariciones() {
    const elementos = document.querySelectorAll('.aparece');

    if (!('IntersectionObserver' in window)) {
        elementos.forEach(el => el.classList.add('visible'));
        return;
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add('visible');
            entrada.target.querySelectorAll('[data-contar]').forEach(contar);
            observador.unobserve(entrada.target);
        });
    }, { threshold: 0.15 });

    elementos.forEach(el => observador.observe(el));
}

/* ---- Cierra el menú móvil al elegir una sección ---- */
function iniciarMenuMovil() {
    const menuEl = document.getElementById('menuLanding');
    if (!menuEl || typeof bootstrap === 'undefined') return;

    menuEl.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const menu = bootstrap.Collapse.getInstance(menuEl);
            if (menu) menu.hide();
        });
    });
}
