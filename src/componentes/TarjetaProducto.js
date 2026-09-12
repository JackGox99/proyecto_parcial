import { formatearPrecio } from '../datos/tasasCambio';

// Componente hijo reutilizable: dibuja un solo producto.
// Recibe el objeto completo por props y no guarda estado propio.
function TarjetaProducto({ producto, moneda, agregarAlCarrito }) {
  return (
    <article>
      <h4>{producto.nombre}</h4>

      <p>{producto.descripcion}</p>

      <ul>
        <li>Marca: {producto.marca}</li>
        <li>Categoria: {producto.categoria}</li>
        <li>Precio: {formatearPrecio(producto.precio, moneda)}</li>
        <li>Envio: {producto.envioGratis ? 'Gratis' : 'Con costo adicional'}</li>
        <li>Estado: {producto.disponible ? 'Disponible' : 'Agotado'}</li>
      </ul>

      <details>
        <summary>Ver especificaciones tecnicas</summary>
        <ul>
          {/* Object.entries recorre el sub-objeto "especificaciones" */}
          {Object.entries(producto.especificaciones).map(([atributo, valor]) => (
            <li key={atributo}>
              {atributo}: {valor}
            </li>
          ))}
        </ul>
      </details>

      <p>
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
