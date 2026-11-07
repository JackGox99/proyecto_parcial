import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { formatearPrecio } from '../datos/tasasCambio';
import { rutaImagen } from '../datos/productos';
import FormularioProducto from './FormularioProducto';

// ----- Función -----
// Qué hace: hace una petición al servidor y devuelve la respuesta ya
// convertida de JSON. Si el servidor responde con error, lanza ese mensaje
// para mostrarlo en pantalla. "/api" llega al servidor de Node gracias al
// "proxy" de package.json.
async function pedir(url, opciones = {}) {
  const respuesta = await fetch(url, {
    ...opciones,
    headers: { 'Content-Type': 'application/json' },
  });

  // DELETE responde 204, sin cuerpo.
  if (respuesta.status === 204) {
    return null;
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error || 'El servidor respondio ' + respuesta.status);
  }

  return datos;
}

// ----- Componente -----
// Qué hace: pantalla de administración con el CRUD de productos guardados
// en MySQL: lista (leer), crear, editar y eliminar.
function AdminProductos({ moneda }) {
  // ----- Función useState -----
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  // Contador que se sube después de cada cambio para volver a leer la lista.
  const [version, setVersion] = useState(0);
  // null: ventana cerrada. 'nuevo': creando. Un objeto: editando ese producto.
  const [editando, setEditando] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');

  // ----- Hook de efecto useEffect -----
  // Qué hace: lee los productos y las categorías de MySQL (la R del CRUD).
  // Se vuelve a ejecutar cada vez que "version" cambia.
  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    Promise.all([pedir('/api/productos'), pedir('/api/categorias')])
      .then(([listaProductos, listaCategorias]) => {
        if (cancelado) {
          return;
        }
        setProductos(listaProductos);
        setCategorias(listaCategorias);
        setError('');
      })
      .catch(() => {
        if (!cancelado) {
          setError('No hay conexion con el servidor. Arrancalo con "npm run servidor" y verifica que MySQL este encendido.');
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [version]);

  // ----- Función -----
  // Qué hace: crea (POST) o actualiza (PUT) según se esté editando o no.
  async function guardar(datos) {
    setGuardando(true);
    setErrorFormulario('');

    try {
      if (editando === 'nuevo') {
        const { codigo } = await pedir('/api/productos', { method: 'POST', body: JSON.stringify(datos) });
        setAviso(`Producto "${datos.nombre}" creado con el codigo ${codigo}.`);
      } else {
        await pedir(`/api/productos/${editando.codigo}`, { method: 'PUT', body: JSON.stringify(datos) });
        setAviso(`Producto "${datos.nombre}" actualizado.`);
      }

      setEditando(null);
      setVersion(version + 1);
    } catch (falla) {
      setErrorFormulario(falla.message);
    } finally {
      setGuardando(false);
    }
  }

  // ----- Función -----
  // Qué hace: borra el producto confirmado (DELETE).
  async function eliminar() {
    setGuardando(true);

    try {
      await pedir(`/api/productos/${aEliminar.codigo}`, { method: 'DELETE' });
      setAviso(`Producto "${aEliminar.nombre}" eliminado.`);
      setVersion(version + 1);
    } catch (falla) {
      setError(falla.message);
    } finally {
      setGuardando(false);
      setAEliminar(null);
    }
  }

  function abrirFormulario(producto) {
    setErrorFormulario('');
    setEditando(producto);
  }

  return (
    <Container as="main" className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-0">Administrar productos</h2>
          <p className="text-muted mb-0">Los cambios se guardan en la base de datos MySQL.</p>
        </div>
        <Button variant="primary" onClick={() => abrirFormulario('nuevo')} disabled={!!error}>
          <i className="bi bi-plus-lg me-1" />
          Nuevo producto
        </Button>
      </div>

      {aviso && (
        <Alert variant="success" dismissible onClose={() => setAviso('')}>
          {aviso}
        </Alert>
      )}

      {error && (
        <Alert variant="danger">
          <p>{error}</p>
          <Button variant="outline-danger" size="sm" onClick={() => setVersion(version + 1)}>
            Reintentar
          </Button>
        </Alert>
      )}

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-2 text-muted">Consultando la base de datos...</p>
        </div>
      )}

      {!cargando && !error && (
        <Card className="shadow-sm border-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="d-none d-sm-table-cell">Codigo</th>
                <th className="d-none d-sm-table-cell">Imagen</th>
                <th>Producto</th>
                <th className="d-none d-md-table-cell">Categoria</th>
                <th className="d-none d-sm-table-cell">Precio</th>
                <th className="d-none d-lg-table-cell">Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td className="d-none d-sm-table-cell">{producto.codigo}</td>
                  <td className="d-none d-sm-table-cell">
                    <img src={rutaImagen(producto)} alt={producto.nombre} width="72" height="50" className="imagen-tabla rounded border" />
                  </td>
                  <td>
                    <div className="fw-semibold">{producto.nombre}</div>
                    <small className="text-muted">{producto.marca}</small>
                    {/* En celular el precio va aquí porque su columna se oculta. */}
                    <div className="d-sm-none small text-primary fw-semibold">
                      {formatearPrecio(producto.precio, moneda)}
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">{producto.categoria}</td>
                  <td className="d-none d-sm-table-cell text-nowrap">{formatearPrecio(producto.precio, moneda)}</td>
                  <td className="d-none d-lg-table-cell">
                    <Badge bg={producto.disponible ? 'success' : 'danger'}>
                      {producto.disponible ? 'Disponible' : 'Agotado'}
                    </Badge>
                  </td>
                  <td className="text-end text-nowrap">
                    <Button variant="outline-primary" size="sm" className="me-1" aria-label={`Editar ${producto.nombre}`} onClick={() => abrirFormulario(producto)}>
                      <i className="bi bi-pencil" />
                    </Button>
                    <Button variant="outline-danger" size="sm" aria-label={`Eliminar ${producto.nombre}`} onClick={() => setAEliminar(producto)}>
                      <i className="bi bi-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {productos.length === 0 && (
            <p className="text-muted text-center py-4 mb-0">No hay productos en la base de datos.</p>
          )}
        </Card>
      )}

      {/* ----- Ventana de crear / editar ----- */}
      {/* Qué hace: el mismo formulario sirve para las dos cosas. Al cambiar la
          key, React lo crea de nuevo con los datos del producto elegido. */}
      <Modal show={editando !== null} onHide={() => setEditando(null)} size="lg" backdrop={guardando ? 'static' : true}>
        <Modal.Header closeButton={!guardando}>
          <Modal.Title>{editando === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorFormulario && <Alert variant="danger">{errorFormulario}</Alert>}
          {editando !== null && (
            <FormularioProducto
              key={editando === 'nuevo' ? 'nuevo' : editando.codigo}
              producto={editando === 'nuevo' ? null : editando}
              categorias={categorias}
              guardando={guardando}
              guardar={guardar}
              cancelar={() => setEditando(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* ----- Confirmación de eliminar ----- */}
      <Modal show={aEliminar !== null} onHide={() => setAEliminar(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar <strong>{aEliminar?.nombre}</strong>? Esta accion no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setAEliminar(null)} disabled={guardando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminar} disabled={guardando}>
            {guardando ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminProductos;
