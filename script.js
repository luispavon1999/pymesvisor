// ===============================
// MAPA
// ===============================
const map = L.map("mapa").setView([12.5, -86.9], 7);

L.Control.geocoder({
  defaultMarkGeocode: false
}).on("markgeocode", function (e) {
  map.setView(e.geocode.center, 14);
}).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const capaPuntos = L.layerGroup().addTo(map);
let datos = [];
let totalGeneral = 0;


// ===============================
// RUBROS (IDs LIMPIOS)
// ===============================
const RUBROS = {
  alimentacion_bebidas: "alimentacion_bebidas",
  comercio_tiendas: "comercio_tiendas",
  educacion_formacion: "educacion_formacion",
  gobierno_comunidad_servicios_publicos: "gobierno_comunidad_servicios_publicos",
  no_clasificado_invalido: "no_clasificado_invalido",
  salud_belleza_bienestar: "salud_belleza_bienestar",
  servicios_profesionales_financieros: "servicios_profesionales_financieros",
  otros_miscelaneos: "otros_miscelaneos",
  transporte_movilidad: "transporte_movilidad",
  comercio_minorista_general_especializado: "comercio_minorista_general_especializado",
  turismo_entretenimiento: "turismo_entretenimiento",
  servicios_basicos_industria: "servicios_basicos_industria",
  alojamiento_turismo: "alojamiento_turismo",
  servicios_financieros: "servicios_financieros",
  ocio_cultura_entretenimiento: "ocio_cultura_entretenimiento",
  salud: "salud",
  telecomunicaciones_tecnologia: "telecomunicaciones_tecnologia",
  organizaciones_sociales_ong: "organizaciones_sociales_ong",
  agropecuario_pesca: "agropecuario_pesca",
  servicios_profesionales: "servicios_profesionales",
  servicios_personales_hogar: "servicios_personales_hogar",
  mascotas_animales: "mascotas_animales",
  inmobiliario_almacenamiento: "inmobiliario_almacenamiento",
  servicios_para_animales: "servicios_para_animales"
};


// ===============================
// TEXTO DEL JSON → ID LIMPIO
// ===============================
const TEXTO_A_ID = {
  "Alimentación y bebidas": "alimentacion_bebidas",
  "Comercio / Tiendas": "comercio_tiendas",
  "Educación y formación": "educacion_formacion",
  "Gobierno, comunidad y servicios públicos": "gobierno_comunidad_servicios_publicos",
  "No clasificado / inválido": "no_clasificado_invalido",
  "Salud, belleza y bienestar": "salud_belleza_bienestar",
  "Servicios profesionales y financieros": "servicios_profesionales_financieros",
  "Otros / Misceláneos": "otros_miscelaneos",
  "Transporte y movilidad": "transporte_movilidad",
  "Comercio minorista general y especializado": "comercio_minorista_general_especializado",
  "Turismo y entretenimiento": "turismo_entretenimiento",
  "Servicios básicos / Industria": "servicios_basicos_industria",
  "Alojamiento y turismo": "alojamiento_turismo",
  "Servicios financieros": "servicios_financieros",
  "Ocio, cultura y entretenimiento": "ocio_cultura_entretenimiento",
  "Salud": "salud",
  "Telecomunicaciones / Tecnología": "telecomunicaciones_tecnologia",
  "Organizaciones sociales / ONG": "organizaciones_sociales_ong",
  "Agropecuario y pesca": "agropecuario_pesca",
  "Servicios profesionales": "servicios_profesionales",
  "Servicios personales y del hogar": "servicios_personales_hogar",
  "Mascotas y animales": "mascotas_animales",
  "Inmobiliario / Almacenamiento": "inmobiliario_almacenamiento",
  "Servicios para animales": "servicios_para_animales"
};


// ===============================
// ZONAS
// ===============================
const ZONAS = {
  zona_managua: ["Managua"],

  zona_norte: [
    "Matagalpa",
    "Jinotega",
    "Madriz",
    "Nueva Segovia",
    "Estelí"
  ],

  zona_occidente: [
    "León",
    "Chinandega"
  ],

  zona_suroriente: [
    "Rivas",
    "Granada",
    "Masaya",
    "Carazo"
  ],

  zona_centro: [
    "Río San Juan",
    "Chontales",
    "Boaco"
  ],

  zona_raas: [
    "Costa Caribe Sur (RAAS)"
  ],

  zona_raan: [
    "Costa Caribe Norte (RAAN)"
  ]
};


function zonasSeleccionadas() {

  const select = document.getElementById("zonaSelect");
  if (!select) return [];

  return Array.from(select.selectedOptions).map(o => o.value);
}


// ===============================
// COLOR POR TIPO
// ===============================
function colorPorTipo(tipo) {

  const colores = {
    alimentacion_bebidas: "#e74c3c",
    comercio_tiendas: "#3498db",
    educacion_formacion: "#9b59b6",
    gobierno_comunidad_servicios_publicos: "#2c3e50",
    no_clasificado_invalido: "#7f8c8d",
    salud_belleza_bienestar: "#1abc9c",
    servicios_profesionales_financieros: "#34495e",
    otros_miscelaneos: "#95a5a6",
    transporte_movilidad: "#f39c12",
    comercio_minorista_general_especializado: "#2980b9",
    turismo_entretenimiento: "#d35400",
    servicios_basicos_industria: "#16a085",
    alojamiento_turismo: "#e67e22",
    servicios_financieros: "#27ae60",
    ocio_cultura_entretenimiento: "#8e44ad",
    salud: "#2ecc71",
    telecomunicaciones_tecnologia: "#00bcd4",
    organizaciones_sociales_ong: "#7d3c98",
    agropecuario_pesca: "#6ab04c",
    servicios_profesionales: "#273c75",
    servicios_personales_hogar: "#ff7979",
    mascotas_animales: "#f8c291",
    inmobiliario_almacenamiento: "#636e72",
    servicios_para_animales: "#fa983a"
  };

  return colores[tipo] || "#000000";
}


// ===============================
// ICONO
// ===============================
function iconoPorTipo(tipo) {

  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="
        background:${colorPorTipo(tipo)};
        width:18px;
        height:18px;
        border-radius:50% 50% 50% 0;
        transform: rotate(-45deg);
        position: relative;
      ">
        <div style="
          background:white;
          width:8px;
          height:8px;
          border-radius:50%;
          position:absolute;
          top:5px;
          left:5px;
        "></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18]
  });
}


// ===============================
// RUBROS SELECCIONADOS
// ===============================
function rubrosSeleccionados() {

  return Object.entries(RUBROS)
    .filter(([id]) => {
      const el = document.getElementById(id);
      return el && el.checked;
    })
    .map(([, val]) => val);
}


// ===============================
// MOSTRAR PUNTOS
// ===============================
function mostrarPuntos(lista) {

  capaPuntos.clearLayers();

  lista.forEach(p => {

    if (p.latitud == null || p.longitud == null) return;

    const tipoId = TEXTO_A_ID[p["TIPO NEGO"]];
    if (!tipoId) return;

    const marker = L.marker(
      [p.latitud, p.longitud],
      { icon: iconoPorTipo(tipoId) }
    );

    marker.bindPopup(`
      <strong>${p.nombre}</strong><br>
      Tipo: ${p["TIPO NEGO"]}<br>
      Rubro: ${p.rubro}<br>
      Departamento: ${p.departamento}
    `);

    capaPuntos.addLayer(marker);
  });
}


// ===============================
// CONTADORES
// ===============================
function limpiarConteo() {
  document
    .querySelectorAll(".departamentos span[id^='py_']")
    .forEach(span => span.textContent = "0");
}


function actualizarConteo(lista) {

  limpiarConteo();

  const mapa = {
    "Boaco": "py_boaco",
    "Carazo": "py_carazo",
    "Chinandega": "py_chinandega",
    "Chontales": "py_chontales",
    "Estelí": "py_esteli",
    "Granada": "py_granada",
    "Jinotega": "py_jinotega",
    "León": "py_leon",
    "Madriz": "py_madriz",
    "Managua": "py_managua",
    "Masaya": "py_masaya",
    "Matagalpa": "py_matagalpa",
    "Nueva Segovia": "py_nueva_segovia",
    "Rivas": "py_rivas",
    "Río San Juan": "py_rio_san_juan",
    "Costa Caribe Norte (RAAN)": "py_raccn",
    "Costa Caribe Sur (RAAS)": "py_raccs"
  };

  lista.forEach(p => {

    const dep = (p.departamento || "").trim();
    const id = mapa[dep];

    if (!id) return;

    const span = document.getElementById(id);
    if (!span) return;

    span.textContent = parseInt(span.textContent) + 1;
  });
}


// ===============================
// TOTALES
// ===============================
function actualizarTotalNacional(lista) {
  const el = document.getElementById("total_nacional");
  if (el) el.textContent = lista.length;
}


function actualizarPorcentaje(lista) {

  if (!totalGeneral) return;

  const el = document.getElementById("total_porcentual");
  if (!el) return;

  el.textContent =
    ((lista.length / totalGeneral) * 100).toFixed(2) + "%";
}


// ===============================
// ACTUALIZAR VISTA
// ===============================
async function actualizarVista() {

  mostrarLogoCentral();
  await new Promise(r => setTimeout(r, 60));

  const rubrosSel = rubrosSeleccionados();

  const depSelect = document.getElementById("selectDepartamento");
  const depSeleccionado = depSelect ? depSelect.value.trim() : "";

  const zonasSel = zonasSeleccionadas();

  const filtrados = datos.filter(p => {

    const tipoId = TEXTO_A_ID[p["TIPO NEGO"]];
    if (!tipoId) return false;

    const dep = (p.departamento || "").trim();

    // ----- rubros
    if (rubrosSel.length > 0) {
      if (!rubrosSel.includes(tipoId)) return false;
    } else {
      return false;
    }

    // ----- departamento
    if (depSeleccionado && dep !== depSeleccionado) return false;

    // ----- zonas
    if (zonasSel.length > 0) {

      let pertenece = false;

      for (const z of zonasSel) {

        const lista = ZONAS[z];
        if (!lista) continue;

        if (lista.includes(dep)) {
          pertenece = true;
          break;
        }
      }

      if (!pertenece) return false;
    }

    return true;
  });

  mostrarPuntos(filtrados);
  actualizarConteo(filtrados);
  actualizarTotalNacional(filtrados);
  actualizarPorcentaje(filtrados);

  ocultarLogoCentral();
}


// ===============================
// EVENTOS RUBROS
// ===============================
Object.keys(RUBROS).forEach(id => {

  const el = document.getElementById(id);

  if (el) {
    el.addEventListener("change", actualizarVista);
  }
});


// ===============================
// EVENTO DEPARTAMENTO
// ===============================
const selectDepartamento = document.getElementById("selectDepartamento");
if (selectDepartamento) {
  selectDepartamento.addEventListener("change", actualizarVista);
}


// ===============================
// EVENTO ZONAS
// ===============================
const zonaSelect = document.getElementById("zonaSelect");
if (zonaSelect) {
  zonaSelect.addEventListener("change", actualizarVista);
}


// ===============================
// CARGAR DATA
// ===============================
fetch("./pymes.json")
  .then(r => r.json())
  .then(json => {

    datos = json;
    totalGeneral = json.length;

    cargarDepartamentos(json);

    actualizarVista();
  });


// ===============================
// CARGAR DEPARTAMENTOS
// ===============================
function cargarDepartamentos(lista) {

  const select = document.getElementById("selectDepartamento");
  if (!select) return;

  select.innerHTML = `<option value="">Todos</option>`;

  const unicos = [...new Set(
    lista
      .map(p => (p.departamento || "").trim())
      .filter(d => d !== "")
  )].sort();

  unicos.forEach(dep => {

    const opt = document.createElement("option");
    opt.value = dep;
    opt.textContent = dep;
    select.appendChild(opt);
  });
}


// ===============================
// LOGO CENTRAL
// ===============================
function mostrarLogoCentral() {

  const overlay = document.getElementById("logoOverlay");
  const logo = document.getElementById("logo_central");

  if (!overlay || !logo) return;

  overlay.classList.remove("oculto");
  logo.classList.add("logo-cargando");
}


function ocultarLogoCentral() {

  const overlay = document.getElementById("logoOverlay");
  const logo = document.getElementById("logo_central");

  if (!overlay || !logo) return;

  logo.classList.remove("logo-cargando");
  overlay.classList.add("oculto");
}
