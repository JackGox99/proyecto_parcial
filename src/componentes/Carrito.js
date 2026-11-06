import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { formatearPrecio } from '../datos/tasasCambio';
import { rutaImagen } from '../datos/productos';
import FormularioCompra from './FormularioCompra';

const COSTO_ENVIO = 15000;
const MINIMO_ENVIO_GRATIS = 1000000;

// ----- Componente -----
// Qué hace: muestra el resumen del carrito, calcula los totales y cierra la
// compra.
function Carrito({ carrito, moneda, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, cambiarSeccion, registrarPedido }) {
  // ----- Función useState -----
  // Qué hace: guarda el pedido ya confirmado. Mientras vale null se muestra
  // el carrito; cuando tiene datos se muestra el comprobante de compra.
  const [pedido, setPedido] = useState(null);

  // reduce recorre el arreglo y acumula el valor de cada linea.
  const subtotal = carrito.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0
  );

  const todosConEnvioGratis = carrito.every((item) => item.envioGratis);
  const envio =
    carrito.length === 0 || todosConEnvioGratis || subtotal >= MINIMO_ENVIO_GRATIS
      ? 0
      : COSTO_ENVIO;

  const total = subtotal + envio;

  // ----- Función -----
  // Qué hace: arma el pedido, lo muestra como comprobante, lo manda al
  // historial que vive en App y deja el carrito vacio.
  function confirmarCompra(datosCliente) {
    const nuevo = {
      cliente: datosCliente,
      productos: carrito,
      total,
      numero: Math.trunc(Math.random() * 900000) + 100000,
      // Se guarda en formato ISO porque es el que entiende JSON.
      fecha: new Date().toISOString(),
    };

    setPedido(nuevo);
    registrarPedido(nuevo);
    vaciarCarrito();
  }

  function volverAComprar() {
    setPedido(null);
    cambiarSeccion('catalogo');
  }

  // Vista de confirmacion despues de una compra exitosa.
  if (pedido) {
    return (
      <Container as="main" className="py-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Alert variant="success">
              <Alert.Heading>Compra confirmada</Alert.Heading>
              <p className="mb-0">
                Gracias por tu compra, {pedido.cliente.nombre}. Numero de pedido:{' '}
                <strong>{pedido.numero}</strong>
              </p>
            </Alert>

            <Card className="shadow-sm border-0 mb-3">
              <Card.Header as="h3" className="fs-5">Resumen del pedido</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Correo de confirmacion: {pedido.cliente.email}</ListGroup.Item>
                <ListGroup.Item>
                  Entrega en: {pedido.cliente.direccion}, {pedido.cliente.ciudad}
                </ListGroup.Item>
                <ListGroup.Item>Telefono de contacto: {pedido.cliente.telefono}</ListGroup.Item>
                <ListGroup.Item>Metodo de pago: {pedido.cliente.metodoPagoTexto}</ListGroup.Item>
                <ListGroup.Item className="fw-bold">
                  Total pagado: {formatearPrecio(pedido.total, moneda)}
                </ListGroup.Item>
              </ListGroup>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Header as="h3" className="fs-5">Productos comprados</Card.Header>
              <ListGroup variant="flush">
                {pedido.productos.map((item) => (
                  <ListGroup.Item key={item.codigo}>
                    {item.cantidad} x {item.nombre}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            <div className="d-flex flex-wrap gap-2">
              <Button variant="primary" onClick={volverAComprar}>
                Seguir comprando
              </Button>

              {/* ----- Enlaces ----- */}
              {/* Qué hace: lleva al historial, donde este pedido ya quedo guardado. */}
              <Button
                variant="outline-primary"
                href="#pedidos"
                onClick={(evento) => {
                  evento.preventDefault();
                  cambiarSeccion('pedidos');
                }}
              >
                Ver todos mis pedidos
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Carrito vacio.
  if (carrito.length === 0) {
    return (
      <Container as="main" className="py-4">
        <h2>Tu carrito</h2>
        <Alert variant="info" className="d-flex flex-wrap align-items-center gap-3">
          <span>Todavia no has agregado productos.</span>
          <Button
            variant="primary"
            size="sm"
            href="#catalogo"
            onClick={(evento) => {
              evento.preventDefault();
              cambiarSeccion('catalogo');
            }}
          >
            Ir al catalogo
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container as="main" className="py-4">
      <h2 className="mb-4">Tu carrito</h2>

      <Row className="g-4">
        {/* En pantallas grandes la lista y el formulario van lado a lado; en
            las más pequeñas el formulario baja debajo de la lista. */}
        <Col xl={7}>
          <Card className="shadow-sm border-0">
            {/* Cada producto es una fila de la grilla de Bootstrap en lugar de
                una fila de tabla: en celular sus partes se acomodan en dos
                renglones y en pantallas anchas quedan en uno solo. */}
            <ListGroup variant="flush">
              {carrito.map((item) => (
                <ListGroup.Item key={item.codigo} className="py-3">
                  <Row className="align-items-center g-2">
                    <Col xs={4} sm={3} md={2}>
                      {/* ----- Imágenes ----- */}
                      <img
                        src={rutaImagen(item)}
                        alt={item.nombre}
                        className="imagen-tabla rounded w-100"
                        style={{ height: '64px' }}
                      />
                    </Col>

                    <Col xs={8} sm={9} md={4}>
                      <div className="fw-semibold">{item.nombre}</div>
                      <small className="text-muted">
                        {formatearPrecio(item.precio, moneda)} c/u
                      </small>
                    </Col>

                    <Col xs={4} md={2}>
                      <Form.Control
                        type="number"
                        size="sm"
                        min="1"
                        max="10"
                        aria-label={`Cantidad de ${item.nombre}`}
                        value={item.cantidad}
                        onChange={(evento) =>
                          cambiarCantidad(item.codigo, evento.target.value)
                        }
                      />
                    </Col>

                    <Col xs={5} md={2} className="fw-semibold text-nowrap text-md-end small">
                      {formatearPrecio(item.precio * item.cantidad, moneda)}
                    </Col>

                    <Col xs={3} md={2} className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarDelCarrito(item.codigo)}
                      >
                        Quitar
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}

              <ListGroup.Item className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>{formatearPrecio(subtotal, moneda)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Envio</span>
                <span>{envio === 0 ? 'Gratis' : formatearPrecio(envio, moneda)}</span>
              </ListGroup.Item>
              <ListGroup.Item variant="primary" className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>{formatearPrecio(total, moneda)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Button variant="outline-secondary" className="mt-3" onClick={vaciarCarrito}>
            Vaciar carrito
          </Button>
        </Col>

        <Col xl={5}>
          <FormularioCompra
            totalTexto={formatearPrecio(total, moneda)}
            confirmarCompra={confirmarCompra}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Carrito;
