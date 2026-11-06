import { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';

// ----- Componente -----
// Qué hace: es la zona donde se sueltan los productos arrastrados. Sigue el
// mismo patrón de la Casilla del tablero de ajedrez que hicimos en clase.
function ZonaCarrito({ agregarAlCarrito, unidades }) {
  // ----- Función useState -----
  // Qué hace: recuerda si hay una tarjeta encima, para cambiar el mensaje y
  // agregar la clase "encima", que pinta la zona de verde.
  const [encima, setEncima] = useState(false);
  const [ultimo, setUltimo] = useState('');

  // ----- Función Drag and Drop -----
  // Qué hace: por defecto el navegador no deja soltar nada encima de un
  // elemento. preventDefault es lo que habilita el soltar.
  function permitirSoltar(evento) {
    evento.preventDefault();
    setEncima(true);
  }

  // ----- Función Drag and Drop -----
  // Qué hace: se dispara cuando la tarjeta sale de la zona sin soltarse.
  function salirDeLaZona() {
    setEncima(false);
  }

  // ----- Función Drag and Drop -----
  // Qué hace: se dispara al soltar. Recupera el texto que guardó la tarjeta,
  // lo vuelve a convertir en objeto y lo agrega al carrito.
  function soltar(evento) {
    evento.preventDefault();
    setEncima(false);

    const texto = evento.dataTransfer.getData('producto');

    if (!texto) {
      return;
    }

    const producto = JSON.parse(texto);

    // El segundo parámetro en false evita que la pantalla salte al carrito.
    agregarAlCarrito(producto, false);
    setUltimo(producto.nombre);
  }

  return (
    <Card
      className={`zona-carrito mb-4 ${encima ? 'encima' : ''}`}
      onDragOver={permitirSoltar}
      onDragLeave={salirDeLaZona}
      onDrop={soltar}
    >
      <Card.Body className="text-center py-4">
        <Card.Title>
          Carrito <Badge bg="primary" pill>{unidades}</Badge>
        </Card.Title>

        <Card.Text className="mb-0">
          {encima
            ? 'Suelta aqui para agregarlo al carrito.'
            : 'Arrastra cualquier tarjeta de producto hasta esta zona.'}
        </Card.Text>

        {ultimo !== '' && (
          <Card.Text className="small text-success mt-2 mb-0">
            Ultimo agregado arrastrando: {ultimo}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default ZonaCarrito;
