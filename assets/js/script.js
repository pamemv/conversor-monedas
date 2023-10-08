// Elementos del DOM

const monedaInput = document.querySelector("input");
const monedaSelect = document.querySelector("select");
const btn = document.querySelector("button");
const resultSpan = document.getElementById("result");
const chartDom = document.getElementById("myChart");

// URL de api
const urlAPI = "https://mindicador.cl/api/";
let myChart;

// Evento para el boton
btn.addEventListener("click", () => {
  // Traer el valor de la moneda input

  const valorMonedaInput = monedaInput.value;
  const tipoMonedaSelect = monedaSelect.value;

  searchData(tipoMonedaSelect, valorMonedaInput);
});

// funciones

// busqueda
async function searchData(tipoMoneda, valorMoneda) {
  try {
    if (valorMoneda > 0) {
      const res = await fetch(urlAPI + tipoMoneda);
      const data = await res.json();
      const { serie } = data;

      // data de gráfico
      const datos = crearData(serie.slice(0, 10).reverse());

      // destruir gráfica
      if (myChart) {
        myChart.destroy();
      }

      // Renderizar el gráfico
      renderGrafica(datos);

      // obtener el valor de la moneda y retornarla
      const valorMonedaSeleccionada = data.serie[0].valor;

      // agregar
      resultSpan.innerHTML =
        (valorMoneda / valorMonedaSeleccionada).toFixed(2) + "$";
    }
  } catch (error) {
    console.log("Falló en cargar", error);
  }
}

// Render grafico
function renderGrafica(data) {
  const config = {
    type: "line",
    data: data,
  };

  myChart = new Chart(chartDom, config);
}

// Crear data
function crearData(serie) {
  // Iterar serie para obtener un formato para la fecha
  const labels = serie.map(({ fecha }) => formateoFecha(fecha));
  // Iterar serie para obtener valor
  const valorSerieMap = serie.map(({ valor }) => valor);
  // Crear data para el gráfico
  const datasets = [
    {
      label: "Histórico",
      borderColor: "rgb(75, 192, 192)",
      data: valorSerieMap,
    },
  ];

  // Retornar la data
  return { labels, datasets };
}

// Formatear fecha
function formateoFecha(fecha) {
  date = new Date(fecha);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${day} - ${month} - ${year}`;
}
