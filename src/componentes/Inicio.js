import { PRODUCTOS } from '../datos/productos';
import { formatearPrecio } from '../datos/tasasCambio';

// ----- Componente -----
// Qué hace: es la página principal. Presenta la tienda, explica por qué
// escogimos el tema y muestra los productos destacados.
function Inicio({ moneda, cambiarSeccion, agregarAlCarrito }) {
  // Qué hace: saca los tres productos disponibles más económicos. No están
  // escritos a mano, se calculan desde el catálogo en cada render.
  const destacados = PRODUCTOS
    .filter((producto) => producto.disponible)
    .sort((a, b) => a.precio - b.precio)
    .slice(0, 3);

  const totalProductos = PRODUCTOS.length;
  const conEnvioGratis = PRODUCTOS.filter((producto) => producto.envioGratis).length;

  return (
    <main>
      <h2>Bienvenido a TecnoStore</h2>

      <blockquote>
        <p>
          Armamos tu equipo de estudio y trabajo sin pagar de mas. Portatiles,
          perifericos, componentes y monitores con garantia y envio a todo el pais.
        </p>
      </blockquote>

      <p>
        <a href="#catalogo" onClick={(evento) => { evento.preventDefault(); cambiarSeccion('catalogo'); }}>
          Ver el catalogo completo
        </a>
      </p>

      <hr />

      <h3>Por que escogimos este tema</h3>
      <p>
        Somos estudiantes de Ingenieria de Sistemas y comprar tecnologia es una
        decision que enfrentamos todos los semestres. Conocemos el producto, sabemos
        que informacion le hace falta al comprador y entendemos las dudas tecnicas que
        aparecen al comparar equipos.
      </p>
      <p>
        Ademas, un catalogo de tecnologia nos obliga a manejar objetos con muchos
        atributos, filtros por categoria, un carrito con cantidades y validaciones de
        formulario. Es decir, es el tema que mejor nos permite aplicar todo lo que
        vimos en clase.
      </p>

      <hr />

      <h3>Que ofrecemos</h3>
      <ul>
        <li>{totalProductos} productos en catalogo, organizados por categoria.</li>
        <li>{conEnvioGratis} productos con envio gratis a todo el pais.</li>
        <li>Precios visibles en varias monedas desde el menu superior.</li>
        <li>Garantia directa con el fabricante en cada referencia.</li>
      </ul>

      <hr />

      <h3>Productos destacados</h3>
      <p>Las opciones disponibles mas economicas del catalogo.</p>

      <table border="1">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {destacados.map((producto) => (
            <tr key={producto.codigo}>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{formatearPrecio(producto.precio, moneda)}</td>
              <td>
                <button type="button" onClick={() => agregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
    </main>
  );
}

export default Inicio;
