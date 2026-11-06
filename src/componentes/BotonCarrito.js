import { useState } from 'react';
import { Button, Badge, Offcanvas, ListGroup } from 'react-bootstrap';
import { formatearPrecio } from '../datos/tasasCambio';
import { rutaImagen } from '../datos/productos';

// ----- Componente -----
// Qué hace: es el ícono del carrito de la barra superior. Al hacer clic abre
// una vista rápida de lo que hay en el carrito, y también recibe los
// productos que se arrastran y se sueltan encima de él.
function BotonCarrito({ carrito, unidades, moneda, agregarAlCarrito, eliminarDelCarrito, cambiarSeccion }) {
  // ----- Función useState -----
  // Qué hace: "mostrar" abre o cierra el panel lateral, y "encima" recuerda si
  // hay una tarjeta arrastrada sobre el ícono para resaltarlo.
  const [mostrar, setMostrar] = useState(false);
  const [encima, setEncima] = useState(false);

  // reduce recorre el carrito y acumula el valor de cada producto.
  const subtotal = carrito.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0
  );

  // ----- Función Drag and Drop -----
  // Qué hace: preventDefault habilita que se pueda soltar sobre el ícono.
  function permitirSoltar(evento) {
    evento.preventDefault();
    setEncima(true);
  }

  // ----- Función Drag and Drop -----
  // Qué hace: igual que en ZonaCarrito, recupera el producto que guardó la
  // tarjeta y lo agrega sin sacar al usuario de la pantalla en que está.
  function soltar(evento) {
    evento.preventDefault();
    setEncima(false);

    const texto = evento.dataTransfer.getData('producto');

    if (!texto) {
      return;
    }

    agregarAlCarrito(JSON.parse(texto), false);
  }

  // ----- Función -----
  // Qué hace: cierra la vista rápida y lleva a la página completa del carrito.
  function irA(seccion) {
    setMostrar(false);
    cambiarSeccion(seccion);
  }

  return (
    <>
      <Button
        variant="outline-light"
        className={`boton-carrito position-relative ${encima ? 'encima' : ''}`}
        aria-label={`Abrir carrito, ${unidades} unidades`}
        onClick={() => setMostrar(true)}
        onDragOver={permitirSoltar}
        onDragLeave={() => setEncima(false)}
        onDrop={soltar}
      >
        <i className="bi bi-cart3 fs-5" />
        <Badge
          bg={unidades > 0 ? 'danger' : 'secondary'}
          pill
          className="position-absolute top-0 start-100 translate-middle"
        >
          {unidades}
        </Badge>
      </Button>

      {/* ----- Vista rápida ----- */}
      {/* Qué hace: panel que sale por la izquierda, del mismo lado del ícono.
          show decide si se ve y onHide se llama al tocar la X o fuera del panel. */}
      <Offcanvas show={mostrar} onHide={() => setMostrar(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="bi bi-cart3 me-2" />
            Tu carrito ({unidades})
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column">
          {carrito.length === 0 ? (
            <>
              <p className="text-muted">Todavia no has agregado productos.</p>
              <Button variant="primary" onClick={() => irA('catalogo')}>
                Ir al catalogo
              </Button>
            </>
          ) : (
            <>
              <ListGroup variant="flush" className="mb-3">
                {carrito.map((item) => (
                  <ListGroup.Item key={item.codigo} className="d-flex align-items-center gap-2 px-0">
                    {/* ----- Imágenes ----- */}
                    <img
                      src={rutaImagen(item)}
                      alt={item.nombre}
                      width="56"
                      height="40"
                      className="imagen-tabla rounded border"
                    />
                    <div className="flex-grow-1 small">
                      <div className="fw-semibold">{item.nombre}</div>
                      <span className="text-muted">
                        {item.cantidad} x {formatearPrecio(item.precio, moneda)}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="text-danger p-1"
                      aria-label={`Quitar ${item.nombre}`}
                      onClick={() => eliminarDelCarrito(item.codigo)}
                    >
                      <i className="bi bi-trash" />
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* mt-auto deja el total y los botones pegados al fondo del panel. */}
              <div className="mt-auto">
                <div className="d-flex justify-content-between fw-bold fs-5 mb-1">
                  <span>Subtotal</span>
                  <span className="text-nowrap">{formatearPrecio(subtotal, moneda)}</span>
                </div>
                <p className="small text-muted">El envio se calcula al finalizar el pedido.</p>

                <Button variant="success" size="lg" className="w-100 mb-2" onClick={() => irA('carrito')}>
                  Ver carrito y finalizar pedido
                </Button>
                <Button variant="outline-secondary" className="w-100" onClick={() => setMostrar(false)}>
                  Seguir comprando
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default BotonCarrito;
