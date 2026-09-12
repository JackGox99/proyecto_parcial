// Pie de pagina con enlaces internos y enlaces externos.
function PiePagina({ cambiarSeccion }) {
  const enlacesExternos = [
    { texto: 'React', url: 'https://react.dev' },
    { texto: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { texto: 'TypeScript', url: 'https://www.typescriptlang.org' },
  ];

  return (
    <footer>
      <hr />

      <h3>TecnoStore</h3>

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

      <p>Tecnologias utilizadas:</p>
      <ul>
        {/* rel="noreferrer" es una buena practica al abrir enlaces externos */}
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
