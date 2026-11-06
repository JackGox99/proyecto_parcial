import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';

const MAX_CARACTERES = 300;

const ASUNTOS = ['Estado de mi pedido', 'Garantia', 'Asesoria de compra', 'Otro'];

// ----- Componente -----
// Qué hace: dibuja el formulario de contacto, con contador de caracteres y
// sus propias validaciones.
function Contacto() {
  // ----- Función useState -----
  // Qué hace: un objeto guarda lo que el usuario escribe, otro los errores,
  // y una bandera recuerda si el mensaje ya se envió.
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Se calculan en cada render a partir del mensaje, no se guardan aparte.
  const caracteresUsados = datos.mensaje.length;
  const caracteresRestantes = MAX_CARACTERES - caracteresUsados;

  // ----- Evento -----
  // Qué hace: atiende el cambio de todos los campos con una sola función,
  // usando el atributo name del input como llave.
  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatos({
      ...datos,
      [name]: value,
    });

    // Si el usuario vuelve a escribir se oculta el mensaje de exito anterior.
    setEnviado(false);
  }

  // ----- Validaciones -----
  // Qué hace: revisa los cuatro campos y devuelve un objeto con un mensaje
  // por cada uno que esté mal. Si todo está bien, devuelve el objeto vacío.
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

  // ----- Evento -----
  // Qué hace: atiende el envío del formulario. preventDefault evita que la
  // página se recargue. Si hay errores no se envía y se muestran los mensajes.
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
    <Container as="main" className="py-4">
      <h2>Contactanos</h2>
      <p className="text-muted">Respondemos de lunes a viernes, de 8:00 a.m. a 6:00 p.m.</p>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              {/* ----- Formulario ----- */}
              {/* Qué hace: recoge el mensaje del cliente. Cada campo toma su valor del
                  estado y lo actualiza con onChange: son campos controlados. */}
              <Form onSubmit={manejarEnvio}>
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3" controlId="nombreContacto">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={datos.nombre}
                      onChange={manejarCambio}
                      isInvalid={!!errores.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={6} className="mb-3" controlId="emailContacto">
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
                </Row>

                <Form.Group className="mb-3" controlId="asuntoContacto">
                  <Form.Label>Asunto</Form.Label>
                  <Form.Select
                    name="asunto"
                    value={datos.asunto}
                    onChange={manejarCambio}
                    isInvalid={!!errores.asunto}
                  >
                    <option value="">Selecciona un asunto</option>
                    {ASUNTOS.map((texto) => (
                      <option key={texto} value={texto}>
                        {texto}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.asunto}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="mensajeContacto">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="mensaje"
                    rows={5}
                    maxLength={MAX_CARACTERES}
                    value={datos.mensaje}
                    onChange={manejarCambio}
                    isInvalid={!!errores.mensaje}
                  />
                  <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
                  <Form.Text muted>
                    Caracteres usados: {caracteresUsados} de {MAX_CARACTERES}. Quedan{' '}
                    {caracteresRestantes}.
                  </Form.Text>
                </Form.Group>

                <Button type="submit" variant="primary">
                  Enviar mensaje
                </Button>
              </Form>

              {enviado && (
                <Alert variant="success" className="mt-3 mb-0">
                  Mensaje enviado. Te responderemos al correo registrado.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Header as="h3" className="fs-5">Otros canales</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>Correo: ventas@tecnostore.com</ListGroup.Item>
              <ListGroup.Item>Telefono: (601) 555 0199</ListGroup.Item>
              <ListGroup.Item>Sede principal: Bogota, Colombia</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacto;
