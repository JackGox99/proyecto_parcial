import { useState, useEffect } from 'react';
import { TASAS_CAMBIO } from '../datos/tasasCambio';
import TarjetaProducto from './TarjetaProducto';
import ZonaCarrito from './ZonaCarrito';

// Direccion del servidor que nos entrega el catalogo en linea.
const SERVIDOR = 'https://dummyjson.com/products/category/';
const CAMPOS = 'title,price,brand,thumbnail,stock,rating,warrantyInformation,description';

// ----- Objetos -----
// Qué hace: relaciona el nombre que usa el servidor con el nombre que le
// mostramos al cliente.
const CATEGORIAS_SERVIDOR = {
  laptops: 'Portatiles',
  smartphones: 'Celulares',
  tablets: 'Tablets',
  'mobile-accessories': 'Accesorios',
};

// ----- Función -----
// Qué hace: traduce un producto del servidor a la misma forma que tienen
// nuestros productos propios, para poder reutilizar el componente
// TarjetaProducto y poder meterlos al mismo carrito.
function convertirProducto(recibido, categoria) {
  return {
    // Se le suma 1000 al codigo para que nunca choque con los codigos
    // de nuestro catalogo propio, que van del 1 al 8.
    codigo: 1000 + recibido.id,
    imagen: recibido.thumbnail,
    nombre: recibido.title,
    categoria: CATEGORIAS_SERVIDOR[categoria],
    marca: recibido.brand || 'Sin marca',
    // El servidor entrega el precio en dolares, nosotros trabajamos en pesos.
    precio: Math.round(recibido.price * TASAS_CAMBIO.USD),
    disponible: recibido.stock > 0,
    envioGratis: recibido.price >= 100,
    descripcion: recibido.description,
    especificaciones: {
      calificacion: recibido.rating + ' de 5',
      existencias: recibido.stock + ' unidades',
      garantia: recibido.warrantyInformation,
      precioEnOrigen: recibido.price + ' USD',
    },
  };
}

// ----- Componente -----
// Qué hace: muestra un catalogo que no esta en nuestro codigo, sino que se
// pide a un servidor web cada vez que se elige otra categoria.
function Novedades({ moneda, agregarAlCarrito, unidades }) {
  // ----- Función useState -----
  // Qué hace: la categoria elegida, los productos que respondio el servidor,
  // si todavia estamos esperando, y el mensaje de error si algo fallo.
  const [categoria, setCategoria] = useState('laptops');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // Contador que solo sirve para obligar al efecto a repetirse al reintentar.
  const [intento, setIntento] = useState(0);

  // ----- Hook de efecto useEffect -----
  // Qué hace: pide los productos al servidor. La lista del final indica cuándo
  // se vuelve a ejecutar: cada vez que cambia la categoria elegida, o cuando
  // el usuario presiona Reintentar.
  useEffect(() => {
    // Si el usuario cambia de categoria antes de que llegue la respuesta
    // anterior, esta bandera evita que la respuesta vieja pise a la nueva.
    let cancelado = false;

    setCargando(true);
    setError('');

    // ----- Peticion al servidor con fetch -----
    fetch(SERVIDOR + categoria + '?select=' + CAMPOS)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('El servidor respondio ' + respuesta.status);
        }
        return respuesta.json();
      })
      .then((datos) => {
        if (cancelado) {
          return;
        }
        setProductos(
          datos.products.map((uno) => convertirProducto(uno, categoria))
        );
        setCargando(false);
      })
      .catch(() => {
        if (cancelado) {
          return;
        }
        setError(
          'No se pudo conectar con el servidor. Revisa la conexion a internet e intenta de nuevo.'
        );
        setCargando(false);
      });

    // Lo que se devuelve en un useEffect es la funcion de limpieza. React la
    // ejecuta antes de volver a correr el efecto o al salir de la pantalla.
    return () => {
      cancelado = true;
    };
  }, [categoria, intento]);

  // ----- Función -----
  // Qué hace: vuelve a pedir la misma categoria. Al subir el contador cambia
  // una de las dependencias del efecto, y el efecto se ejecuta de nuevo.
  function reintentar() {
    setIntento(intento + 1);
  }

  return (
    <main>
      <h2>Novedades en linea</h2>
      <p>
        Estos productos no estan en nuestro codigo. Se piden a un servidor web
        cada vez que cambias la categoria.
      </p>

      <ZonaCarrito agregarAlCarrito={agregarAlCarrito} unidades={unidades} />

      <p>
        <label htmlFor="categoriaServidor">Categoria del servidor: </label>
        {/* ----- Evento ----- */}
        {/* Qué hace: al cambiar la categoria, el useEffect de arriba se vuelve
            a ejecutar y pide los productos nuevos. */}
        <select
          id="categoriaServidor"
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
        >
          {Object.entries(CATEGORIAS_SERVIDOR).map(([clave, nombre]) => (
            <option key={clave} value={clave}>
              {nombre}
            </option>
          ))}
        </select>
      </p>

      <hr />

      {/* Mientras se espera la respuesta del servidor. */}
      {cargando && <p>Consultando el servidor...</p>}

      {/* Si el servidor no respondio o no hay internet. */}
      {error !== '' && (
        <div>
          <p>
            <strong>{error}</strong>
          </p>
          <p>
            <button type="button" onClick={reintentar}>
              Reintentar
            </button>
          </p>
        </div>
      )}

      {/* Cuando la respuesta llego bien. */}
      {!cargando && error === '' && (
        <div>
          <p>El servidor devolvio {productos.length} productos.</p>

          {productos.map((producto) => (
            <TarjetaProducto
              key={producto.codigo}
              producto={producto}
              moneda={moneda}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Novedades;
