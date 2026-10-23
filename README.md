# TecnoStore

E-commerce de tecnologia desarrollado en React para la asignatura Desarrollo en
Plataformas. No usa hojas de estilo ni librerias externas: todo lo que se ve es
HTML generado por los componentes.

## Como ejecutarlo

```
npm install
npm start
```

La aplicacion queda en http://localhost:3000

## Por que este tema

Somos estudiantes de Ingenieria de Sistemas y comprar tecnologia es una decision
que enfrentamos cada semestre. Conocemos el producto y sabemos que informacion
necesita el comprador. Ademas, un catalogo de tecnologia obliga a manejar objetos
con muchos atributos, filtros, un carrito con cantidades y validaciones de
formulario, que es justamente lo que vimos en clase.

## Estructura

```
public/
  imagenes/                       las 8 imagenes de los productos propios
src/
  index.js                        punto de entrada
  App.js                          componente raiz, estado compartido y efectos
  datos/
    productos.js                  catalogo (arreglo de objetos) y rutaImagen()
    tasasCambio.js                tasas de cambio y formateo de precios
    fechas.js                     formateo de fechas en español
  componentes/
    Encabezado.js                 navegacion y selector de moneda
    Inicio.js                     pagina principal
    Catalogo.js                   listado propio con buscador y filtros
    Novedades.js                  catalogo del servidor, con copia para sin conexion
    TarjetaProducto.js            dibuja un producto, propio o del servidor
    ZonaCarrito.js                zona donde se sueltan los productos (drag and drop)
    Carrito.js                    resumen, totales y confirmacion
    Pedidos.js                    historial de compras
    FormularioCompra.js           datos de envio y pago con validaciones
    Contacto.js                   formulario de contacto
    PiePagina.js                  enlaces internos y externos
```

## Donde esta cada requisito

Para ubicar cualquiera de estos en el editor, busca `-----` y salen todos los
rotulos en orden.

| # | Requisito | Donde verlo |
| --- | --- | --- |
| 2 | Formularios y controles con variables de estado | `FormularioCompra.js` y `Contacto.js`. Hay caja de texto, correo, numero, area de texto, menu desplegable, casillas y botones de opcion, todos controlados |
| 3 | Componentes y comunicacion entre ellos | carpeta `componentes/`. El padre baja datos por props y el hijo avisa llamando funciones del padre |
| 4 | Eventos generados por un componente | `onClick`, `onChange`, `onSubmit`, `onDragStart`, `onDragOver`, `onDrop` |
| 5 | Hook useState | `App.js`, `Catalogo.js`, `Novedades.js`, `ZonaCarrito.js` y los formularios |
| 6 | Hook de efecto useEffect | seis en total. Cinco en `App.js` (cargar y guardar el carrito, cargar y guardar los pedidos, titulo de la pestana) y uno en `Novedades.js` (pedir al servidor), este ultimo con funcion de limpieza |
| 7 | Peticiones a un servidor web con fetch | `Novedades.js`, contra `https://dummyjson.com` |
| 8 | Propiedad key en listas | en cada `map` que genera elementos |
| 9 | Imagenes | `rutaImagen()` en `datos/productos.js`. Hay imagenes locales en `public/imagenes/` y remotas que llegan del servidor |
| 10 | Filtros | `Catalogo.js`: busqueda por texto, categoria, orden y disponibilidad, los cuatro combinables |
| 11 | Subir a un hosting | ver la seccion de abajo |
| 12 | Drag and drop | `TarjetaProducto.js` inicia el arrastre y `ZonaCarrito.js` lo recibe |
| 13 | Almacenamiento en LocalStorage | tres cosas guardadas: el carrito y el historial de pedidos en `App.js`, y la copia del catalogo del servidor en `Novedades.js` |

## Valor agregado

Ninguno de estos cuatro aparece en la lista de requisitos.

- **El catalogo del servidor funciona sin internet.** De cada respuesta buena
  se guarda una copia en el navegador. Si el servidor falla, en vez del error
  se muestran esos productos con la fecha en que se descargaron. Esta en
  `Novedades.js`, en `leerCopia()` y `guardarCopia()`.
- **Historial de pedidos.** Cada compra confirmada queda guardada con su
  numero, fecha, productos y total. La seccion "Mis pedidos" los lista, del mas
  reciente al mas viejo, y tambien sobrevive al cierre de la pestaña.
- **Precios en cinco monedas.** Los precios se guardan en pesos colombianos y
  se convierten al mostrarlos. La tabla de tasas es la del ejercicio de cambio
  de moneda que hicimos en clase en TypeScript. El selector del encabezado
  afecta toda la tienda, incluidos los productos del servidor.
- **Carrito real.** Agrupa productos repetidos, permite cambiar cantidades,
  calcula subtotal, aplica envio gratis por monto y genera numero de pedido.

### Como demostrar el catalogo sin internet

Dentro de Novedades hay un recuadro "Modo de demostracion" con dos controles,
para no tener que apagar el wifi en plena sustentacion.

1. Entrar a Novedades con internet. Arriba dice "Datos recien traidos del
   servidor". En ese momento se guardo la copia.
2. Marcar la casilla "Simular que no hay internet". La lista sigue ahi, pero
   ahora avisa que es la copia guardada y dice de cuando es.
3. Con la casilla todavia marcada, presionar "Borrar las copias guardadas".
   Ahora si aparece el error, porque no hay red ni copia.
4. Desmarcar la casilla. Vuelve a pedirle al servidor y se guarda otra copia.

Si el internet se cae de verdad, el recorrido es el mismo. La diferencia es que
lo dispara el fallo real en lugar de la casilla.

## Lo que se puede mostrar funcionando

- **Novedades en linea.** Al entrar, la aplicacion le pide productos a un
  servidor web. Al cambiar la categoria vuelve a pedirlos. Muestra el aviso de
  "Consultando el servidor", y si no hay internet muestra el error con un boton
  para reintentar.
- **Arrastrar al carrito.** Cualquier tarjeta de producto se puede arrastrar
  hasta la zona "Carrito" que esta arriba del catalogo. El texto de la zona
  cambia cuando la tarjeta esta encima.
- **El carrito sobrevive al refresco.** Se guarda en el navegador cada vez que
  cambia. Puedes cerrar la pestana y volver, y sigue ahi.
- **El titulo de la pestana** muestra cuantas unidades hay en el carrito.
- **Precios en cinco monedas.** El selector del encabezado cambia los precios de
  toda la aplicacion, incluidos los productos que vienen del servidor.
- **Buscador y filtros combinables** en el catalogo propio.

## Subir la aplicacion a un hosting

El proyecto ya tiene `"homepage": "."` en el `package.json`, asi que las rutas
del build son relativas y funcionan en cualquier hosting, incluso dentro de una
subcarpeta.

1. Generar la version de produccion:

   ```
   npm run build
   ```

   Eso crea la carpeta `build/` con todo lo necesario.

2. Abrir https://app.netlify.com/drop en el navegador.

3. Arrastrar la carpeta `build` completa hasta esa pagina.

4. Netlify entrega una direccion publica del tipo
   `https://nombre-aleatorio.netlify.app`. Esa es la que se presenta.

No pide cuenta, ni tarjeta, ni instalar nada. Si quieren cambiar el nombre del
sitio o que no expire, ahi mismo ofrece crear una cuenta gratuita.

Para volver a publicar despues de un cambio, se repite `npm run build` y se
vuelve a arrastrar la carpeta.

## Buenas practicas aplicadas

- Un componente por archivo, con nombre en PascalCase y responsabilidad unica.
- Los datos estan separados de la vista en la carpeta `datos/`.
- El estado se declara en el componente mas alto que lo necesita y baja por props.
- El estado nunca se modifica directamente: se crean copias con spread, `map` y
  `filter`.
- Todos los campos de formulario son controlados y usan `preventDefault()`.
- Cada elemento de una lista lleva su `key`.
- `TarjetaProducto` se reutiliza para los productos propios y para los del
  servidor, porque ambos se convierten a la misma forma.
- El `useEffect` que consulta el servidor devuelve una funcion de limpieza, para
  que una respuesta vieja no pise a una nueva.
- Las peticiones al servidor manejan el error y le dan al usuario una salida.
- Los enlaces externos usan `rel="noreferrer"`.
