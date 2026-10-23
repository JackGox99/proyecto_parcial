import { useState, useEffect } from 'react';
import Encabezado from './componentes/Encabezado';
import Inicio from './componentes/Inicio';
import Catalogo from './componentes/Catalogo';
import Novedades from './componentes/Novedades';
import Carrito from './componentes/Carrito';
import Pedidos from './componentes/Pedidos';
import Contacto from './componentes/Contacto';
import PiePagina from './componentes/PiePagina';

// Nombres con los que quedan guardados el carrito y el historial de compras
// dentro del navegador.
const LLAVE_CARRITO = 'tecnostore-carrito';
const LLAVE_PEDIDOS = 'tecnostore-pedidos';

// ----- Componente -----
// Qué hace: es el componente raíz. Contiene a todos los demás y guarda el
// estado que varias pantallas necesitan compartir.
function App() {
  // ----- Función useState -----
  // Qué hace: guarda la sección que se está viendo, los productos del carrito
  // y la moneda en la que se muestran los precios.
  const [seccion, setSeccion] = useState('inicio');
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [moneda, setMoneda] = useState('COP');

  // ----- Hook de efecto useEffect -----
  // Qué hace: lee el carrito guardado en el navegador. El arreglo vacío del
  // final significa "ejecútate una sola vez", al abrir la página.
  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(LLAVE_CARRITO));

      if (guardado) {
        setCarrito(guardado);
      }
    } catch (error) {
      // Si lo guardado quedo dañado, se arranca con el carrito vacio.
    }
  }, []);

  // ----- Hook de efecto useEffect -----
  // Qué hace: guarda el carrito en el navegador. El [carrito] del final
  // significa "ejecútate cada vez que el carrito cambie".
  useEffect(() => {
    localStorage.setItem(LLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  // ----- Hook de efecto useEffect -----
  // Qué hace: lee el historial de compras guardado, una sola vez al abrir.
  useEffect(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem(LLAVE_PEDIDOS));

      if (guardados) {
        setPedidos(guardados);
      }
    } catch (error) {
      // Si lo guardado quedo dañado, se arranca sin historial.
    }
  }, []);

  // ----- Hook de efecto useEffect -----
  // Qué hace: guarda el historial cada vez que se registra o se borra un pedido.
  useEffect(() => {
    localStorage.setItem(LLAVE_PEDIDOS, JSON.stringify(pedidos));
  }, [pedidos]);

  // Suma cuántas unidades hay en total para mostrarlas en el encabezado.
  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);

  // ----- Hook de efecto useEffect -----
  // Qué hace: escribe el número de unidades en el título de la pestaña del
  // navegador. Se vuelve a ejecutar cada vez que cambian las unidades.
  useEffect(() => {
    document.title = unidades > 0 ? `TecnoStore (${unidades})` : 'TecnoStore';
  }, [unidades]);

  // ----- Función -----
  // Qué hace: cambia la sección que se muestra en pantalla.
  function cambiarSeccion(nueva) {
    setSeccion(nueva);
  }

  // ----- Función -----
  // Qué hace: agrega un producto al carrito. Si ya estaba, le sube la cantidad
  // en lugar de repetir la fila. Cuando el producto llega arrastrado se pasa
  // irAlCarrito en false, para no sacar al usuario de la pantalla.
  function agregarAlCarrito(producto, irAlCarrito = true) {
    const yaEsta = carrito.find((item) => item.codigo === producto.codigo);

    if (yaEsta) {
      const actualizado = carrito.map((item) =>
        item.codigo === producto.codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCarrito(actualizado);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    if (irAlCarrito) {
      setSeccion('carrito');
    }
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

    setCarrito(actualizado);
  }

  // ----- Función -----
  // Qué hace: saca un producto del carrito. filter devuelve un arreglo nuevo
  // sin ese producto.
  function eliminarDelCarrito(codigo) {
    setCarrito(carrito.filter((item) => item.codigo !== codigo));
  }

  // ----- Función -----
  // Qué hace: deja el carrito vacío.
  function vaciarCarrito() {
    setCarrito([]);
  }

  // ----- Función -----
  // Qué hace: guarda una compra confirmada en el historial. El pedido nuevo
  // va de primero, para que el mas reciente se vea arriba.
  function registrarPedido(pedido) {
    setPedidos([pedido, ...pedidos]);
  }

  // ----- Función -----
  // Qué hace: borra todo el historial de compras.
  function borrarPedidos() {
    setPedidos([]);
  }

  // ----- Función -----
  // Qué hace: decide cuál componente se muestra según el estado "seccion".
  // Lo que se escribe dentro de cada etiqueta son las props que recibe el hijo.
  function mostrarSeccion() {
    if (seccion === 'catalogo') {
      return (
        <Catalogo
          moneda={moneda}
          agregarAlCarrito={agregarAlCarrito}
          unidades={unidades}
        />
      );
    }

    if (seccion === 'novedades') {
      return (
        <Novedades
          moneda={moneda}
          agregarAlCarrito={agregarAlCarrito}
          unidades={unidades}
        />
      );
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
          registrarPedido={registrarPedido}
        />
      );
    }

    if (seccion === 'pedidos') {
      return (
        <Pedidos
          pedidos={pedidos}
          moneda={moneda}
          borrarPedidos={borrarPedidos}
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
        pedidosHechos={pedidos.length}
      />

      {mostrarSeccion()}

      <PiePagina cambiarSeccion={cambiarSeccion} />
    </div>
  );
}

export default App;
