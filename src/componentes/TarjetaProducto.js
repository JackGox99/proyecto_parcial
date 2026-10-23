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
    <article draggable={producto.disponible} onDragStart={iniciarArrastre}>
      <h4>{producto.nombre}</h4>

      {/* ----- Imágenes ----- */}
      <p>
        <img
          src={rutaImagen(producto)}
          alt={producto.nombre}
          width="220"
          height="150"
        />
      </p>

      <p>{producto.descripcion}</p>

      {/* ----- Objetos ----- */}
      {/* Qué hace: lee las propiedades del objeto producto para mostrarlas. */}
      <ul>
        <li>Marca: {producto.marca}</li>
        <li>Categoria: {producto.categoria}</li>
        <li>Precio: {formatearPrecio(producto.precio, moneda)}</li>
        <li>Envio: {producto.envioGratis ? 'Gratis' : 'Con costo adicional'}</li>
        <li>Estado: {producto.disponible ? 'Disponible' : 'Agotado'}</li>
      </ul>

      <details>
        <summary>Ver especificaciones tecnicas</summary>
        {/* ----- Objetos ----- */}
        {/* Qué hace: Object.entries recorre el sub-objeto "especificaciones"
            y devuelve pares de atributo y valor para listarlos. */}
        <ul>
          {Object.entries(producto.especificaciones).map(([atributo, valor]) => (
            <li key={atributo}>
              {atributo}: {valor}
            </li>
          ))}
        </ul>
      </details>

      <p>
        {/* ----- Evento ----- */}
        {/* Qué hace: onClick avisa al componente padre que hay que agregar
            este producto al carrito. Si está agotado, el botón se deshabilita. */}
        <button
          type="button"
          disabled={!producto.disponible}
          onClick={() => agregarAlCarrito(producto)}
        >
          {producto.disponible ? 'Agregar al carrito' : 'Producto agotado'}
        </button>
        {producto.disponible && <small> o arrastra la tarjeta al carrito</small>}
      </p>

      <hr />
    </article>
  );
}

export default TarjetaProducto;
