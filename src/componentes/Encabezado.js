import { Navbar, Nav, Container, Form, Badge } from 'react-bootstrap';
import { TASAS_CAMBIO } from '../datos/tasasCambio';
import BotonCarrito from './BotonCarrito';

// ----- Componente -----
// Qué hace: dibuja la barra superior: el carrito a la izquierda, los enlaces
// de las secciones en el centro y la moneda con el logo a la derecha.
// Recibe por props el estado que vive en App.
function Encabezado({ seccion, cambiarSeccion, moneda, setMoneda, carrito, unidades, pedidosHechos, agregarAlCarrito, eliminarDelCarrito }) {
  // ----- Objetos -----
  // Qué hace: arreglo de objetos con los enlaces del menú. Cada objeto tiene
  // la clave de la sección, el texto que se muestra y, si aplica, el número
  // que va en la etiqueta (Badge) al lado del texto. El carrito no está aquí
  // porque tiene su propio ícono a la izquierda.
  const enlaces = [
    { clave: 'inicio', texto: 'Inicio' },
    { clave: 'catalogo', texto: 'Catalogo' },
    { clave: 'novedades', texto: 'Novedades en linea' },
    { clave: 'pedidos', texto: 'Mis pedidos', contador: pedidosHechos },
    { clave: 'contacto', texto: 'Contacto' },
    { clave: 'administrar', texto: 'Administrar' },
  ];

  // ----- Evento -----
  // Qué hace: responde al clic en un enlace. preventDefault evita que el
  // navegador recargue la página, y luego se cambia de sección.
  function manejarClic(evento, clave) {
    evento.preventDefault();
    cambiarSeccion(clave);
  }

  return (
    // expand hace que los enlaces siempre se vean en fila, sin menú de
    // hamburguesa. En pantallas angostas pasan a un segundo renglón que se
    // puede deslizar de lado (ver .menu-secciones en index.css).
    <Navbar bg="dark" data-bs-theme="dark" expand sticky="top" className="py-2">
      <Container className="flex-wrap gap-2">
        <BotonCarrito
          carrito={carrito}
          unidades={unidades}
          moneda={moneda}
          agregarAlCarrito={agregarAlCarrito}
          eliminarDelCarrito={eliminarDelCarrito}
          cambiarSeccion={cambiarSeccion}
        />

        {/* ----- Enlaces ----- */}
        {/* Qué hace: recorre el arreglo con map y pinta un enlace por cada
            sección. activeKey resalta el enlace de la sección que se está
            viendo y onSelect recibe la clave del enlace que se tocó. */}
        <Nav
          className="menu-secciones"
          activeKey={seccion}
          onSelect={(clave, evento) => manejarClic(evento, clave)}
        >
          {enlaces.map((enlace) => (
            <Nav.Link
              key={enlace.clave}
              eventKey={enlace.clave}
              href={`#${enlace.clave}`}
              className="text-nowrap"
            >
              {enlace.texto}
              {enlace.contador !== undefined && (
                <Badge bg={enlace.contador > 0 ? 'primary' : 'secondary'} pill className="ms-1">
                  {enlace.contador}
                </Badge>
              )}
            </Nav.Link>
          ))}
        </Nav>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <Form.Label htmlFor="moneda" className="text-light mb-0 text-nowrap d-none d-sm-inline">
            Ver precios en:
          </Form.Label>
          {/* ----- Evento ----- */}
          {/* Qué hace: onChange se dispara al elegir otra moneda y guarda la
              selección en el estado, lo que cambia los precios de toda la app. */}
          <Form.Select
            id="moneda"
            size="sm"
            aria-label="Moneda"
            value={moneda}
            onChange={(evento) => setMoneda(evento.target.value)}
          >
            {Object.keys(TASAS_CAMBIO).map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </Form.Select>

          {/* ----- Imágenes ----- */}
          {/* Qué hace: el logo de la tienda. Al tocarlo vuelve al inicio. */}
          <Navbar.Brand
            href="#inicio"
            className="me-0 p-0"
            onClick={(evento) => manejarClic(evento, 'inicio')}
          >
            <img
              src={process.env.PUBLIC_URL + '/imagenes/logo-ts.svg'}
              alt="TecnoStore"
              width="40"
              height="40"
            />
          </Navbar.Brand>
        </div>
      </Container>
    </Navbar>
  );
}

export default Encabezado;
