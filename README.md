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
  componentes/
    Encabezado.js                 navegacion y selector de moneda
    Inicio.js                     pagina principal
    Catalogo.js                   listado propio con buscador y filtros
    Novedades.js                  catalogo pedido a un servidor web con fetch
    TarjetaProducto.js            dibuja un producto, propio o del servidor
    ZonaCarrito.js                zona donde se sueltan los productos (drag and drop)
    Carrito.js                    resumen, totales y confirmacion
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
| 6 | Hook de efecto useEffect | tres en `App.js` (cargar carrito, guardar carrito, titulo de la pestana) y uno en `Novedades.js` (pedir al servidor) |
| 7 | Peticiones a un servidor web con fetch | `Novedades.js`, contra `https://dummyjson.com` |
| 8 | Propiedad key en listas | en cada `map` que genera elementos |
| 9 | Imagenes | `rutaImagen()` en `datos/productos.js`. Hay imagenes locales en `public/imagenes/` y remotas que llegan del servidor |
| 10 | Filtros | `Catalogo.js`: busqueda por texto, categoria, orden y disponibilidad, los cuatro combinables |
| 11 | Subir a un hosting | ver la seccion de abajo |
| 12 | Drag and drop | `TarjetaProducto.js` inicia el arrastre y `ZonaCarrito.js` lo recibe |
| 13 | Almacenamiento en LocalStorage | `App.js`, los dos `useEffect` del carrito |

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
