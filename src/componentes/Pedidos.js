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
      <main>
        <h2>Mis pedidos</h2>
        <p>Todavia no has hecho ninguna compra.</p>
        <p>
          {/* ----- Enlaces ----- */}
          <a
            href="#catalogo"
            onClick={(evento) => {
              evento.preventDefault();
              cambiarSeccion('catalogo');
            }}
          >
            Ir al catalogo
          </a>
        </p>
      </main>
    );
  }

  return (
    <main>
      <h2>Mis pedidos</h2>

      <p>
        Has hecho {pedidos.length} {pedidos.length === 1 ? 'compra' : 'compras'}{' '}
        por un total de {formatearPrecio(totalGastado, moneda)}.
      </p>

      <p>
        Este historial queda guardado en tu navegador. Si cierras la pestaña y
        vuelves, sigue aqui.
      </p>

      <hr />

      {/* Los pedidos se guardan con el mas reciente de primero.
          La key junta numero y fecha, porque el numero es aleatorio y dos
          pedidos podrian sacar el mismo por casualidad. */}
      {pedidos.map((pedido) => (
        <article key={pedido.numero + '-' + pedido.fecha}>
          <h3>Pedido numero {pedido.numero}</h3>

          <ul>
            <li>Fecha: {formatearFecha(pedido.fecha)}</li>
            <li>A nombre de: {pedido.cliente.nombre}</li>
            <li>
              Entrega en: {pedido.cliente.direccion}, {pedido.cliente.ciudad}
            </li>
            <li>Metodo de pago: {pedido.cliente.metodoPagoTexto}</li>
            <li>
              Total pagado: <strong>{formatearPrecio(pedido.total, moneda)}</strong>
            </li>
          </ul>

          <details>
            <summary>
              Ver los {pedido.productos.length} productos de este pedido
            </summary>

            <table border="1">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.productos.map((item) => (
                  <tr key={item.codigo}>
                    <td>
                      {/* ----- Imágenes ----- */}
                      <img
                        src={rutaImagen(item)}
                        alt={item.nombre}
                        width="90"
                        height="62"
                      />
                    </td>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>
                      {formatearPrecio(item.precio * item.cantidad, moneda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <hr />
        </article>
      ))}

      <p>
        {/* ----- Evento ----- */}
        {/* Qué hace: borra todo el historial, tambien del navegador. */}
        <button type="button" onClick={borrarPedidos}>
          Borrar el historial
        </button>
      </p>
    </main>
  );
}

export default Pedidos;
