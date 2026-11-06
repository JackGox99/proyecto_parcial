import { Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { formatearPrecio } from '../datos/tasasCambio';
import { rutaImagen } from '../datos/productos';

// ----- Componente -----
// Qué hace: dibuja un solo producto. Lo usan el catálogo propio y la sección
// de novedades que viene del servidor, porque ambos le pasan un producto con
// la misma forma. Recibe todo por props y no guarda estado propio.
function TarjetaProducto({ producto, moneda, agregarAlCarrito }) {
  // ----- Función Drag and Drop -----
  // Qué hace: se dispara al empezar a arrastrar la tarjeta. Guarda el producto
  // convertido a texto, porque dataTransfer solo transporta cadenas.
  function iniciarArrastre(evento) {
    evento.dataTransfer.setData('producto', JSON.stringify(producto));
  }

  return (
    <Card
      className="tarjeta-producto h-100 shadow-sm border-0"
      draggable={producto.disponible}
      onDragStart={iniciarArrastre}
    >
      {/* ----- Imágenes ----- */}
      <Card.Img
        variant="top"
        src={rutaImagen(producto)}
        alt={producto.nombre}
        className="imagen-producto"
      />

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="me-1">{producto.categoria}</Badge>
          {producto.envioGratis && <Badge bg="info" className="me-1">Envio gratis</Badge>}
          <Badge bg={producto.disponible ? 'success' : 'danger'}>
            {producto.disponible ? 'Disponible' : 'Agotado'}
          </Badge>
        </div>

        <Card.Title as="h4" className="fs-5">{producto.nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{producto.marca}</Card.Subtitle>

        <Card.Text className="small">{producto.descripcion}</Card.Text>

        {/* ----- Objetos ----- */}
        {/* Qué hace: lee las propiedades del objeto producto para mostrarlas. */}
        <p className="fs-4 fw-bold text-primary text-nowrap mb-2">
          {formatearPrecio(producto.precio, moneda)}
        </p>

        <details className="mb-3 small">
          <summary>Ver especificaciones tecnicas</summary>
          {/* ----- Objetos ----- */}
          {/* Qué hace: Object.entries recorre el sub-objeto "especificaciones"
              y devuelve pares de atributo y valor para listarlos. */}
          <ListGroup variant="flush" className="mt-2">
            {Object.entries(producto.especificaciones).map(([atributo, valor]) => (
              <ListGroup.Item key={atributo} className="px-0 py-1">
                <span className="text-muted">{atributo}:</span> {valor}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </details>

        {/* mt-auto empuja el botón al fondo para que todas las tarjetas de la
            fila queden alineadas aunque tengan textos de distinto largo. */}
        <div className="mt-auto">
          {/* ----- Evento ----- */}
          {/* Qué hace: onClick avisa al componente padre que hay que agregar
              este producto al carrito. Si está agotado, el botón se deshabilita. */}
          <Button
            className="w-100"
            variant={producto.disponible ? 'primary' : 'outline-secondary'}
            disabled={!producto.disponible}
            onClick={() => agregarAlCarrito(producto)}
          >
            {producto.disponible ? 'Agregar al carrito' : 'Producto agotado'}
          </Button>
          {producto.disponible && (
            <small className="d-block text-center text-muted mt-1">
              o arrastra la tarjeta al carrito
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TarjetaProducto;
