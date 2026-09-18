import { TASAS_CAMBIO } from '../datos/tasasCambio';

// ----- Componente -----
// Qué hace: dibuja la barra superior con la navegación y el selector de
// moneda. Recibe por props el estado que vive en App.
function Encabezado({ seccion, cambiarSeccion, moneda, setMoneda, unidades }) {
  // ----- Objetos -----
  // Qué hace: arreglo de objetos con los enlaces del menú. Cada objeto tiene
  // la clave de la sección y el texto que se muestra.
  const enlaces = [
    { clave: 'inicio', texto: 'Inicio' },
    { clave: 'catalogo', texto: 'Catalogo' },
    { clave: 'carrito', texto: `Carrito (${unidades})` },
    { clave: 'contacto', texto: 'Contacto' },
  ];

  // ----- Evento -----
  // Qué hace: responde al clic en un enlace. preventDefault evita que el
  // navegador recargue la página, y luego se cambia de sección.
  function manejarClic(evento, clave) {
    evento.preventDefault();
    cambiarSeccion(clave);
  }

  return (
    <header>
      <h1>TecnoStore</h1>
      <p>Tienda en linea de tecnologia para estudiantes de ingenieria.</p>

      {/* ----- Enlaces ----- */}
      {/* Qué hace: recorre el arreglo con map y pinta un enlace por cada
          sección. El enlace marcado en negrita es el que se está viendo. */}
      <nav>
        <ul>
          {enlaces.map((enlace) => (
            <li key={enlace.clave}>
              <a
                href={`#${enlace.clave}`}
                onClick={(evento) => manejarClic(evento, enlace.clave)}
              >
                {seccion === enlace.clave ? <strong>{enlace.texto}</strong> : enlace.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p>
        <label htmlFor="moneda">Ver precios en: </label>
        {/* ----- Evento ----- */}
        {/* Qué hace: onChange se dispara al elegir otra moneda y guarda la
            selección en el estado, lo que cambia los precios de toda la app. */}
        <select
          id="moneda"
          value={moneda}
          onChange={(evento) => setMoneda(evento.target.value)}
        >
          {Object.keys(TASAS_CAMBIO).map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo}
            </option>
          ))}
        </select>
      </p>

      <hr />
    </header>
  );
}

export default Encabezado;
