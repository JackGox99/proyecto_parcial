import { useState } from 'react';

const CIUDADES = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Neiva'];

// ----- Objetos -----
// Qué hace: guarda los métodos de pago. La llave se usa en el código y el
// valor es el texto que ve el usuario.
const METODOS_PAGO = {
  tarjeta: 'Tarjeta de credito',
  pse: 'PSE / debito bancario',
  contraentrega: 'Pago contra entrega',
};

// ----- Componente -----
// Qué hace: dibuja el formulario de cierre de compra con sus validaciones.
function FormularioCompra({ totalTexto, confirmarCompra }) {
  // ----- Función useState -----
  // Qué hace: un objeto guarda lo que el usuario escribe en cada campo y otro
  // guarda los mensajes de error de los campos que estén mal.
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    metodoPago: 'tarjeta',
    aceptaTerminos: false,
  });

  const [errores, setErrores] = useState({});

  // ----- Evento -----
  // Qué hace: atiende el cambio de todos los campos con una sola función. Usa
  // el atributo name del input como llave para saber cuál campo actualizar.
  function manejarCambio(evento) {
    const { name, type, value, checked } = evento.target;

    setDatos({
      ...datos,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  // ----- Validaciones -----
  // Qué hace: revisa campo por campo y devuelve un objeto con un mensaje por
  // cada campo que esté mal. Si todo está bien, devuelve el objeto vacío.
  function validar() {
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    } else if (datos.nombre.trim().length < 5) {
      nuevosErrores.nombre = 'Escribe el nombre completo, minimo 5 caracteres.';
    }

    if (!datos.email.includes('@') || !datos.email.includes('.')) {
      nuevosErrores.email = 'El correo no es valido. Ejemplo: nombre@correo.com';
    }

    const soloDigitos = /^[0-9]{10}$/;
    if (!soloDigitos.test(datos.telefono)) {
      nuevosErrores.telefono = 'El telefono debe tener exactamente 10 digitos numericos.';
    }

    if (datos.direccion.trim().length < 6) {
      nuevosErrores.direccion = 'Escribe una direccion de entrega valida.';
    }

    if (!datos.ciudad) {
      nuevosErrores.ciudad = 'Selecciona la ciudad de entrega.';
    }

    if (!datos.aceptaTerminos) {
      nuevosErrores.aceptaTerminos = 'Debes aceptar los terminos para continuar.';
    }

    return nuevosErrores;
  }

  // ----- Evento -----
  // Qué hace: atiende el envío del formulario. preventDefault evita que la
  // página se recargue. Si hay errores se muestran y no se envía nada.
  function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresEncontrados = validar();

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados);
      return;
    }

    setErrores({});
    confirmarCompra({
      ...datos,
      metodoPagoTexto: METODOS_PAGO[datos.metodoPago],
    });
  }

  return (
    <section>
      <h3>Datos de envio y pago</h3>
      <p>Total a pagar: {totalTexto}</p>

      {/* ----- Formulario ----- */}
      {/* Qué hace: recoge los datos de envío y pago. Cada campo toma su valor
          del estado y lo actualiza con onChange: son campos controlados. */}
      <form onSubmit={manejarEnvio}>
        <p>
          <label htmlFor="nombre">Nombre completo: </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
          />
          {/* Muestra el mensaje solo si ese campo tiene error. */}
          {errores.nombre && <strong> {errores.nombre}</strong>}
        </p>

        <p>
          <label htmlFor="email">Correo electronico: </label>
          <input
            id="email"
            type="email"
            name="email"
            value={datos.email}
            onChange={manejarCambio}
          />
          {errores.email && <strong> {errores.email}</strong>}
        </p>

        <p>
          <label htmlFor="telefono">Telefono: </label>
          <input
            id="telefono"
            type="text"
            name="telefono"
            maxLength={10}
            value={datos.telefono}
            onChange={manejarCambio}
          />
          {errores.telefono && <strong> {errores.telefono}</strong>}
        </p>

        <p>
          <label htmlFor="direccion">Direccion de entrega: </label>
          <input
            id="direccion"
            type="text"
            name="direccion"
            value={datos.direccion}
            onChange={manejarCambio}
          />
          {errores.direccion && <strong> {errores.direccion}</strong>}
        </p>

        <p>
          <label htmlFor="ciudad">Ciudad: </label>
          <select
            id="ciudad"
            name="ciudad"
            value={datos.ciudad}
            onChange={manejarCambio}
          >
            <option value="">Selecciona una ciudad</option>
            {CIUDADES.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
          {errores.ciudad && <strong> {errores.ciudad}</strong>}
        </p>

        <fieldset>
          <legend>Metodo de pago</legend>
          {/* Qué hace: genera un radio button por cada método recorriendo el
              objeto METODOS_PAGO con Object.entries. */}
          {Object.entries(METODOS_PAGO).map(([clave, texto]) => (
            <p key={clave}>
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value={clave}
                  checked={datos.metodoPago === clave}
                  onChange={manejarCambio}
                />
                {texto}
              </label>
            </p>
          ))}
        </fieldset>

        <p>
          <label>
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={datos.aceptaTerminos}
              onChange={manejarCambio}
            />
            Acepto los terminos y condiciones de TecnoStore.
          </label>
          {errores.aceptaTerminos && <strong> {errores.aceptaTerminos}</strong>}
        </p>

        <p>
          <button type="submit">Confirmar compra</button>
        </p>
      </form>
    </section>
  );
}

export default FormularioCompra;
