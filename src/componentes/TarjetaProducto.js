import { formatearPrecio } from '../datos/tasasCambio';

// ----- Componente -----
// Qué hace: dibuja un solo producto del catálogo. Recibe el objeto completo
// por props y no guarda estado propio, por eso se puede reutilizar.
function TarjetaProducto({ producto, moneda, agregarAlCarrito }) {
  return (
    <article>
      <h4>{producto.nombre}</h4>

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
      </p>

      <hr />
    </article>
  );
}

export default TarjetaProducto;
