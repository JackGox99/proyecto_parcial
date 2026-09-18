import { useState } from 'react';
import { PRODUCTOS, CATEGORIAS } from '../datos/productos';
import TarjetaProducto from './TarjetaProducto';

// ----- Componente -----
// Qué hace: muestra el listado de productos con buscador, filtro por
// categoría, ordenamiento y filtro de disponibilidad.
function Catalogo({ moneda, agregarAlCarrito }) {
  // ----- Función useState -----
  // Qué hace: guarda lo que el usuario escribió o eligió en cada control.
  // Hay una variable de estado por control y son independientes entre sí.
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('nombre');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  // El filtrado no se guarda en el estado: se vuelve a calcular en cada render
  // a partir de los valores actuales, así nunca queda desactualizado.
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

  // ----- Función -----
  // Qué hace: devuelve los cuatro filtros a su valor inicial.
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
          {/* ----- Evento ----- */}
          {/* Qué hace: onChange se dispara con cada tecla y guarda el texto
              en el estado, lo que vuelve a filtrar la lista al instante. */}
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </p>

        <p>
          <label htmlFor="categoria">Categoria: </label>
          {/* ----- Evento ----- */}
          {/* Qué hace: guarda la categoría elegida para filtrar por ella. */}
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
          {/* ----- Evento ----- */}
          {/* Qué hace: guarda el criterio con el que se ordena la lista. */}
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
            {/* ----- Evento ----- */}
            {/* Qué hace: en una casilla se lee "checked", no "value". */}
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
          {/* ----- Evento ----- */}
          {/* Qué hace: al hacer clic limpia los cuatro filtros. */}
          <button type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </p>
      </fieldset>

      <p>
        Se encontraron {ordenados.length} de {PRODUCTOS.length} productos.
      </p>

      <hr />

      {/* Qué hace: si no hay resultados muestra un aviso, y si los hay pinta
          un componente TarjetaProducto por cada producto. */}
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
