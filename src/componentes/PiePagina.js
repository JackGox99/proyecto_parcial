// ----- Componente -----
// Qué hace: dibuja el pie de página con los enlaces internos y externos.
function PiePagina({ cambiarSeccion }) {
  // ----- Objetos -----
  // Qué hace: arreglo de objetos con el texto y la dirección de cada enlace
  // externo.
  const enlacesExternos = [
    { texto: 'React', url: 'https://react.dev' },
    { texto: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { texto: 'TypeScript', url: 'https://www.typescriptlang.org' },
  ];

  return (
    <footer>
      <hr />

      <h3>TecnoStore</h3>

      {/* ----- Enlaces ----- */}
      {/* Qué hace: enlaces internos. Cada uno evita la recarga de la página
          con preventDefault y luego cambia la sección que se muestra. */}
      <p>Secciones del sitio:</p>
      <ul>
        <li>
          <a
            href="#inicio"
            onClick={(evento) => {
              evento.preventDefault();
              cambiarSeccion('inicio');
            }}
          >
            Inicio
          </a>
        </li>
        <li>
          <a
            href="#catalogo"
            onClick={(evento) => {
              evento.preventDefault();
              cambiarSeccion('catalogo');
            }}
          >
            Catalogo
          </a>
        </li>
        <li>
          <a
            href="#contacto"
            onClick={(evento) => {
              evento.preventDefault();
              cambiarSeccion('contacto');
            }}
          >
            Contacto
          </a>
        </li>
      </ul>

      {/* ----- Enlaces ----- */}
      {/* Qué hace: enlaces externos. Se abren en otra pestaña con target
          blank, y rel="noreferrer" es buena práctica de seguridad. */}
      <p>Tecnologias utilizadas:</p>
      <ul>
        {enlacesExternos.map((enlace) => (
          <li key={enlace.url}>
            <a href={enlace.url} target="_blank" rel="noreferrer">
              {enlace.texto}
            </a>
          </li>
        ))}
      </ul>

      <p>
        <small>
          Proyecto academico de Desarrollo en Plataformas. Primera entrega sin
          estilos, enfocada en la funcionalidad.
        </small>
      </p>
    </footer>
  );
}

export default PiePagina;
