// === PEGÁ TU LINK NUEVO DE GOOGLE APPS SCRIPT AQUÍ ===
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbyWNugJK4MZ391mTE-qdSZLaZToAc_5ChlSQ619N2gmCt6vWS0n4hS-g_-QBhW4N1-w/exec";

const form = document.getElementById('f');
const btn = document.getElementById('btn');
const msg = document.getElementById('msg');
const btnText = btn.querySelector('span');
const btnIcon = btn.querySelector('i');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.className = ''; msg.textContent = '';
  
  const cedula = document.getElementById('ced').value.trim();
  const telefono = document.getElementById('tel').value.trim();
  const factura = document.getElementById('fac').value.trim();
  const total = parseFloat(document.getElementById('tot').value.trim());

  if (total < 1500) {
    msg.className = 'show error';
    msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> El total debe ser de al menos C$ 1,500.00 para participar.';
    return;
  }

  if (ENDPOINT_URL === "TU_NUEVO_LINK_AQUI" || ENDPOINT_URL.includes('PEGA_AQUI')) {
    msg.className = 'show error';
    msg.innerHTML = '<i class="fa-solid fa-link-slash"></i> Falta poner el link de Google en el archivo script.js';
    return;
  }

  // Animación de carga
  btn.disabled = true; 
  btnText.textContent = 'Procesando...';
  btnIcon.className = 'fa-solid fa-spinner fa-spin'; 

  try {
    // Hacemos UN SOLO viaje al servidor
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ cedula, telefono, factura, total })
    });
    
    // Leemos qué nos respondió Google
    const respuestaServer = await res.json();

    // Si Google dice que ya existe, lo bloqueamos
    if (respuestaServer.estado === "duplicado") {
      msg.className = 'show error';
      msg.innerHTML = '<i class="fa-solid fa-ban"></i> ¡Esta factura ya está registrada!';
      resetBoton();
      return;
    }

    // Si Google dice que fue un éxito, lanzamos el confeti
    document.getElementById('formWrap').style.display = 'none';
    document.getElementById('done').classList.add('show');
    lanzarConfeti();

  } catch (err) {
    msg.className = 'show error';
    msg.innerHTML = '<i class="fa-solid fa-wifi"></i> Error de conexión. Revisá tu internet.';
    resetBoton();
  }
});

function resetBoton() {
  btn.disabled = false; 
  btnText.textContent = 'Validar y Guardar';
  btnIcon.className = 'fa-solid fa-arrow-right';
}

function lanzarConfeti() {
  var duration = 3000;
  var end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#4ade80', '#3b82f6', '#ffffff'] });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#4ade80', '#3b82f6', '#ffffff'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
}
