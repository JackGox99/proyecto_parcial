# TecnoStore

E-commerce de tecnologia desarrollado en React para la asignatura Desarrollo en
Plataformas. Primera entrega enfocada en la funcionalidad, sin hojas de estilo:
todo lo que se ve es HTML generado por los componentes.

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
src/
  index.js                        punto de entrada
  App.js                          componente raiz y estado compartido
  datos/
    productos.js                  catalogo (arreglo de objetos)
    tasasCambio.js                tasas de cambio y formateo de precios
  componentes/
    Encabezado.js                 navegacion y selector de moneda
    Inicio.js                     pagina principal
    Catalogo.js                   listado con buscador y filtros
    TarjetaProducto.js            dibuja un producto individual
    Carrito.js                    resumen, totales y confirmacion
    FormularioCompra.js           datos de envio y pago con validaciones
    Contacto.js                   formulario de contacto
    PiePagina.js                  enlaces internos y externos
```

## Donde esta cada criterio del parcial

| Criterio | Donde verlo |
| --- | --- |
| Pagina de inicio | `componentes/Inicio.js` |
| Motivacion del tema | `componentes/Inicio.js`, seccion "Por que escogimos este tema" |
| Enlaces | `componentes/Encabezado.js` y `componentes/PiePagina.js` |
| Formularios | `componentes/FormularioCompra.js` y `componentes/Contacto.js` |
| Validaciones | funcion `validar()` en ambos formularios |
| Eventos | `onClick`, `onChange`, `onSubmit` en todos los componentes |
| Objetos | `datos/productos.js`, con sub-objeto `especificaciones` |
| Componentes | carpeta `componentes/`, ocho componentes con props |
| useState | `App.js` (seccion, carrito, moneda), `Catalogo.js`, los formularios |
| Valor agregado | conversion de precios entre monedas y carrito con cantidades |

## Valor agregado

- **Precios en varias monedas.** Los precios se guardan en pesos colombianos y se
  convierten al vuelo con la tabla de tasas del ejercicio de TypeScript que
  trabajamos en clase. El selector esta en el encabezado y afecta toda la pagina.
- **Carrito real.** Agrupa productos repetidos, permite cambiar cantidades,
  calcula subtotal, aplica envio gratis por monto y genera un numero de pedido.
- **Buscador y filtros combinables.** Busqueda por nombre o marca, filtro por
  categoria, ordenamiento por precio y filtro de disponibilidad.

## Buenas practicas aplicadas

- Un componente por archivo, con nombre en PascalCase y responsabilidad unica.
- Los datos estan separados de la vista en la carpeta `datos/`.
- El estado se declara en el componente mas alto que lo necesita y baja por props.
- El estado nunca se modifica directamente: se crean copias con spread, `map` y
  `filter`.
- Todos los campos de formulario son controlados y usan `preventDefault()`.
- Cada elemento de una lista lleva su `key`.
- Los enlaces externos usan `rel="noreferrer"`.
