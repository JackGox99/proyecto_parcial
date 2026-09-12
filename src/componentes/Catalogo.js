import { useState } from 'react';
import { PRODUCTOS, CATEGORIAS } from '../datos/productos';
import TarjetaProducto from './TarjetaProducto';

// Listado de productos con buscador, filtro por categoria y ordenamiento.
// Cada control tiene su propia variable de estado.
function Catalogo({ moneda, agregarAlCarrito }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('nombre');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  // El filtrado se calcula en cada render a partir del estado actual.
  const texto = busqueda.trim().toLowerCase();

  const filtrados = PRODUCTOS.filter((producto) => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.marca.toLowerCase().includes(texto);

    const coincideCategoria = categoria === '' || producto.categoria === categoria;
    const coincideStock = !soloDisponibles || producto.disponible;

    return coincideTexto && coincideCategoria && coincideStock;
  });

  // Se ordena una copia para no modificar el arreglo original del catalogo.
  const ordenados = [...filtrados].sort((a, b) => {
    if (orden === 'precioAsc') {
      return a.precio - b.precio;
    }
    if (orden === 'precioDesc') {
      return b.precio - a.precio;
    }
    return a.nombre.localeCompare(b.nombre);
  });

  function limpiarFiltros() {
    setBusqueda('');
    setCategoria('');
    setOrden('nombre');
    setSoloDisponibles(false);
  }

  return (
    <main>
      <h2>Catalogo de productos</h2>

      <fieldset>
        <legend>Filtros de busqueda</legend>

        <p>
          <label htmlFor="busqueda">Buscar por nombre o marca: </label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </p>

        <p>
          <label htmlFor="categoria">Categoria: </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            <option value="">Todas las categorias</option>
            {CATEGORIAS.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </p>

        <p>
          <label htmlFor="orden">Ordenar por: </label>
          <select
            id="orden"
            value={orden}
            onChange={(evento) => setOrden(evento.target.value)}
          >
            <option value="nombre">Nombre</option>
            <option value="precioAsc">Precio de menor a mayor</option>
            <option value="precioDesc">Precio de mayor a menor</option>
          </select>
        </p>

        <p>
          <label htmlFor="disponibles">
            <input
              id="disponibles"
              type="checkbox"
              checked={soloDisponibles}
              onChange={(evento) => setSoloDisponibles(evento.target.checked)}
            />
            Mostrar solo productos disponibles
          </label>
        </p>

        <p>
          <button type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </p>
      </fieldset>

      <p>
        Se encontraron {ordenados.length} de {PRODUCTOS.length} productos.
      </p>

      <hr />

      {ordenados.length === 0 ? (
        <p>No hay productos que coincidan con la busqueda. Intenta con otro filtro.</p>
      ) : (
        ordenados.map((producto) => (
          <TarjetaProducto
            key={producto.codigo}
            producto={producto}
            moneda={moneda}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))
      )}
    </main>
  );
}

export default Catalogo;
