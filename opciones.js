// ===============================
// BOTONES DE CONTROL (script aparte)
// ===============================

// Reiniciar segmentación
function reiniciarSegmentacion() {
  if (typeof RUBROS === "undefined" || typeof actualizarVista !== "function") {
    console.error("RUBROS o actualizarVista no están definidos");
    return;
  }

  Object.keys(RUBROS).forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) checkbox.checked = false;
  });

  actualizarVista(); // llama a la función principal del primer script
}

// Ver mi ubicación
function verMiUbicacion() {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada por este navegador");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      if (typeof map === "undefined") {
        console.error("El mapa no está definido");
        return;
      }

      map.setView([lat, lon], 14);

      L.marker([lat, lon], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(map).bindPopup("Tu ubicación actual").openPopup();
    },
    (err) => {
      alert("No se pudo obtener tu ubicación: " + err.message);
    }
  );
}





