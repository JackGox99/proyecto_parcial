import { useState } from 'react';
import Encabezado from './componentes/Encabezado';
import Inicio from './componentes/Inicio';
import Catalogo from './componentes/Catalogo';
import Carrito from './componentes/Carrito';
import Contacto from './componentes/Contacto';
import PiePagina from './componentes/PiePagina';

// Componente raiz. Aqui viven las variables de estado que comparten
// varios componentes: la seccion visible, el carrito y la moneda.
function App() {
  const [seccion, setSeccion] = useState('inicio');
  const [carrito, setCarrito] = useState([]);
  const [moneda, setMoneda] = useState('COP');

  function cambiarSeccion(nueva) {
    setSeccion(nueva);
  }

  // Si el producto ya esta en el carrito se aumenta la cantidad,
  // si no, se agrega una linea nueva con cantidad 1.
  function agregarAlCarrito(producto) {
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

    setSeccion('carrito');
  }

  // El input devuelve texto, por eso se convierte a numero y se limita el rango.
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

  // filter devuelve un arreglo nuevo sin el producto eliminado.
  function eliminarDelCarrito(codigo) {
    setCarrito(carrito.filter((item) => item.codigo !== codigo));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);

  // Decide que componente se muestra segun el estado "seccion".
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
