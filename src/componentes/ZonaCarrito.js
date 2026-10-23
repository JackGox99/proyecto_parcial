import { useState } from 'react';

// ----- Componente -----
// Qué hace: es la zona donde se sueltan los productos arrastrados. Sigue el
// mismo patrón de la Casilla del tablero de ajedrez que hicimos en clase.
function ZonaCarrito({ agregarAlCarrito, unidades }) {
  // ----- Función useState -----
  // Qué hace: recuerda si hay una tarjeta encima, para cambiar el mensaje.
  // Como no usamos CSS, el aviso se da con el texto y no con el color.
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
    <fieldset onDragOver={permitirSoltar} onDragLeave={salirDeLaZona} onDrop={soltar}>
      <legend>Carrito</legend>

      <p>
        {encima
          ? 'Suelta aqui para agregarlo al carrito.'
          : 'Arrastra cualquier tarjeta de producto hasta esta zona.'}
      </p>

      <p>El carrito tiene {unidades} unidades.</p>

      {ultimo !== '' && <p>Ultimo agregado arrastrando: {ultimo}</p>}
    </fieldset>
  );
}

export default ZonaCarrito;
