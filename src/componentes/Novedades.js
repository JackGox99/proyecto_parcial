import { useState, useEffect } from 'react';
import { TASAS_CAMBIO } from '../datos/tasasCambio';
import { formatearFecha } from '../datos/fechas';
import TarjetaProducto from './TarjetaProducto';
import ZonaCarrito from './ZonaCarrito';

// Direccion del servidor que nos entrega el catalogo en linea.
const SERVIDOR = 'https://dummyjson.com/products/category/';
const CAMPOS = 'title,price,brand,thumbnail,stock,rating,warrantyInformation,description';

// Nombre con el que se guarda en el navegador la copia del catalogo.
const LLAVE_CACHE = 'tecnostore-novedades';

// ----- Objetos -----
// Qué hace: relaciona el nombre que usa el servidor con el nombre que le
// mostramos al cliente.
const CATEGORIAS_SERVIDOR = {
  laptops: 'Portatiles',
  smartphones: 'Celulares',
  tablets: 'Tablets',
  'mobile-accessories': 'Accesorios',
};

// ----- Almacenamiento en LocalStorage -----
// ----- Función -----
// Qué hace: devuelve la copia guardada de una categoria, o null si no hay.
// Todas las categorias viven en un solo objeto guardado bajo la misma llave.
function leerCopia(categoria) {
  try {
    const todas = JSON.parse(localStorage.getItem(LLAVE_CACHE)) || {};
    return todas[categoria] || null;
  } catch (error) {
    return null;
  }
}

// ----- Función -----
// Qué hace: guarda la respuesta buena del servidor junto con la fecha en que
// se descargo, para poder avisar despues de cuando son esos datos.
function guardarCopia(categoria, productos) {
  try {
    const todas = JSON.parse(localStorage.getItem(LLAVE_CACHE)) || {};
    todas[categoria] = { fecha: new Date().toISOString(), productos: productos };
    localStorage.setItem(LLAVE_CACHE, JSON.stringify(todas));
  } catch (error) {
    // Si el navegador no deja guardar, la tienda sigue funcionando igual.
  }
}

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
// pide a un servidor web. Si el servidor no responde, muestra la ultima copia
// que quedo guardada en el navegador.
function Novedades({ moneda, agregarAlCarrito, unidades }) {
  // ----- Función useState -----
  const [categoria, setCategoria] = useState('laptops');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // Contador que solo sirve para obligar al efecto a repetirse al reintentar.
  const [intento, setIntento] = useState(0);
  // Interruptor de demostracion: finge que no hay internet.
  const [sinConexion, setSinConexion] = useState(false);
  // Indican si lo que se esta viendo salio de la copia guardada y de cuando es.
  const [desdeCopia, setDesdeCopia] = useState(false);
  const [fechaCopia, setFechaCopia] = useState('');

  // ----- Hook de efecto useEffect -----
  // Qué hace: pide los productos al servidor y guarda una copia de la
  // respuesta. Si no hay conexion, o si el interruptor de demostracion esta
  // encendido, usa la copia guardada en lugar de la red.
  useEffect(() => {
    // Si el usuario cambia de categoria antes de que llegue la respuesta
    // anterior, esta bandera evita que la respuesta vieja pise a la nueva.
    let cancelado = false;

    setCargando(true);
    setError('');
    setDesdeCopia(false);

    // Camino sin red: se usa lo que haya guardado el navegador.
    function usarCopiaGuardada() {
      const copia = leerCopia(categoria);

      if (copia) {
        setProductos(copia.productos);
        setFechaCopia(copia.fecha);
        setDesdeCopia(true);
        setError('');
      } else {
        setProductos([]);
        setError(
          'No hay conexion con el servidor y todavia no existe una copia guardada de esta categoria.'
        );
      }

      setCargando(false);
    }

    if (sinConexion) {
      usarCopiaGuardada();
      return;
    }

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

        const convertidos = datos.products.map((uno) =>
          convertirProducto(uno, categoria)
        );

        setProductos(convertidos);
        setCargando(false);

        // Se guarda la copia solo cuando la respuesta fue buena.
        guardarCopia(categoria, convertidos);
      })
      .catch(() => {
        if (cancelado) {
          return;
        }
        // El servidor fallo de verdad: se intenta con la copia guardada.
        usarCopiaGuardada();
      });

    // Lo que se devuelve en un useEffect es la funcion de limpieza. React la
    // ejecuta antes de volver a correr el efecto o al salir de la pantalla.
    return () => {
      cancelado = true;
    };
  }, [categoria, intento, sinConexion]);

  // ----- Función -----
  // Qué hace: vuelve a pedir la misma categoria. Al subir el contador cambia
  // una de las dependencias del efecto, y el efecto se ejecuta de nuevo.
  function reintentar() {
    setIntento(intento + 1);
  }

  // ----- Función -----
  // Qué hace: borra todas las copias guardadas. Sirve para demostrar que sin
  // copia y sin internet la seccion queda sin datos.
  function borrarCopias() {
    try {
      localStorage.removeItem(LLAVE_CACHE);
    } catch (error) {
      // sin almacenamiento disponible no hay nada que borrar
    }
    setIntento(intento + 1);
  }

  return (
    <main>
      <h2>Novedades en linea</h2>
      <p>
        Estos productos no estan en nuestro codigo. Se piden a un servidor web
        cada vez que cambias la categoria, y de cada respuesta buena se guarda
        una copia en el navegador.
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

      <fieldset>
        <legend>Modo de demostracion</legend>

        <p>
          {/* ----- Evento ----- */}
          {/* Qué hace: al marcar la casilla el efecto se vuelve a ejecutar,
              se salta el fetch y lee la copia guardada. Sirve para mostrar el
              funcionamiento sin internet sin tener que apagar el wifi. */}
          <label htmlFor="sinConexion">
            <input
              id="sinConexion"
              type="checkbox"
              checked={sinConexion}
              onChange={(evento) => setSinConexion(evento.target.checked)}
            />
            Simular que no hay internet
          </label>
        </p>

        <p>
          <button type="button" onClick={borrarCopias}>
            Borrar las copias guardadas
          </button>
        </p>
      </fieldset>

      <hr />

      {/* Mientras se espera la respuesta del servidor. */}
      {cargando && <p>Consultando el servidor...</p>}

      {/* Si no hubo red y tampoco habia copia guardada. */}
      {!cargando && error !== '' && (
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

      {/* Cuando hay productos, vengan del servidor o de la copia guardada. */}
      {!cargando && error === '' && (
        <div>
          {desdeCopia ? (
            <p>
              <mark>
                Sin conexion con el servidor. Estas viendo la copia guardada el{' '}
                {formatearFecha(fechaCopia)}.
              </mark>
            </p>
          ) : (
            <p>Datos recien traidos del servidor.</p>
          )}

          <p>Se estan mostrando {productos.length} productos.</p>

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
