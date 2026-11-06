import { Container, Row, Col } from 'react-bootstrap';

// ----- Componente -----
// Qué hace: dibuja el pie de página con los enlaces internos y externos.
function PiePagina({ cambiarSeccion }) {
  // ----- Objetos -----
  // Qué hace: arreglo de objetos con el texto y la dirección de cada enlace
  // externo.
  const enlacesExternos = [
    { texto: 'React', url: 'https://react.dev' },
    { texto: 'React Bootstrap', url: 'https://react-bootstrap.github.io' },
    { texto: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { texto: 'TypeScript', url: 'https://www.typescriptlang.org' },
  ];

  // ----- Objetos -----
  // Qué hace: arreglo con las secciones a las que se puede saltar desde el pie.
  const enlacesInternos = [
    { clave: 'inicio', texto: 'Inicio' },
    { clave: 'catalogo', texto: 'Catalogo' },
    { clave: 'contacto', texto: 'Contacto' },
  ];

  return (
    // mt-auto empuja el pie al fondo aunque la sección tenga poco contenido.
    <footer className="bg-dark text-light mt-auto pt-4 pb-3">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h3 className="fs-5">TecnoStore</h3>
            <p className="text-secondary small">
              Tienda en linea de tecnologia para estudiantes de ingenieria.
            </p>
          </Col>

          <Col sm={6} md={4}>
            {/* ----- Enlaces ----- */}
            {/* Qué hace: enlaces internos. Cada uno evita la recarga de la página
                con preventDefault y luego cambia la sección que se muestra. */}
            <p className="fw-semibold mb-2">Secciones del sitio</p>
            <ul className="list-unstyled">
              {enlacesInternos.map((enlace) => (
                <li key={enlace.clave}>
                  <a
                    href={`#${enlace.clave}`}
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                    onClick={(evento) => {
                      evento.preventDefault();
                      cambiarSeccion(enlace.clave);
                    }}
                  >
                    {enlace.texto}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          <Col sm={6} md={4}>
            {/* ----- Enlaces ----- */}
            {/* Qué hace: enlaces externos. Se abren en otra pestaña con target
                blank, y rel="noreferrer" es buena práctica de seguridad. */}
            <p className="fw-semibold mb-2">Tecnologias utilizadas</p>
            <ul className="list-unstyled">
              {enlacesExternos.map((enlace) => (
                <li key={enlace.url}>
                  <a
                    href={enlace.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                  >
                    {enlace.texto}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary" />
        <p className="text-secondary small text-center mb-0">
          Proyecto academico - Desarrollo en Plataformas
        </p>
      </Container>
    </footer>
  );
}

export default PiePagina;
