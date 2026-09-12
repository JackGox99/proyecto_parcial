import { TASAS_CAMBIO } from '../datos/tasasCambio';

// Barra superior con los enlaces de navegacion y el selector de moneda.
// Recibe por props el estado que vive en App y las funciones que lo modifican.
function Encabezado({ seccion, cambiarSeccion, moneda, setMoneda, unidades }) {
  const enlaces = [
    { clave: 'inicio', texto: 'Inicio' },
    { clave: 'catalogo', texto: 'Catalogo' },
    { clave: 'carrito', texto: `Carrito (${unidades})` },
    { clave: 'contacto', texto: 'Contacto' },
  ];

  // Evita que el navegador recargue la pagina y cambia la seccion con useState.
  function manejarClic(evento, clave) {
    evento.preventDefault();
    cambiarSeccion(clave);
  }

  return (
    <header>
      <h1>TecnoStore</h1>
      <p>Tienda en linea de tecnologia para estudiantes de ingenieria.</p>

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
