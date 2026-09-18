import { useState } from 'react';
import Encabezado from './componentes/Encabezado';
import Inicio from './componentes/Inicio';
import Catalogo from './componentes/Catalogo';
import Carrito from './componentes/Carrito';
import Contacto from './componentes/Contacto';
import PiePagina from './componentes/PiePagina';

// Nombre con el que queda guardado el carrito dentro del navegador.
const LLAVE_CARRITO = 'tecnostore-carrito';

// ----- Función -----
// Qué hace: lee el carrito que quedó guardado en el navegador. Si no hay nada
// guardado, o si lo guardado está dañado, devuelve un carrito vacío.
function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(LLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
  } catch (error) {
    return [];
  }
}

// ----- Componente -----
// Qué hace: es el componente raíz. Contiene a todos los demás y guarda el
// estado que varias pantallas necesitan compartir.
function App() {
  // ----- Función useState -----
  // Qué hace: guarda la sección que se está viendo, los productos del carrito
  // y la moneda en la que se muestran los precios.
  // El carrito no arranca vacío: arranca con lo que haya guardado el
  // navegador. Se pasa la función sin paréntesis para que React la ejecute
  // una sola vez, en el primer render.
  const [seccion, setSeccion] = useState('inicio');
  const [carrito, setCarrito] = useState(leerCarritoGuardado);
  const [moneda, setMoneda] = useState('COP');

  // ----- Función -----
  // Qué hace: actualiza el carrito en pantalla y lo guarda en el navegador.
  // El almacenamiento solo admite texto, por eso el arreglo se convierte con
  // JSON.stringify. Todas las funciones del carrito llaman a esta.
  function guardarCarrito(nuevoCarrito) {
    setCarrito(nuevoCarrito);

    try {
      localStorage.setItem(LLAVE_CARRITO, JSON.stringify(nuevoCarrito));
    } catch (error) {
      // Si el navegador no deja guardar, la tienda sigue funcionando igual.
    }
  }

  // ----- Función -----
  // Qué hace: cambia la sección que se muestra en pantalla.
  function cambiarSeccion(nueva) {
    setSeccion(nueva);
  }

  // ----- Función -----
  // Qué hace: agrega un producto al carrito. Si ya estaba, le sube la cantidad
  // en lugar de repetir la fila.
  function agregarAlCarrito(producto) {
    const yaEsta = carrito.find((item) => item.codigo === producto.codigo);

    if (yaEsta) {
      const actualizado = carrito.map((item) =>
        item.codigo === producto.codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      guardarCarrito(actualizado);
    } else {
      guardarCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    setSeccion('carrito');
  }

  // ----- Función -----
  // Qué hace: cambia la cantidad de un producto del carrito. El input devuelve
  // texto, por eso se convierte a número y se limita entre 1 y 10.
  function cambiarCantidad(codigo, valor) {
    const numero = parseInt(valor, 10);

    if (isNaN(numero) || numero < 1) {
      return;
    }

    const cantidad = numero > 10 ? 10 : numero;

    const actualizado = carrito.map((item) =>
      item.codigo === codigo ? { ...item, cantidad } : item
    );

    guardarCarrito(actualizado);
  }

  // ----- Función -----
  // Qué hace: saca un producto del carrito. filter devuelve un arreglo nuevo
  // sin ese producto.
  function eliminarDelCarrito(codigo) {
    guardarCarrito(carrito.filter((item) => item.codigo !== codigo));
  }

  // ----- Función -----
  // Qué hace: deja el carrito vacío, también en el navegador.
  function vaciarCarrito() {
    guardarCarrito([]);
  }

  // Suma cuántas unidades hay en total para mostrarlas en el encabezado.
  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);

  // ----- Función -----
  // Qué hace: decide cuál componente se muestra según el estado "seccion".
  // Lo que se escribe dentro de cada etiqueta son las props que recibe el hijo.
  function mostrarSeccion() {
    if (seccion === 'catalogo') {
      return <Catalogo moneda={moneda} agregarAlCarrito={agregarAlCarrito} />;
    }

    if (seccion === 'carrito') {
      return (
        <Carrito
          carrito={carrito}
          moneda={moneda}
          cambiarCantidad={cambiarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
          vaciarCarrito={vaciarCarrito}
          cambiarSeccion={cambiarSeccion}
        />
      );
    }

    if (seccion === 'contacto') {
      return <Contacto />;
    }

    return (
      <Inicio
        moneda={moneda}
        cambiarSeccion={cambiarSeccion}
        agregarAlCarrito={agregarAlCarrito}
      />
    );
  }

  return (
    <div>
      <Encabezado
        seccion={seccion}
        cambiarSeccion={cambiarSeccion}
        moneda={moneda}
        setMoneda={setMoneda}
        unidades={unidades}
      />

      {mostrarSeccion()}

      <PiePagina cambiarSeccion={cambiarSeccion} />
    </div>
  );
}

export default App;
