import { Container, Card, ListGroup, Table, Accordion, Badge, Button, Alert } from 'react-bootstrap';
import { formatearPrecio } from '../datos/tasasCambio';
import { formatearFecha } from '../datos/fechas';
import { rutaImagen } from '../datos/productos';

// ----- Componente -----
// Qué hace: muestra el historial de compras. Los pedidos los guarda App en el
// navegador, asi que siguen ahi aunque se cierre la pestaña.
function Pedidos({ pedidos, moneda, borrarPedidos, cambiarSeccion }) {
  // Cuantas unidades se han comprado en total, sumando todos los pedidos.
  const totalGastado = pedidos.reduce((suma, pedido) => suma + pedido.total, 0);

  if (pedidos.length === 0) {
    return (
      <Container as="main" className="py-4">
        <h2>Mis pedidos</h2>
        <Alert variant="info" className="d-flex flex-wrap align-items-center gap-3">
          <span>Todavia no has hecho ninguna compra.</span>
          {/* ----- Enlaces ----- */}
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
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Mis pedidos</h2>
        {/* ----- Evento ----- */}
        {/* Qué hace: borra todo el historial, tambien del navegador. */}
        <Button variant="outline-danger" size="sm" onClick={borrarPedidos}>
          Borrar el historial
        </Button>
      </div>

      <Alert variant="light" className="border">
        Has hecho {pedidos.length} {pedidos.length === 1 ? 'compra' : 'compras'}{' '}
        por un total de <strong>{formatearPrecio(totalGastado, moneda)}</strong>.
        Este historial queda guardado en tu navegador. Si cierras la pestaña y
        vuelves, sigue aqui.
      </Alert>

      {/* Los pedidos se guardan con el mas reciente de primero.
          La key junta numero y fecha, porque el numero es aleatorio y dos
          pedidos podrian sacar el mismo por casualidad. */}
      {pedidos.map((pedido) => (
        <Card as="article" key={pedido.numero + '-' + pedido.fecha} className="shadow-sm border-0 mb-3">
          <Card.Header className="d-flex flex-wrap justify-content-between gap-2">
            <h3 className="fs-5 mb-0">Pedido numero {pedido.numero}</h3>
            <Badge bg="success" className="align-self-center">
              {formatearPrecio(pedido.total, moneda)}
            </Badge>
          </Card.Header>

          <ListGroup variant="flush">
            <ListGroup.Item>Fecha: {formatearFecha(pedido.fecha)}</ListGroup.Item>
            <ListGroup.Item>A nombre de: {pedido.cliente.nombre}</ListGroup.Item>
            <ListGroup.Item>
              Entrega en: {pedido.cliente.direccion}, {pedido.cliente.ciudad}
            </ListGroup.Item>
            <ListGroup.Item>Metodo de pago: {pedido.cliente.metodoPagoTexto}</ListGroup.Item>
          </ListGroup>

          {/* Qué hace: el Accordion reemplaza al details/summary. Arranca
              cerrado y se abre al tocar el encabezado. */}
          <Accordion flush>
            <Accordion.Item eventKey="productos">
              <Accordion.Header>
                Ver los {pedido.productos.length} productos de este pedido
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <Table responsive className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="d-none d-sm-table-cell">Imagen</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.productos.map((item) => (
                      <tr key={item.codigo}>
                        <td className="d-none d-sm-table-cell">
                          {/* ----- Imágenes ----- */}
                          <img
                            src={rutaImagen(item)}
                            alt={item.nombre}
                            width="90"
                            height="62"
                            className="imagen-tabla rounded"
                          />
                        </td>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td className="text-nowrap">
                          {formatearPrecio(item.precio * item.cantidad, moneda)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      ))}
    </Container>
  );
}

export default Pedidos;
