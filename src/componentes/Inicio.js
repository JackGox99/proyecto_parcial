import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { PRODUCTOS, rutaImagen } from '../datos/productos';
import { formatearPrecio } from '../datos/tasasCambio';

// ----- Componente -----
// Qué hace: es la página principal. Presenta la tienda, explica por qué
// escogimos el tema y muestra los productos destacados.
function Inicio({ moneda, cambiarSeccion, agregarAlCarrito }) {
  // Qué hace: saca los tres productos disponibles más económicos. No están
  // escritos a mano, se calculan desde el catálogo en cada render.
  const destacados = PRODUCTOS
    .filter((producto) => producto.disponible)
    .sort((a, b) => a.precio - b.precio)
    .slice(0, 3);

  const totalProductos = PRODUCTOS.length;
  const conEnvioGratis = PRODUCTOS.filter((producto) => producto.envioGratis).length;

  // ----- Objetos -----
  // Qué hace: cada objeto es una tarjeta de la sección "Que ofrecemos".
  const ofrecemos = [
    { titulo: `${totalProductos} productos`, texto: 'En catalogo, organizados por categoria.' },
    { titulo: `${conEnvioGratis} con envio gratis`, texto: 'A cualquier ciudad del pais.' },
    { titulo: 'Varias monedas', texto: 'Cambia la moneda desde el menu superior.' },
    { titulo: 'Garantia directa', texto: 'Con el fabricante en cada referencia.' },
  ];

  return (
    <Container as="main" className="py-4">
      <div className="portada text-white rounded-4 p-4 p-md-5 mb-5 shadow">
        <h2 className="display-5 fw-bold">Bienvenido a TecnoStore</h2>

        <blockquote className="lead my-4">
          Armamos tu equipo de estudio y trabajo sin pagar de mas. Portatiles,
          perifericos, componentes y monitores con garantia y envio a todo el pais.
        </blockquote>

        <Button
          variant="light"
          size="lg"
          href="#catalogo"
          onClick={(evento) => { evento.preventDefault(); cambiarSeccion('catalogo'); }}
        >
          Ver el catalogo completo
        </Button>
      </div>

      <Row className="g-4 mb-5">
        <Col lg={6}>
          <h3>Por que escogimos este tema</h3>
          <p>
            Somos estudiantes de Ingenieria de Sistemas y comprar tecnologia es una
            decision que enfrentamos todos los semestres. Conocemos el producto, sabemos
            que informacion le hace falta al comprador y entendemos las dudas tecnicas que
            aparecen al comparar equipos.
          </p>
          <p>
            Ademas, un catalogo de tecnologia nos obliga a manejar objetos con muchos
            atributos, filtros por categoria, un carrito con cantidades y validaciones de
            formulario. Es decir, es el tema que mejor nos permite aplicar todo lo que
            vimos en clase.
          </p>
        </Col>

        <Col lg={6}>
          <h3>Que ofrecemos</h3>
          <Row xs={1} sm={2} className="g-3">
            {ofrecemos.map((item) => (
              <Col key={item.titulo}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-primary">{item.titulo}</Card.Title>
                    <Card.Text>{item.texto}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <h3>Productos destacados</h3>
      <p className="text-muted">Las opciones disponibles mas economicas del catalogo.</p>

      <Card className="shadow-sm">
        <Table responsive hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              {/* d-none d-md-table-cell: la columna se oculta en celular. */}
              <th className="d-none d-md-table-cell">Categoria</th>
              <th className="d-none d-sm-table-cell">Precio</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {destacados.map((producto) => (
              <tr key={producto.codigo}>
                <td>
                  {/* ----- Imágenes ----- */}
                  <img
                    src={rutaImagen(producto)}
                    alt={producto.nombre}
                    width="140"
                    height="96"
                    className="imagen-tabla imagen-destacado rounded"
                  />
                </td>
                <td>
                  <div className="fw-semibold">{producto.nombre}</div>
                  {/* En celular el precio se muestra aquí, bajo el nombre,
                      porque su columna está oculta. */}
                  <small className="d-sm-none text-primary fw-semibold">
                    {formatearPrecio(producto.precio, moneda)}
                  </small>
                </td>
                <td className="d-none d-md-table-cell">{producto.categoria}</td>
                <td className="d-none d-sm-table-cell text-nowrap">
                  {formatearPrecio(producto.precio, moneda)}
                </td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => agregarAlCarrito(producto)}>
                    Agregar
                    <span className="d-none d-lg-inline"> al carrito</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default Inicio;
