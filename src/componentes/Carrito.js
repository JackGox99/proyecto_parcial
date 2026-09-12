import { useState } from 'react';
import { formatearPrecio } from '../datos/tasasCambio';
import FormularioCompra from './FormularioCompra';

const COSTO_ENVIO = 15000;
const MINIMO_ENVIO_GRATIS = 1000000;

// Resumen del carrito, calculo de totales y cierre de la compra.
function Carrito({ carrito, moneda, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, cambiarSeccion }) {
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

  // Se guarda el pedido confirmado y se vacia el carrito.
  function confirmarCompra(datosCliente) {
    setPedido({
      cliente: datosCliente,
      productos: carrito,
      total,
      numero: Math.trunc(Math.random() * 900000) + 100000,
    });
    vaciarCarrito();
  }

  function volverAComprar() {
    setPedido(null);
    cambiarSeccion('catalogo');
  }

  // Vista de confirmacion despues de una compra exitosa.
  if (pedido) {
    return (
      <main>
        <h2>Compra confirmada</h2>

        <p>
          <mark>Gracias por tu compra, {pedido.cliente.nombre}.</mark>
        </p>

        <p>Numero de pedido: {pedido.numero}</p>

        <h3>Resumen del pedido</h3>
        <ul>
          <li>Correo de confirmacion: {pedido.cliente.email}</li>
          <li>Entrega en: {pedido.cliente.direccion}, {pedido.cliente.ciudad}</li>
          <li>Telefono de contacto: {pedido.cliente.telefono}</li>
          <li>Metodo de pago: {pedido.cliente.metodoPagoTexto}</li>
          <li>Total pagado: {formatearPrecio(pedido.total, moneda)}</li>
        </ul>

        <h3>Productos comprados</h3>
        <ul>
          {pedido.productos.map((item) => (
            <li key={item.codigo}>
              {item.cantidad} x {item.nombre}
            </li>
          ))}
        </ul>

        <p>
          <button type="button" onClick={volverAComprar}>
            Seguir comprando
          </button>
        </p>
      </main>
    );
  }

  // Carrito vacio.
  if (carrito.length === 0) {
    return (
      <main>
        <h2>Tu carrito</h2>
        <p>Todavia no has agregado productos.</p>
        <p>
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
      <h2>Tu carrito</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Quitar</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item) => (
            <tr key={item.codigo}>
              <td>{item.nombre}</td>
              <td>{formatearPrecio(item.precio, moneda)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={item.cantidad}
                  onChange={(evento) =>
                    cambiarCantidad(item.codigo, evento.target.value)
                  }
                />
              </td>
              <td>{formatearPrecio(item.precio * item.cantidad, moneda)}</td>
              <td>
                <button type="button" onClick={() => eliminarDelCarrito(item.codigo)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3">Subtotal</th>
            <td colSpan="2">{formatearPrecio(subtotal, moneda)}</td>
          </tr>
          <tr>
            <th colSpan="3">Envio</th>
            <td colSpan="2">
              {envio === 0 ? 'Gratis' : formatearPrecio(envio, moneda)}
            </td>
          </tr>
          <tr>
            <th colSpan="3">Total</th>
            <td colSpan="2">
              <strong>{formatearPrecio(total, moneda)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <p>
        <button type="button" onClick={vaciarCarrito}>
          Vaciar carrito
        </button>
      </p>

      <hr />

      <FormularioCompra
        totalTexto={formatearPrecio(total, moneda)}
        confirmarCompra={confirmarCompra}
      />
    </main>
  );
}

export default Carrito;
