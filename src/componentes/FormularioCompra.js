import { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

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
    <Card as="section" className="shadow-sm border-0">
      <Card.Header as="h3" className="fs-5">Datos de envio y pago</Card.Header>
      <Card.Body>
        <p>
          Total a pagar: <strong className="text-primary">{totalTexto}</strong>
        </p>

        {/* ----- Formulario ----- */}
        {/* Qué hace: recoge los datos de envío y pago. Cada campo toma su valor
            del estado y lo actualiza con onChange: son campos controlados.
            isInvalid pinta el campo en rojo cuando tiene error, y
            Form.Control.Feedback muestra el mensaje debajo. */}
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electronico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={datos.email}
              onChange={manejarCambio}
              isInvalid={!!errores.email}
            />
            <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                maxLength={10}
                value={datos.telefono}
                onChange={manejarCambio}
                isInvalid={!!errores.telefono}
              />
              <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} sm={6} className="mb-3" controlId="ciudad">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select
                name="ciudad"
                value={datos.ciudad}
                onChange={manejarCambio}
                isInvalid={!!errores.ciudad}
              >
                <option value="">Selecciona una ciudad</option>
                {CIUDADES.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.ciudad}</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="direccion">
            <Form.Label>Direccion de entrega</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={datos.direccion}
              onChange={manejarCambio}
              isInvalid={!!errores.direccion}
            />
            <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
          </Form.Group>

          <fieldset className="mb-3">
            <legend className="fs-6">Metodo de pago</legend>
            {/* Qué hace: genera un radio button por cada método recorriendo el
                objeto METODOS_PAGO con Object.entries. */}
            {Object.entries(METODOS_PAGO).map(([clave, texto]) => (
              <Form.Check
                key={clave}
                id={`pago-${clave}`}
                type="radio"
                name="metodoPago"
                value={clave}
                label={texto}
                checked={datos.metodoPago === clave}
                onChange={manejarCambio}
              />
            ))}
          </fieldset>

          <Form.Check
            className="mb-3"
            id="aceptaTerminos"
            type="checkbox"
            name="aceptaTerminos"
            label="Acepto los terminos y condiciones de TecnoStore."
            checked={datos.aceptaTerminos}
            onChange={manejarCambio}
            isInvalid={!!errores.aceptaTerminos}
            feedback={errores.aceptaTerminos}
            feedbackType="invalid"
          />

          <Button type="submit" variant="success" size="lg" className="w-100">
            Confirmar compra
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FormularioCompra;
