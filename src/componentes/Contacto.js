import { useState } from 'react';

const MAX_CARACTERES = 300;

const ASUNTOS = ['Estado de mi pedido', 'Garantia', 'Asesoria de compra', 'Otro'];

// Formulario de contacto con contador de caracteres y validaciones propias.
function Contacto() {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const caracteresUsados = datos.mensaje.length;
  const caracteresRestantes = MAX_CARACTERES - caracteresUsados;

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatos({
      ...datos,
      [name]: value,
    });

    // Si el usuario vuelve a escribir se oculta el mensaje de exito anterior.
    setEnviado(false);
  }

  function validar() {
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'Necesitamos tu nombre para responderte.';
    }

    if (!datos.email.includes('@') || !datos.email.includes('.')) {
      nuevosErrores.email = 'El correo no es valido.';
    }

    if (!datos.asunto) {
      nuevosErrores.asunto = 'Selecciona el asunto de tu mensaje.';
    }

    if (datos.mensaje.trim().length < 15) {
      nuevosErrores.mensaje = 'Cuentanos un poco mas, minimo 15 caracteres.';
    }

    return nuevosErrores;
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresEncontrados = validar();

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados);
      setEnviado(false);
      return;
    }

    setErrores({});
    setEnviado(true);
    setDatos({ nombre: '', email: '', asunto: '', mensaje: '' });
  }

  return (
    <main>
      <h2>Contactanos</h2>
      <p>Respondemos de lunes a viernes, de 8:00 a.m. a 6:00 p.m.</p>

      <form onSubmit={manejarEnvio}>
        <p>
          <label htmlFor="nombreContacto">Nombre: </label>
          <input
            id="nombreContacto"
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
          />
          {errores.nombre && <strong> {errores.nombre}</strong>}
        </p>

        <p>
          <label htmlFor="emailContacto">Correo electronico: </label>
          <input
            id="emailContacto"
            type="email"
            name="email"
            value={datos.email}
            onChange={manejarCambio}
          />
          {errores.email && <strong> {errores.email}</strong>}
        </p>

        <p>
          <label htmlFor="asuntoContacto">Asunto: </label>
          <select
            id="asuntoContacto"
            name="asunto"
            value={datos.asunto}
            onChange={manejarCambio}
          >
            <option value="">Selecciona un asunto</option>
            {ASUNTOS.map((texto) => (
              <option key={texto} value={texto}>
                {texto}
              </option>
            ))}
          </select>
          {errores.asunto && <strong> {errores.asunto}</strong>}
        </p>

        <p>
          <label htmlFor="mensajeContacto">Mensaje: </label>
          <br />
          <textarea
            id="mensajeContacto"
            name="mensaje"
            rows={5}
            cols={50}
            maxLength={MAX_CARACTERES}
            value={datos.mensaje}
            onChange={manejarCambio}
          />
          <br />
          Caracteres usados: {caracteresUsados} de {MAX_CARACTERES}. Quedan{' '}
          {caracteresRestantes}.
          {errores.mensaje && <strong> {errores.mensaje}</strong>}
        </p>

        <p>
          <button type="submit">Enviar mensaje</button>
        </p>
      </form>

      {enviado && (
        <p>
          <mark>Mensaje enviado. Te responderemos al correo registrado.</mark>
        </p>
      )}

      <hr />

      <h3>Otros canales</h3>
      <ul>
        <li>Correo: ventas@tecnostore.com</li>
        <li>Telefono: (601) 555 0199</li>
        <li>Sede principal: Bogota, Colombia</li>
      </ul>
    </main>
  );
}

export default Contacto;
