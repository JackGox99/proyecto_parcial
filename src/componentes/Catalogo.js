import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { PRODUCTOS, CATEGORIAS } from '../datos/productos';
import TarjetaProducto from './TarjetaProducto';
import ZonaCarrito from './ZonaCarrito';

// ----- Componente -----
// Qué hace: muestra el listado de productos con buscador, filtro por
// categoría, ordenamiento y filtro de disponibilidad.
function Catalogo({ moneda, agregarAlCarrito, unidades }) {
  // ----- Función useState -----
  // Qué hace: guarda lo que el usuario escribió o eligió en cada control.
  // Hay una variable de estado por control y son independientes entre sí.
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('nombre');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  // El filtrado no se guarda en el estado: se vuelve a calcular en cada render
  // a partir de los valores actuales, así nunca queda desactualizado.
  const texto = busqueda.trim().toLowerCase();

  const filtrados = PRODUCTOS.filter((producto) => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.marca.toLowerCase().includes(texto);

    const coincideCategoria = categoria === '' || producto.categoria === categoria;
    const coincideStock = !soloDisponibles || producto.disponible;

    return coincideTexto && coincideCategoria && coincideStock;
  });

  // Se ordena una copia para no modificar el arreglo original del catalogo.
  const ordenados = [...filtrados].sort((a, b) => {
    if (orden === 'precioAsc') {
      return a.precio - b.precio;
    }
    if (orden === 'precioDesc') {
      return b.precio - a.precio;
    }
    return a.nombre.localeCompare(b.nombre);
  });

  // ----- Función -----
  // Qué hace: devuelve los cuatro filtros a su valor inicial.
  function limpiarFiltros() {
    setBusqueda('');
    setCategoria('');
    setOrden('nombre');
    setSoloDisponibles(false);
  }

  return (
    <Container as="main" className="py-4">
      <h2 className="mb-4">Catalogo de productos</h2>

      {/* ----- Función Drag and Drop ----- */}
      {/* Qué hace: zona que recibe las tarjetas arrastradas. */}
      <ZonaCarrito agregarAlCarrito={agregarAlCarrito} unidades={unidades} />

      <Card className="mb-4 shadow-sm border-0">
        <Card.Header as="h3" className="fs-6 fw-semibold">Filtros de busqueda</Card.Header>
        <Card.Body>
          {/* Row/Col reparten los controles: uno debajo del otro en celular y
              en columnas en pantallas más grandes. */}
          <Row className="g-3 align-items-end">
            <Col md={6} lg={4}>
              <Form.Label htmlFor="busqueda">Buscar por nombre o marca</Form.Label>
              {/* ----- Evento ----- */}
              {/* Qué hace: onChange se dispara con cada tecla y guarda el texto
                  en el estado, lo que vuelve a filtrar la lista al instante. */}
              <Form.Control
                id="busqueda"
                type="text"
                placeholder="Ej: Lenovo, monitor..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </Col>

            <Col md={6} lg={3}>
              <Form.Label htmlFor="categoria">Categoria</Form.Label>
              {/* ----- Evento ----- */}
              {/* Qué hace: guarda la categoría elegida para filtrar por ella. */}
              <Form.Select
                id="categoria"
                value={categoria}
                onChange={(evento) => setCategoria(evento.target.value)}
              >
                <option value="">Todas las categorias</option>
                {CATEGORIAS.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} lg={3}>
              <Form.Label htmlFor="orden">Ordenar por</Form.Label>
              {/* ----- Evento ----- */}
              {/* Qué hace: guarda el criterio con el que se ordena la lista. */}
              <Form.Select
                id="orden"
                value={orden}
                onChange={(evento) => setOrden(evento.target.value)}
              >
                <option value="nombre">Nombre</option>
                <option value="precioAsc">Precio de menor a mayor</option>
                <option value="precioDesc">Precio de mayor a menor</option>
              </Form.Select>
            </Col>

            <Col md={6} lg={2}>
              {/* ----- Evento ----- */}
              {/* Qué hace: al hacer clic limpia los cuatro filtros. */}
              <Button variant="outline-secondary" className="w-100" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            </Col>

            <Col xs={12}>
              {/* ----- Evento ----- */}
              {/* Qué hace: en una casilla se lee "checked", no "value". */}
              <Form.Check
                id="disponibles"
                type="switch"
                label="Mostrar solo productos disponibles"
                checked={soloDisponibles}
                onChange={(evento) => setSoloDisponibles(evento.target.checked)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <p className="text-muted">
        Se encontraron {ordenados.length} de {PRODUCTOS.length} productos.
      </p>

      {/* Qué hace: si no hay resultados muestra un aviso, y si los hay pinta
          un componente TarjetaProducto por cada producto, dentro de una
          grilla de 1, 2 o 3 columnas según el ancho de la pantalla. */}
      {ordenados.length === 0 ? (
        <Alert variant="warning">
          No hay productos que coincidan con la busqueda. Intenta con otro filtro.
        </Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {ordenados.map((producto) => (
            <Col key={producto.codigo}>
              <TarjetaProducto
                producto={producto}
                moneda={moneda}
                agregarAlCarrito={agregarAlCarrito}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Catalogo;
