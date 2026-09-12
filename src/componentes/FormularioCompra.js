import { useState } from 'react';

const CIUDADES = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Neiva'];

const METODOS_PAGO = {
  tarjeta: 'Tarjeta de credito',
  pse: 'PSE / debito bancario',
  contraentrega: 'Pago contra entrega',
};

// Formulario de cierre de compra.
// Sigue el mismo patron del formulario de registro visto en clase:
// un objeto para los datos, otro para los errores y una funcion que valida.
function FormularioCompra({ totalTexto, confirmarCompra }) {
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

  // Un solo manejador para todos los campos, usando el atributo name.
  function manejarCambio(evento) {
    const { name, type, value, checked } = evento.target;

    setDatos({
      ...datos,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  // Devuelve un objeto con un mensaje por cada campo invalido.
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
          {/* Los radio buttons se generan recorriendo un objeto, como en clase */}
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
