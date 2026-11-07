import { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

// ----- Función -----
// Qué hace: arma los valores iniciales del formulario. Si llega un producto
// es una edición y se copian sus datos; si no, el formulario arranca vacío.
function valoresIniciales(producto) {
  if (!producto) {
    return {
      nombre: '',
      marca: '',
      categoriaId: '',
      precio: '',
      descripcion: '',
      imagen: '',
      disponible: true,
      envioGratis: false,
    };
  }

  return {
    nombre: producto.nombre,
    marca: producto.marca,
    categoriaId: String(producto.categoriaId),
    precio: String(producto.precio),
    descripcion: producto.descripcion,
    imagen: producto.imagen || '',
    disponible: producto.disponible,
    envioGratis: producto.envioGratis,
  };
}

// ----- Componente -----
// Qué hace: formulario para crear o editar un producto. No habla con el
// servidor: valida, arma el objeto y se lo entrega al padre con "guardar".
function FormularioProducto({ producto, categorias, guardando, guardar, cancelar }) {
  // ----- Función useState -----
  // Qué hace: un objeto con los campos fijos, un arreglo con las filas de
  // especificaciones (pueden ser cuantas quiera el usuario) y los errores.
  const [datos, setDatos] = useState(() => valoresIniciales(producto));
  const [especificaciones, setEspecificaciones] = useState(() =>
    producto
      ? Object.entries(producto.especificaciones).map(([atributo, valor]) => ({ atributo, valor }))
      : [{ atributo: '', valor: '' }]
  );
  const [errores, setErrores] = useState({});

  // ----- Evento -----
  // Qué hace: un solo manejador para todos los campos, usando el name. Al
  // escribir en un campo se le quita el error, para que deje de verse en rojo.
  function manejarCambio(evento) {
    const { name, type, value, checked } = evento.target;
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: undefined });
    }
  }

  // ----- Evento -----
  // Qué hace: cambia el atributo o el valor de una fila de especificaciones.
  function cambiarEspecificacion(indice, campo, valor) {
    setEspecificaciones(
      especificaciones.map((fila, i) => (i === indice ? { ...fila, [campo]: valor } : fila))
    );
  }

  function agregarEspecificacion() {
    setEspecificaciones([...especificaciones, { atributo: '', valor: '' }]);
  }

  function quitarEspecificacion(indice) {
    setEspecificaciones(especificaciones.filter((fila, i) => i !== indice));
  }

  // ----- Validaciones -----
  // Qué hace: las mismas reglas que revisa el servidor, para avisar antes de
  // hacer la petición.
  function validar() {
    const nuevos = {};
    const precio = Number(datos.precio);

    if (datos.nombre.trim().length < 3) {
      nuevos.nombre = 'Minimo 3 caracteres.';
    }
    if (!datos.marca.trim()) {
      nuevos.marca = 'La marca es obligatoria.';
    }
    if (!datos.categoriaId) {
      nuevos.categoriaId = 'Selecciona una categoria.';
    }
    if (!Number.isInteger(precio) || precio <= 0) {
      nuevos.precio = 'Escribe un valor entero mayor que cero, sin puntos.';
    }
    if (datos.descripcion.trim().length < 10) {
      nuevos.descripcion = 'Minimo 10 caracteres.';
    }

    return nuevos;
  }

  // ----- Evento -----
  // Qué hace: valida y, si todo está bien, le entrega al padre el producto
  // con los tipos correctos (números en vez de texto y las especificaciones
  // convertidas de arreglo a objeto).
  function manejarEnvio(evento) {
    evento.preventDefault();

    const encontrados = validar();
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    const comoObjeto = {};
    especificaciones
      .filter((fila) => fila.atributo.trim() && fila.valor.trim())
      .forEach((fila) => {
        comoObjeto[fila.atributo.trim()] = fila.valor.trim();
      });

    guardar({
      ...datos,
      categoriaId: Number(datos.categoriaId),
      precio: Number(datos.precio),
      especificaciones: comoObjeto,
    });
  }

  return (
    <Form onSubmit={manejarEnvio} noValidate>
      <Row>
        <Form.Group as={Col} md={8} className="mb-3" controlId="productoNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="nombre" value={datos.nombre} onChange={manejarCambio} isInvalid={!!errores.nombre} />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={4} className="mb-3" controlId="productoMarca">
          <Form.Label>Marca</Form.Label>
          <Form.Control name="marca" value={datos.marca} onChange={manejarCambio} isInvalid={!!errores.marca} />
          <Form.Control.Feedback type="invalid">{errores.marca}</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} md={6} className="mb-3" controlId="productoCategoria">
          <Form.Label>Categoria</Form.Label>
          <Form.Select name="categoriaId" value={datos.categoriaId} onChange={manejarCambio} isInvalid={!!errores.categoriaId}>
            <option value="">Selecciona una categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.categoriaId}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={6} className="mb-3" controlId="productoPrecio">
          <Form.Label>Precio en pesos (COP)</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              name="precio"
              min="1"
              step="1"
              value={datos.precio}
              onChange={manejarCambio}
              isInvalid={!!errores.precio}
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="productoDescripcion">
        <Form.Label>Descripcion</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="descripcion"
          maxLength={255}
          value={datos.descripcion}
          onChange={manejarCambio}
          isInvalid={!!errores.descripcion}
        />
        <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="productoImagen">
        <Form.Label>Imagen (opcional)</Form.Label>
        <Form.Control name="imagen" value={datos.imagen} onChange={manejarCambio} placeholder="monitor-lg.svg o https://..." />
        <Form.Text muted>
          Nombre de un archivo de public/imagenes o una direccion web. Si se deja
          vacio se muestra la imagen de reemplazo.
        </Form.Text>
      </Form.Group>

      <div className="d-flex flex-wrap gap-4 mb-3">
        <Form.Check type="switch" id="productoDisponible" name="disponible" label="Disponible" checked={datos.disponible} onChange={manejarCambio} />
        <Form.Check type="switch" id="productoEnvio" name="envioGratis" label="Envio gratis" checked={datos.envioGratis} onChange={manejarCambio} />
      </div>

      <fieldset className="mb-3">
        <legend className="fs-6 fw-semibold">Especificaciones tecnicas</legend>
        {/* Qué hace: una fila por especificación. Las filas que queden con
            algún campo vacío no se guardan. */}
        {especificaciones.map((fila, indice) => (
          <InputGroup key={indice} className="mb-2">
            <Form.Control
              placeholder="Atributo (ej: memoria)"
              aria-label="Atributo"
              value={fila.atributo}
              onChange={(evento) => cambiarEspecificacion(indice, 'atributo', evento.target.value)}
            />
            <Form.Control
              placeholder="Valor (ej: 16 GB RAM)"
              aria-label="Valor"
              value={fila.valor}
              onChange={(evento) => cambiarEspecificacion(indice, 'valor', evento.target.value)}
            />
            <Button variant="outline-danger" aria-label="Quitar especificacion" onClick={() => quitarEspecificacion(indice)}>
              <i className="bi bi-x-lg" />
            </Button>
          </InputGroup>
        ))}
        <Button variant="outline-secondary" size="sm" onClick={agregarEspecificacion}>
          <i className="bi bi-plus-lg me-1" />
          Agregar especificacion
        </Button>
      </fieldset>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="outline-secondary" onClick={cancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={guardando}>
          {guardando ? 'Guardando...' : producto ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </Form>
  );
}

export default FormularioProducto;
