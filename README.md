# Taller de Playwright · El Rincón del Café

Taller de automatización de pruebas E2E con Playwright para la clase de Pruebas Asistidas por IA (Universidad Icesi). La aplicación bajo prueba es **El Rincón del Café**, una app hecha con Node y Express que trae bugs inyectados a propósito, uno por historia de usuario.

Escogí dos historias:

- **HU-03 · Carrito**: agregar productos con su cantidad y ver cuánto suman.
- **HU-04 · Cupones**: aplicar un cupón y ver el descuento.

## Requisitos

- Node.js 22 o superior
- Git
- Navegadores de Playwright (`npx playwright install`)

## Cómo correr la app

```bash
cd cafeteria_v2
npm install
npm start
```

Queda en `http://localhost:3000` con los bugs activos. Para la versión de referencia (sin bugs):

```bash
# bash
MODO_REFERENCIA=true npm start
# PowerShell
$env:MODO_REFERENCIA="true"; npm start
```

## Cómo correr las pruebas

Con la app levantada en otra terminal:

```bash
cd pruebas-playwright
npm install
npx playwright install
npx playwright test                    # todos los navegadores
npm run test:bugs                      # solo las pruebas que detectan los bugs (@bug)
npx playwright test --project=chromium # un solo navegador
npm run test:headed                    # con el navegador visible
npm run report                         # abre el reporte HTML
```

Para correrlas contra la app desplegada (por ejemplo en Render) solo se cambia la URL base:

```bash
# bash
BASE_URL=https://mi-app.onrender.com npx playwright test
# PowerShell
$env:BASE_URL="https://mi-app.onrender.com"; npx playwright test
```

Si no se define `BASE_URL`, usa `http://localhost:3000`.

## Estructura en capas

```
pruebas-playwright/
├── tests/      specs: solo test y expect, sin localizadores ni URLs
├── fixtures/   preparan el estado (sesión iniciada, carrito vacío) y entregan la página
├── pages/      page objects: único lugar con localizadores y acciones, sin expect
└── data/       datos de prueba (usuario, productos, cupones), sin lógica
```

Las dependencias van solo hacia abajo: `tests` usa `fixtures`, las `fixtures` usan `pages` y `data`, y las `pages` no conocen a nadie más.

- `data/usuarios.js`: usuario con el que se inicia sesión (`estudiante1@cafe.test`; sirve cualquiera hasta `estudiante16`).
- `data/productos.js`: productos y precios usados.
- `data/cupones.js`: códigos de cupón y una función que genera un correo de cliente único.
- `pages/PaginaLogin.js`, `PaginaCarrito.js`, `PaginaCupones.js`: acciones y localizadores de cada pantalla.
- `fixtures/login.js`: `paginaLogueada`, inicia sesión y verifica que se ve el botón Carrito.
- `fixtures/carrito.js`: `paginaCarrito`, ya logueado, en Carrito y con el carrito vacío.
- `fixtures/cupones.js`: `paginaCupones`, ya logueado y en Cupones.

Los localizadores siguen la escala vista en clase: `getByRole`, `getByLabel`, `getByText` y por último `getByTestId`.

### Estado compartido

El carrito se guarda en el servidor por usuario y se conserva entre pruebas, y todas las pruebas inician sesión con el mismo usuario. Por eso el `playwright.config.js` usa `workers: 1` y `fullyParallel: false`, y la fixture `paginaCarrito` vacía el carrito antes de cada prueba. Primero probé con `test.describe.configure({ mode: 'serial' })`, pero en ese modo, si una prueba falla, Playwright se salta las que siguen y las pruebas `@bug` tapaban a las demás, así que lo quité.

Para los cupones, el servidor recuerda quién ya usó cada uno. Cada prueba usa un correo de cliente distinto (`correoUnico()`), así no depende del orden y tampoco se llama a `/api/reiniciar`, que en Render borraría los datos de los compañeros.

### Validación nativa de la cantidad

El campo Cantidad tiene `min=1` y `max=10`, entonces con 0 u 11 el navegador bloquea el envío y el servidor nunca responde. Se cubren las dos capas:

- **UI** (`carrito.spec.js`, CP-C07 y CP-C08): se verifica que el campo queda inválido (`validationMessage` no vacío), que el estado sigue en `vacío` y que el subtotal no cambia.
- **API** (`carrito-api.spec.js`, CP-C09 a CP-C12): se llama directamente a `/api/carrito` con 0, 11, -1 y 2.5, compartiendo la sesión del login, y se verifica el 400 y el mensaje.

## Casos de prueba

### HU-03 · Carrito

| ID | Caso | Criterio que cubre | Esperado |
|---|---|---|---|
| CP-C01 | Estado inicial del carrito | Estado vacío | `vacío`, subtotal `$0` |
| CP-C02 `@bug` | Latte × 3 | Subtotal = precio × cantidad | `$36000` |
| CP-C03 | Espresso × 1 (límite inferior) | Subtotal = precio × cantidad | `$8000` |
| CP-C04 `@bug` | Té verde × 10 (límite superior) | Subtotal = precio × cantidad | `$70000` |
| CP-C05 `@bug` | Latte × 2 + Croissant × 3 | Subtotal del carrito = suma | `$51000` |
| CP-C06 | Agregar un producto | Estado de vacío a con productos | `con productos` |
| CP-C07 | Cantidad 0 (UI) | Cantidad entre 1 y 10 | campo inválido, sigue `vacío` |
| CP-C08 | Cantidad 11 (UI) | Cantidad entre 1 y 10 | campo inválido, sigue `vacío` |
| CP-C09 | API con cantidad 0 | Cantidad entre 1 y 10 | 400 y "La cantidad debe estar entre 1 y 10" |
| CP-C10 | API con cantidad 11 | Cantidad entre 1 y 10 | 400 y el mismo mensaje |
| CP-C11 | API con cantidad -1 | Cantidad entre 1 y 10 | 400 y el mismo mensaje |
| CP-C12 | API con cantidad 2.5 | Cantidad entre 1 y 10 | 400 y el mismo mensaje |
| CP-C13 | Producto y tamaño en la lista | Agregar productos | `Capuchino × 2 (grande)` |
| CP-C14 | Vaciar carrito | Estado del carrito | `vacío`, `$0` |
| CP-C15 | Confirmar con productos | Estado del carrito | `confirmado` |
| CP-C16 | Confirmar carrito vacío | Estado del carrito | "El carrito está vacío" |

### HU-04 · Cupones

| ID | Caso | Criterio que cubre | Esperado |
|---|---|---|---|
| CP-U01 | CAFE10 con subtotal 50000 | Descuento = subtotal × porcentaje | `aplicado`, descuento `$5000`, total `$45000` |
| CP-U02 | CAFE10 con subtotal 12345 | Descuento = subtotal × porcentaje | descuento `$1235`, total `$11110` |
| CP-U03 | Código en minúsculas | Aplicar cupón | `aplicado` |
| CP-U04 `@bug` | VENCIDO20 | Cupón vencido no se aplica | "El cupón está vencido" y sin estado `aplicado` |
| CP-U05 | Aplicar y usar CAFE10 | Aplicar cupón | `usado` |
| CP-U06 | Mismo cliente aplica un cupón ya usado | Cupón ya usado muestra error | "Este cupón ya fue usado por este cliente" |
| CP-U07 | Mismo cliente usa dos veces | Cupón ya usado muestra error | el mismo mensaje |
| CP-U08 | Otro cliente usa el cupón | Cupón ya usado solo afecta al cliente | `aplicado` |
| CP-U09 | Cupón inexistente | Validación del cupón | "El cupón no existe" |
| CP-U10 | Subtotal en 0 | Validación del subtotal | "El subtotal debe ser mayor que 0" |
| CP-U11 | Correo vacío | Validación del correo | "Indica el correo del cliente" |

Además hay dos pruebas de inicio de sesión en `login.spec.js` que sirven de apoyo (no son parte de las historias).

## Bugs encontrados

### HU-03 · El subtotal ignora la cantidad

- **Dónde:** `server.js`, función `resumenCarrito()`. El subtotal suma `i.precio` en lugar de `i.precio * i.cantidad`.
- **Pasos para reproducir:** iniciar sesión, ir a Carrito, elegir Latte con cantidad 3 y pulsar "Agregar al carrito".
- **Esperado:** subtotal `$36000`.
- **Obtenido:** subtotal `$12000`.
- Con cantidad 1 no se nota, por eso CP-C03 pasa.
- **Pruebas que lo detectan:** CP-C02, CP-C04 y CP-C05.

### HU-04 · Se aceptan cupones vencidos

- **Dónde:** `server.js`, ruta `/api/cupones/aplicar`. La validación de vencimiento está desactivada.
- **Pasos para reproducir:** iniciar sesión, ir a Cupones, escribir código `VENCIDO20`, subtotal `50000` y un correo, y pulsar "Aplicar cupón".
- **Esperado:** mensaje "El cupón está vencido".
- **Obtenido:** estado `aplicado` con descuento de `$10000`.
- **Prueba que lo detecta:** CP-U04.

## Resultados de las ejecuciones

Las pruebas que detectan los bugs fallan con la app con bugs y pasan con la de referencia.

| Ejecución | Navegadores | Resultado |
|---|---|---|
| App con bugs | chromium y webkit | 50 pasaron, 8 fallaron: CP-C02, CP-C04, CP-C05 y CP-U04 en cada navegador |
| App de referencia (`MODO_REFERENCIA=true`) | chromium y webkit | 58 pasaron, 0 fallaron |

Firefox está configurado como project, pero en mi portátil Windows no logré que abriera: `firefox.exe` falla al arrancar con el error de configuración en paralelo (no encuentra el ensamblado `mozglue`), antes de ejecutar cualquier prueba. Por eso las ejecuciones de arriba son solo con chromium y webkit. En otra máquina `npx playwright test` corre los tres.
