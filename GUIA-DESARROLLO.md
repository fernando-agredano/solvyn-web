# Guía de desarrollo: Solvyn Solutions

Sigue los pasos en orden. Cada fase termina con algo funcionando y guardado en Git. Los comandos y nombres de modelo pueden cambiar con el tiempo: ante cualquier diferencia, confirma en docs.claude.com.

**Convenciones**
- Los bloques con `>` son mensajes que pegas dentro de Claude Code.
- Los bloques de código son comandos que pegas en la terminal.
- **Modelo** indica con cuál arrancar (`/model haiku`, `/model sonnet`, `/model opus`). Si el resultado no sirve, sube un nivel solo para esa tarea y regresa después.

---

## Hoja de ruta: qué pedirle a Claude Code y en qué orden

Pega los prompts **uno por uno, en este orden**. Entre uno y otro revisa el resultado en `npm run dev`. Al terminar cada fase: `git push` y `/clear`. Todos los prompts completos están en la Parte C.

| # | Prompt | Modelo | Qué obtienes |
|---|---|---|---|
| 1 | 1.1 Base | Haiku | Fuentes, colores, logos, página negra con logo |
| 2 | 2a.1 Plan del hero | Sonnet | Plan (sin código) |
| 3 | 2a.2 Implementación del hero | Sonnet | Hero con circuito animado |
| 4 | 2b.1 Cómo funciona, propuesta en vivo, soluciones | Sonnet | 3 secciones |
| 5 | 2b.2 Industrias, demos, proceso, por qué | Sonnet | 4 secciones |
| 6 | 2b.3 Precios, FAQ, CTA, footer | Sonnet | 4 secciones |
| 7 | 2c SEO y revisión | Haiku | Landing terminada |
| 8 | 3a Motor y catálogo | Sonnet | Cálculo de precios con pruebas |
| 9 | 3b.1 Plan de pasos | Sonnet | Plan (sin código) |
| 10 | 3b.2 Pasos 1 a 4 y panel en vivo | Sonnet | Formulario funcionando |
| 11 | 3c.1 Plan de la propuesta | Sonnet | Plan (sin código) |
| 12 | 3c.2 Generación y propuesta final | Sonnet | Propuesta con vista previa |
| 13 | 3d Agenda y confirmación | Sonnet | Flujo completo (simulado) |
| 14 | 4.1 Supabase y tablas | Sonnet | Base de datos |
| 15 | 4.2 Plan de la IA | Opus | Plan (sin código) |
| 16 | 4.3 IA, ruta, límites, enlace | Opus | Propuestas con Gemini |
| 17 | 4.4 Conectar interfaz | Sonnet | Configurador con IA |
| 18 | 5.1 Leads | Sonnet | Leads guardados |
| 19 | 5.2 Correos | Sonnet | Avisos por correo |
| 20 | 5.3 Reuniones y WhatsApp | Sonnet | Agenda real |
| 21 | 5.4 PDF | Sonnet | Propuesta descargable |
| 22 | 6.1 Plan de seguridad | Opus | Plan (sin código) |
| 23 | 6.2 Autenticación | Opus | Acceso protegido |
| 24 | 6.3 Pantallas de leads | Sonnet | Panel de leads |
| 25 | 6.4 Ajustes y disponibilidad | Sonnet | Tarifa editable |
| 26 | 7.1 Textos legales | Haiku | Privacidad y términos |
| 27 | 7.2 Analítica | Haiku | Embudo medido |
| 28 | 7.3 Revisión final | Haiku | Reporte previo al lanzamiento |

Los prompts de **Plan** no escriben código: léelos, corrige lo que no te guste y luego pega el siguiente.

---

## Parte A. Preparación (una sola vez)

### A1. Instala lo básico
1. **Node.js** versión LTS desde nodejs.org. Verifica con `node -v`.
2. **Git** desde git-scm.com. Verifica con `git --version`. Configúralo una vez:
   ```
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@correo.com"
   ```
3. **Un editor**: Visual Studio Code es lo más cómodo.
4. **Claude Code**. En Mac o Linux:
   ```
   curl -fsSL https://claude.ai/install.sh | bash
   ```
   En Windows usa el instalador de PowerShell o la opción con npm que indica la documentación. Verifica con `claude --version`.

### A2. Crea las cuentas (todas con plan gratuito)
- **GitHub** (código). Necesaria ya.
- **Vercel** (publicación). Necesaria en la Fase 1. Revisa en sus términos si el plan gratuito permite uso comercial antes del lanzamiento; si no, Cloudflare Pages o Netlify son alternativas.
- **Supabase** (base de datos y sesión de tu panel). Necesaria en la Fase 4.
- **Google AI Studio** (clave de Gemini). Necesaria en la Fase 4.
- **Resend** (correos) y **Cal.com** (reuniones). Necesarias en la Fase 5.
- **Dominio** (por ejemplo solvyn.mx). Solo en la Fase 7.

---

## Parte B. Crear el proyecto

### B1. Crea la carpeta
Elige un lugar fuera de iCloud, OneDrive o Dropbox:
```
mkdir solvyn-web
cd solvyn-web
```

### B2. Crea el proyecto Next.js (lo haces tú, sin gastar tokens)
```
npx create-next-app@latest .
```
Acepta las opciones recomendadas: TypeScript sí, ESLint sí, Tailwind sí, carpeta `src` sí, App Router sí, alias de importación por defecto. Si pregunta por el gestor de paquetes, usa npm.


> **Si ya pusiste el contenido del zip dentro de la carpeta antes de crear el proyecto:** `create-next-app` se niega a trabajar en una carpeta con archivos ajenos. Solución: (1) mueve temporalmente `CLAUDE.md`, `GUIA-DESARROLLO.md` y la carpeta `design` a otra carpeta (por ejemplo el Escritorio); (2) con la carpeta vacía, ejecuta `npx create-next-app@latest .`; (3) devuelve los tres elementos a la raíz del proyecto; (4) guarda el estado con `git add .` y `git commit -m "chore: add design handoff and project guide"` (create-next-app ya inicializa Git).

### B3. Agrega el paquete de diseño
Descomprime `solvyn-handoff.zip` **dentro de la carpeta del proyecto**, de modo que queden en la raíz:
```
solvyn-web/
├── CLAUDE.md
├── GUIA-DESARROLLO.md
├── design/
│   ├── README.md
│   ├── Main.dc.html
│   ├── Configurador.dc.html
│   ├── logo/
│   └── screenshots/
├── src/
├── package.json
└── ...
```
Si `create-next-app` ya generó su propio `CLAUDE.md` o `AGENTS.md`, conserva el tuyo y pega al final cualquier contenido útil del otro.

**Muy recomendado: capturas de referencia.** Abre el diseño en el lienzo de Claude (el enlace del artefacto), recorre cada pantalla y guarda una captura de cada sección en `design/screenshots/` **con estos nombres exactos**, porque los prompts los usan:

| Landing | Configurador |
|---|---|
| `hero.png` | `cfg-paso1-objetivo.png` |
| `como-funciona.png` | `cfg-paso2-industria.png` |
| `propuesta-en-vivo.png` | `cfg-paso3-detalles.png` |
| `soluciones.png` | `cfg-paso4-contacto.png` |
| `industrias.png` | `cfg-generando.png` |
| `demos.png` | `cfg-propuesta-resumen.png` (encabezado, indicadores y módulos) |
| `proceso.png` | `cfg-propuesta-arquitectura.png` |
| `por-que.png` | `cfg-propuesta-preview-escritorio.png` |
| `precios.png` | `cfg-propuesta-preview-movil.png` |
| `faq.png` | `cfg-propuesta-fases.png` (fases, tecnologías y cierre) |
| `cta-final.png` | `cfg-agendar.png` y `cfg-confirmacion.png` |

Si falta alguna captura, el prompt sigue funcionando: Claude Code la omite y se guía por el código del prototipo. Con ella, compara el resultado contra la imagen y detecta diferencias que el código solo no muestra. Las pantallas del panel `/admin` no tienen diseño previo: se construyen con el mismo sistema visual.

### B4. Primer commit y repositorio
1. En github.com crea un repositorio **privado** llamado `solvyn-web`, vacío (sin README).
2. En la terminal:
   ```
   git add .
   git commit -m "chore: add design handoff and project guide"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/solvyn-web.git
   git push -u origin main
   ```

---

## Parte C. Fases de desarrollo (con prompts completos)

**Cómo usar esta parte**
- Cada prompt está en un bloque de código para copiarlo completo. Pégalo tal cual dentro de Claude Code.
- Al empezar cada fase: escribe `/clear` y luego `/model haiku`, `/model sonnet` o `/model opus` según se indique.
- Los prompts marcados **Plan** piden un plan sin código. Léelo, corrige lo que no te guste y solo entonces pega el prompt **Implementación**.
- Si algo no queda fiel al diseño, no empieces de cero: pega el prompt de **Corrección** (está al final de esta parte) con lo que ves mal.

**Rutina al terminar cada fase**
1. Revisa el resultado con `npm run dev` (http://localhost:3000).
2. Pega: `Actualiza la línea "Fase actual" de CLAUDE.md con la fase que sigue y haz commit.`
3. En la terminal: `git push`.
4. `/clear` y pasa a la siguiente fase.

---

### Fase 1. Base del proyecto
**Modelo:** Haiku · **Resultado:** fuentes, colores, logos y una primera versión publicada.

**Prompt 1.1: base**
```text
Lee CLAUDE.md y design/README.md completos. Vamos a hacer la Fase 1: base del proyecto. No construyas ninguna sección de la landing todavía.

Haz lo siguiente, en este orden:

1. Fuente: configura Archivo como fuente variable con next/font/google, incluyendo el eje de ancho (wdth, de 62 a 125) y todos los pesos necesarios (400, 500, 600). Úsala como fuente por defecto del sitio.
2. Utilidades de tipografía: crea dos clases reutilizables, `.wide` (font-stretch: 125%) y `.semi` (font-stretch: 112%), tal como están en el <style> de design/Main.dc.html.
3. Colores: define como variables CSS globales y también en el tema de Tailwind los colores de la sección "Sistema visual" de CLAUDE.md: fondo, superficie, texto principal, títulos, texto secundario, etiquetas, apagado, bordes (tres intensidades), señal verde, brillo de la señal, error y los cuatro acentos de la vista previa del cliente.
4. Estilos globales: fondo #000000, texto #F5F5F5, antialiasing suave, `box-sizing: border-box`, scroll suave, contorno de foco blanco de 2px con offset de 3px, y un bloque que respete prefers-reduced-motion.
5. Logos: copia design/logo/solvyn-logo.png y design/logo/solvyn-iso.png a public/brand/ (mismos nombres).
6. Configuración del sitio: crea src/config/site.ts con nombre ("Solvyn Solutions"), correo, WhatsApp y precios como placeholders ("[TU CORREO]", "[TU WHATSAPP]", "[TU PRECIO]"), y la URL base como constante.
7. Página inicial: deja src/app/page.tsx con fondo negro y el logotipo centrado en pantalla. Nada más.
8. Metadata: título, descripción, idioma es-MX en <html lang>, y favicon generado a partir del isotipo.
9. Revisa que .gitignore incluya .env*.local y node_modules.

Al terminar: corre `npm run lint` y `npm run build`, corrige cualquier error y haz un commit con el mensaje "feat: project base, fonts, tokens and brand assets". Dime qué archivos creaste o modificaste.
```

**Listo cuando:** `npm run dev` muestra fondo negro con el logo y `npm run build` no da errores.

**Publica:** en vercel.com, "Add New Project", importa el repositorio `solvyn-web` y despliega. Cada `git push` a `main` publicará automáticamente.

---

### Fase 2. Landing
**Modelo:** Sonnet (Opus solo para el circuito si no queda fiel) · **Resultado:** la landing completa.

#### 2a. Hero con circuito animado

**Prompt 2a.1: Plan**
```text
Lee CLAUDE.md y design/README.md. Vamos a portar el hero de la landing. Todavía NO escribas código.

Lee únicamente: (a) la sección marcada <!-- HERO --> de design/Main.dc.html, y (b) el bloque <style> dentro de <helmet> del mismo archivo. Si existe design/screenshots/hero.png, míralo también.

Dame un plan con:
- Lista de archivos y componentes que propones (por ejemplo Navbar, Hero, CircuitBackground, CircuitSpotlight) y qué hace cada uno.
- Cómo guardarás las rutas SVG de los trazos: deben copiarse exactamente del diseño a un archivo de datos, src/components/hero/circuit-paths.ts, sin redibujarlas.
- Cómo lograrás cada efecto: dibujo de trazos al cargar, pulsos de luz (1 de cada 3 en verde #46D19A), haz de luz que sigue al cursor (segunda capa de trazos más brillante con máscara radial de 230px), chip central con el isotipo y su resplandor.
- Cómo garantizarás que el contenido sea visible aunque las animaciones no corran, y cómo respetarás prefers-reduced-motion.
- Cómo se comportará en celular (el diseño ancla el circuito a un ancho mínimo y lo recorta).
- Qué dudas tienes.

Espera mi aprobación antes de implementar.
```

**Prompt 2a.2: Implementación**
```text
Aprobado. Implementa el plan del hero tal como lo describiste, con estos criterios:

- Fidelidad: mismos tamaños, espacios, colores, textos y animaciones que la sección HERO de design/Main.dc.html y su <style>. No inventes ni "mejores" nada.
- Los trazos de circuito, las almohadillas circulares y los pulsos se copian del diseño a circuit-paths.ts.
- El titular, el subtítulo y los dos botones ("Configurar mi solución" que enlaza a /configurar y "Ver cómo funciona" que enlaza a #como) deben verse siempre, sin depender de animación.
- Navbar: logotipo, enlaces (Cómo funciona, Propuestas, Soluciones, Precios, Contacto) y botón "Configurar". En celular se ocultan los enlaces, tal como el diseño.
- El haz del cursor debe usar requestAnimationFrame y no re-renderizar todo el componente en cada movimiento.
- Accesibilidad: el SVG decorativo lleva aria-hidden, el nav lleva aria-label, los botones miden al menos 44px de alto.

Al terminar: lint, build, y compara el resultado con design/screenshots/hero.png si existe. Dime qué diferencias ves entre tu resultado y el diseño. Commit: "feat: hero with animated circuit".
```

#### 2b. Resto de las secciones (en tres lotes)

**Prompt 2b.1: Cómo funciona, Propuesta en vivo y Soluciones**
```text
Lee CLAUDE.md. Vamos a portar tres secciones de design/Main.dc.html. Lee solo sus secciones (<!-- CÓMO FUNCIONA -->, <!-- PROPUESTA EN VIVO -->, <!-- SOLUCIONES -->) y el <style>. Una sección a la vez: lee, crea el componente, pasa a la siguiente.

Si existen las capturas design/screenshots/como-funciona.png, propuesta-en-vivo.png y soluciones.png, mira la que corresponda antes de construir cada sección y compara tu resultado con ella al terminar; dime las diferencias que veas.

Primero crea un componente reutilizable Reveal (usa Motion) que haga aparecer su contenido al entrar en pantalla con un desplazamiento corto hacia arriba y fundido. Regla obligatoria: el contenido debe estar visible por defecto (opacidad 1 sin JavaScript), y la animación solo mejora; respeta prefers-reduced-motion.

1. CÓMO FUNCIONA (id="como"): título, párrafo, tres pasos con cuadro numerado, y una línea horizontal con una señal de luz que viaja (se oculta en celular, donde los pasos pasan a una columna).
2. PROPUESTA EN VIVO (id="propuesta"): la demo interactiva "Clínica Vitalia". Tarjeta de resumen con inversión estimada, tiempo, número de módulos, barra de alcance y fases, más 8 tarjetas de módulos (4 incluidos fijos y 4 opcionales con interruptor). Copia la lógica del script del diseño: horas por módulo, tarifa de ejemplo de 600 MXN/h, rango ±15% redondeado al millar, semanas = horas / 30. El estado es local del componente. Los interruptores usan aria-pressed y aria-label ("Quitar X" / "Agregar X"). El botón final dice "Crear mi propia propuesta" y enlaza a /configurar.
3. SOLUCIONES (id="soluciones"): lista de 6 filas en dos columnas con flecha que se desplaza al pasar el cursor. Todas enlazan a /configurar.

Usa la tarifa y las horas desde un archivo de datos, no escritas dentro del JSX. Al terminar: lint, build y commit "feat: how it works, live proposal demo and solutions sections".
```

**Prompt 2b.2: Industrias, Demos, Proceso y Por qué**
```text
Lee CLAUDE.md. Continuamos con design/Main.dc.html. Lee solo las secciones <!-- INDUSTRIAS -->, <!-- DEMOS -->, <!-- PROCESO -->, <!-- POR QUÉ --> y el <style>. Una a la vez. Usa el componente Reveal que ya existe. Si existen design/screenshots/industrias.png, demos.png, proceso.png y por-que.png, mira la que corresponda antes de cada sección y compara tu resultado al terminar; dime las diferencias.

1. INDUSTRIAS (id="industrias"): cuadrícula de 8 celdas (4 columnas en escritorio, 2 en tablet/celular) separadas por líneas de 1px, cada una con ícono de línea SVG, nombre y descripción corta. El fondo de cada celda cambia sutilmente al pasar el cursor y el ícono recibe un resplandor. Enlazan a /configurar. Guarda los datos (nombre, descripción, ícono) en un arreglo, no repetidos en el JSX.
2. DEMOS (id="demos"): tres miniaturas de interfaz construidas con divs (agenda, tienda, tablero) con su título y descripción. Al pasar el cursor, la miniatura sube 3px y su borde se aclara. En celular pasan a una columna.
3. PROCESO (id="proceso"): dos columnas en escritorio (título a la izquierda, línea de tiempo a la derecha). Cinco etapas con cuadro numerado, descripción y una línea "Recibes: ...". Una línea vertical con una señal de luz que la recorre. La etapa 5 va resaltada en blanco.
4. POR QUÉ: tres bloques con borde superior blanco al 30%: "Hablas con quien construye", "El código es tuyo", "Costos claros desde el inicio".

Al terminar: lint, build y commit "feat: industries, demos, process and why sections".
```

**Prompt 2b.3: Precios, FAQ, CTA final y footer**
```text
Lee CLAUDE.md. Últimas secciones de design/Main.dc.html. Lee solo <!-- PRECIOS -->, <!-- FAQ -->, <!-- CTA FINAL --> y el footer, más el <style>. Una a la vez. Si existen design/screenshots/precios.png, faq.png y cta-final.png, mira la que corresponda antes de cada sección y compara tu resultado al terminar; dime las diferencias.

1. PRECIOS (id="precios"): tres tarjetas (Herramienta puntual, Sistema a la medida, Plataforma completa). La del centro va destacada con la etiqueta "El más solicitado" y mayor brillo. Cada una con descripción, "Desde [TU PRECIO]" leído de src/config/site.ts, rango de semanas, tres puntos con palomita y botón "Calcular mi caso" que enlaza a /configurar. En celular pasan a una columna.
2. FAQ (id="faq"): acordeón accesible con las 6 preguntas y respuestas del diseño. Solo una abierta a la vez, la primera abierta por defecto. Cada pregunta es un <button> dentro de un <h3> con aria-expanded y aria-controls; el ícono "+" rota 45° al abrir. Navegable con teclado.
3. CTA FINAL (id="contacto"): isotipo, titular, párrafo, botón "Configurar mi solución" y botón "Escribir por WhatsApp" que abre wa.me con el número de src/config/site.ts y un mensaje prellenado.
4. Footer: logotipo, correo y WhatsApp desde site.ts, enlace a /privacidad, y "© 2026 Solvyn Solutions".

Al terminar: lint, build y commit "feat: pricing, faq, final CTA and footer".
```

#### 2c. Cierre de la landing

**Prompt 2c: SEO y revisión**
```text
Lee CLAUDE.md. Cierre de la Fase 2 (landing).

0. Comparación visual: con el servidor local corriendo, compara cada sección de la landing con su captura en design/screenshots/ (hero.png, como-funciona.png, propuesta-en-vivo.png, soluciones.png, industrias.png, demos.png, proceso.png, por-que.png, precios.png, faq.png, cta-final.png, las que existan). Lista las diferencias de espaciado, tamaño, color o animación y corrige las que sean claras.

1. SEO: metadata completa (título, descripción, canonical, Open Graph y Twitter Card con imagen social de 1200x630 generada a partir del logotipo sobre fondo negro), sitemap.xml, robots.txt y datos estructurados JSON-LD de tipo Organization.
2. Responsive: revisa la landing completa a 375px, 768px y 1440px de ancho. Corrige desbordes horizontales, textos cortados o botones menores de 44px de alto.
3. Accesibilidad: un solo h1, jerarquía de encabezados correcta, enlaces con texto claro, contraste suficiente, enlace "Saltar al contenido" al inicio, y comprobación manual de que todo se puede usar con teclado.
4. Animaciones: confirma que con prefers-reduced-motion todo se ve y funciona sin movimiento.
5. Rendimiento: corre Lighthouse si puedes y corrige lo sencillo (imágenes con next/image, fuentes, tamaños).
6. Crea la ruta /configurar con una página provisional que diga "Próximamente" para que los enlaces no den error.

Al terminar: lint, build y commit "chore: seo, a11y and responsive pass". Resume lo que corregiste.
```

**Listo cuando:** la landing se parece al diseño en computadora y celular, y todos los botones llevan a algún lugar.

---

### Fase 3. Configurador (sin IA todavía)
**Modelo:** Sonnet · **Resultado:** el flujo completo funcionando con plantillas y reglas.

#### 3a. Motor de cálculo y catálogo

**Prompt 3a**
```text
Lee CLAUDE.md, la sección "Lógica del configurador", y la función catalog() y la función buildMods() de design/Configurador.dc.html (léelas por búsqueda, no completas). Todavía NO hagas interfaz.

1. src/config/catalog.ts: pasa el catálogo (metas, industrias, integraciones, extras) del diseño a datos tipados en TypeScript. No cambies horas, nombres ni descripciones. Exporta tipos claros (Goal, Module, Integration, Extra).
2. src/config/pricing.ts: tarifa por hora (600), multiplicadores por tamaño de equipo, y los umbrales de complejidad.
3. src/lib/modules.ts: función que, dadas las respuestas del cliente (metas, usuarios, tamaño, plataforma, integraciones, módulos activados o desactivados), devuelva la lista de módulos igual que buildMods() del diseño: módulos de las metas elegidas, panel administrativo, usuarios y permisos cuando corresponda, versión móvil si pidió ambas plataformas y no eligió la meta de app, diseño de interfaz, puesta en marcha, integraciones (sin duplicar pagos si ya eligió vender) y extras sugeridos (apagados por defecto).
4. src/lib/pricing.ts: funciones puras para horas totales, rango de inversión, semanas mínimas y máximas, complejidad y fases, con las reglas exactas de CLAUDE.md. Formato de moneda MXN con Intl.NumberFormat("es-MX").
5. Pruebas unitarias con Vitest (puedes instalarlo) que cubran al menos: una sola meta con equipo pequeño, tres metas con integraciones y equipo grande, y el caso de meta de app con plataforma "both" (que no duplica el módulo móvil). Deben pasar.

Al terminar: lint, build, tests y commit "feat: catalog and pricing engine".
```

#### 3b. Pasos 1 a 4 y panel en vivo

**Prompt 3b.1: Plan**
```text
Lee CLAUDE.md. Vamos a construir /configurar. Lee solo estas secciones de design/Configurador.dc.html: HEADER, PASOS 1–4, PANEL EN VIVO y NAVEGACIÓN, y el <style>. Si existen, mira también design/screenshots/cfg-paso1-objetivo.png, cfg-paso2-industria.png, cfg-paso3-detalles.png y cfg-paso4-contacto.png. Todavía NO escribas código.

Dame un plan con: estructura de archivos y componentes (encabezado con progreso, cada paso, panel en vivo, botonera), cómo manejarás el estado del flujo (propón un store con Zustand o React Context y por qué), cómo lo guardarás en localStorage para retomar si el visitante recarga, cómo calcularás lo que muestra el panel en vivo reutilizando src/lib, y cómo se comportará el diseño en celular (el panel pasa debajo del contenido). Lista tus dudas. Espera mi aprobación.
```

**Prompt 3b.2: Implementación**
```text
Aprobado. Implementa el plan de /configurar, fiel al diseño. Contenido de cada paso:

Encabezado: logotipo (enlaza a /), barra de progreso de 4 etiquetas (Objetivo, Industria, Detalles, Contacto) con línea de avance, y botón "Salir". La barra avanza según el paso y si el paso actual ya es válido.

Paso 1, "¿Qué quieres lograr?": 8 opciones en tarjetas (casillas), máximo 3 seleccionadas (si elige una cuarta, se desmarca la más antigua). Si elige "Otra cosa" aparece un textarea obligatorio (mínimo 4 caracteres) para describir la idea.

Paso 2, "¿De qué es tu negocio?": 8 industrias en tarjetas de selección única más un campo de nombre del negocio (opcional) con autocompletado "organization".

Paso 3, "Unos detalles más": quiénes lo usarán (multi, píldoras), cuántas personas (selector segmentado 1–10, 11–50, 51–200, 200+), dónde se usará (segmentado: computadora y navegador o también app móvil), con qué debe conectarse (multi, opcional), para cuándo (3 opciones) y presupuesto aproximado (5 opciones). Es válido cuando hay al menos un tipo de usuario, un tamaño y un presupuesto.

Paso 4, "¿A dónde te envío tu propuesta?": nombre, WhatsApp (solo números, espacios y +), correo con validación (mensaje de error en #FCA5A5 cuando es inválido y ya escribió algo) y casilla de aviso de privacidad. Botón "Generar mi propuesta". Aclaración: "Tus datos no se comparten con terceros ni se usan para generar la propuesta."

Panel en vivo (columna derecha de 400px, debajo en celular): nombre del negocio, indicador "En vivo" con punto verde parpadeante, inversión estimada, semanas y complejidad, lista de módulos con punto verde para los esenciales y horas por módulo, y aviso "Estimado preliminar. Se confirma en la reunión inicial." Cuando no hay metas, un estado vacío con ícono de chip. Los módulos nuevos aparecen con una animación corta desde la izquierda.

Botonera: "Atrás" (oculto en el paso 1, donde dice "Toma unos 3 minutos") y "Continuar" (deshabilitado con opacidad 0.35 hasta que el paso sea válido).

Requisitos: cada opción es un <button> con aria-pressed; todos los campos tienen <label>; el panel lleva aria-live="polite"; cada cambio de paso mueve el foco al título del paso. El store valida y persiste en localStorage con una versión del esquema para poder invalidarlo en el futuro. Al pulsar "Generar mi propuesta" navega a una pantalla provisional por ahora.

Antes de cerrar, compara cada paso con su captura en design/screenshots/ (cfg-paso1-objetivo.png a cfg-paso4-contacto.png, las que existan) y dime las diferencias que veas.

Al terminar: lint, build y commit "feat: configurator steps and live panel".
```

#### 3c. Generación y propuesta final

**Prompt 3c.1: Plan**
```text
Lee CLAUDE.md. Siguiente: la pantalla de generación y la propuesta final. Lee solo GENERANDO y PROPUESTA FINAL de design/Configurador.dc.html y las partes de renderVals() que arman: título del proyecto, resumen, arquitectura, plantillas de vista previa, fases y tecnologías. Si existen, mira también design/screenshots/cfg-generando.png, cfg-propuesta-resumen.png, cfg-propuesta-arquitectura.png, cfg-propuesta-preview-escritorio.png, cfg-propuesta-preview-movil.png y cfg-propuesta-fases.png. Todavía NO escribas código.

Dame un plan con: componentes (resumen, indicadores, módulos, arquitectura, vista previa, fases, tecnologías, cierre), dónde vivirán las plantillas de texto por tipo de solución (propón src/lib/templates.ts), cómo estructurarás los datos de la propuesta para que en la Fase 4 la IA pueda reemplazar solo los textos (título, resumen, notas de arquitectura, justificaciones de tecnología) sin tocar precios ni módulos, y cómo hacer la vista previa de escritorio y móvil. Espera mi aprobación.
```

**Prompt 3c.2: Implementación**
```text
Aprobado. Implementa la generación y la propuesta final, fieles al diseño. Una subsección a la vez, con commit por cada una.

Pantalla de generación: tarjetas en esqueleto con brillo (shimmer), un indicador giratorio y cuatro mensajes que se van marcando con palomita verde cada ~950 ms ("Analizando tus respuestas", "Definiendo módulos y alcance", "Diseñando la arquitectura", "Preparando la vista previa"). La duración debe poder cambiarse a la del proceso real en la Fase 4.

Propuesta final:
1. Encabezado: "Propuesta preliminar para {negocio}, {fecha}", título del proyecto según la meta principal (plataforma de ventas, sistema de citas, tablero de inteligencia, sistema de gestión), resumen redactado con las respuestas, y botones "Compartir enlace" y "Descargar PDF" (por ahora muestran un aviso temporal).
2. Cuatro indicadores: inversión estimada (MXN, antes de IVA), tiempo, módulos (X de Y) con horas totales, y complejidad con tres barras.
3. Módulos: cuadrícula de tres columnas; los esenciales dicen "Incluido" y los opcionales tienen interruptor (aria-pressed) que recalcula todo al instante.
4. Arquitectura: cuatro columnas (Quién lo usa, Lo que ven, Lógica, Información) con flechas animadas entre ellas; nodos que se pueden tocar y muestran título, explicación en palabras simples y tecnología; fila de servicios externos según las integraciones; el nodo de app móvil y el de IA aparecen solo cuando corresponden.
5. Vista previa: selector de 4 colores de marca y de dispositivo (Escritorio o Móvil). Marco de laptop (barra con URL derivada del nombre del negocio, barra lateral, estadísticas y lista) y marco de celular. Cuatro plantillas según la meta principal (ventas, agenda, tablero, operación) con los textos y datos de ejemplo del diseño. Esta es la única parte del sitio con color de marca.
6. Fases y entregables con barras proporcionales (10%, 20%, 55%, 15%) y lista de tecnologías según lo elegido (React Native solo si hay móvil, modelos de IA solo con la meta de IA, etc.).
7. Cierre: "¿Te late la propuesta?" con "Aceptar y agendar reunión" y "Editar respuestas".

Requisitos: todos los números salen de src/lib/pricing.ts; la vista previa usa solo estilos propios (no dependas de clases globales de modo oscuro); accesibilidad con aria-pressed y etiquetas en los controles. Al terminar cada subsección, compara el resultado con su captura en design/screenshots/ (las que existan) y dime las diferencias. Después: lint, build y commit.
```

#### 3d. Agenda y confirmación

**Prompt 3d**
```text
Lee CLAUDE.md y las secciones AGENDAR y CONFIRMACIÓN de design/Configurador.dc.html. Si existen design/screenshots/cfg-agendar.png y cfg-confirmacion.png, míralas y compara tu resultado con ellas al terminar.

Construye las dos pantallas:
- Agendar: "Elige un horario", videollamada de 30 minutos, hora del centro de México. Cinco tarjetas con los siguientes cinco días hábiles (sin sábados ni domingos), cada una con día de la semana abreviado, número y mes. Cinco horarios: 10:00, 11:30, 13:00, 16:00 y 17:30. Botón "Confirmar reunión" deshabilitado hasta elegir día y hora. Enlace "Volver a la propuesta".
- Confirmación: ícono de palomita sobre cuadro verde con resplandor, "Listo, {nombre}. Nos vemos pronto.", fecha y hora elegidas en texto largo ("martes 21 de octubre a las 10:00"), el correo al que se envía, y tres pasos de "Lo que sigue". Botón "Volver al inicio".

Por ahora los horarios son simulados y no se guarda nada; déjalo claramente marcado con comentarios TODO para la Fase 5. Al terminar: lint, build y commit "feat: scheduling and confirmation screens".
```

**Listo cuando:** puedes recorrer todo el flujo, desde elegir una meta hasta la pantalla de reunión confirmada, con los precios calculados correctamente y funcionando en celular.

---

### Fase 4. IA y propuestas guardadas
**Modelo:** Opus para 4.2 y 4.3; Sonnet para 4.1 y 4.4. · **Resultado:** propuestas con Gemini, respaldo automático y enlaces compartibles.

**Antes de empezar:**
1. Crea el proyecto en supabase.com y copia la URL y las claves.
2. Consigue tu clave de Gemini en Google AI Studio (y, si quieres respaldo, una de OpenRouter).
3. Crea `.env.local` en la raíz (nunca se sube a Git) y también agrega las variables en Vercel:
```text
GEMINI_API_KEY=
GEMINI_MODEL=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Los nombres de modelo cambian con frecuencia: toma los vigentes de AI Studio y de OpenRouter (elige uno gratuito). Revisa también los términos del nivel gratuito (uso comercial y uso de datos).

**Prompt 4.1: Supabase y base de datos (Sonnet)**
```text
Lee CLAUDE.md, secciones "IA" y "Datos y privacidad". Prepara la base de datos. No toques la interfaz.

1. Instala @supabase/supabase-js y @supabase/ssr. Crea src/lib/supabase/server.ts (cliente de servidor con la clave de servicio, solo para rutas de servidor) y src/lib/supabase/client.ts (cliente de navegador con la clave anónima).
2. Crea supabase/migrations/001_proposals.sql con:
   - Tabla proposals: id uuid, slug text único (largo, no adivinable), payload jsonb (respuestas anonimizadas, módulos elegidos, textos generados, totales), source text ('ai' o 'rules'), created_at.
   - Tabla generation_log: id, ip_hash text, email_hash text nullable, provider text, ok boolean, created_at.
   - RLS activado en ambas tablas, sin políticas de lectura pública. Todo acceso será desde rutas de servidor con la clave de servicio.
   - Índices para consultar generation_log por ip_hash y por email_hash en las últimas 24 horas.
3. Explícame cómo ejecutar la migración (yo la pegaré en el SQL Editor de Supabase).
4. Verifica que ninguna clave secreta tenga el prefijo NEXT_PUBLIC_ y que .env.local esté ignorado por Git.

Al terminar: lint, build y commit "feat: supabase setup and proposal tables".
```

**Prompt 4.2: Capa de IA, Plan (Opus)**
```text
Lee CLAUDE.md, sección "IA". Vamos a diseñar la capa de IA. Todavía NO escribas código.

Requisitos que debe cumplir el diseño:
- Una sola función pública, generateProposalDraft(input), en src/lib/ai/. Ningún otro archivo llama a un proveedor.
- Vercel AI SDK. Cadena de proveedores: Gemini (modelo desde GEMINI_MODEL), luego OpenRouter (modelo desde OPENROUTER_MODEL), luego una propuesta generada solo con reglas y plantillas. Si un proveedor falla, se agota el tiempo (máximo 20 segundos) o devuelve algo inválido, se pasa al siguiente. El visitante nunca debe ver un error.
- Entrada anonimizada: solo descripción del proyecto, giro, metas, tamaño, plataforma, integraciones y módulos del catálogo. Nunca nombre, correo, teléfono ni el nombre del negocio.
- Salida validada con Zod: título, resumen en lenguaje de negocio (máx. 90 palabras), ids de módulos adicionales sugeridos (SOLO ids que existan en el catálogo), notas de arquitectura por nodo en palabras simples, justificación de cada tecnología, 3 a 5 preguntas sugeridas para la reunión y 2 a 3 riesgos o supuestos. La IA no produce precios, horas ni semanas.
- Si la salida es inválida, un solo reintento con el error de validación; si falla de nuevo, siguiente proveedor.
- Instrucciones del sistema: tono profesional y cercano, español de México, sin tecnicismos innecesarios, sin prometer plazos ni precios.

Dame: estructura de archivos, esquema Zod propuesto, el texto del prompt de sistema, cómo registrarás qué proveedor respondió, cómo probarás cada rama de la cadena sin gastar cuota, y los riesgos que ves (inyección de instrucciones en la descripción del cliente, costos, latencia). Espera mi aprobación.
```

**Prompt 4.3: Ruta, límites y página compartible (Opus)**
```text
Aprobado el plan de la capa de IA. Impleméntalo y conéctalo así:

1. src/lib/ai/: toda la capa según el plan, con pruebas unitarias que simulen: éxito de Gemini, fallo de Gemini con éxito de OpenRouter, fallo de ambos (cae a reglas) y salida inválida con reintento.
2. Ruta POST /api/proposal: recibe las respuestas del configurador, separa los datos personales (que NO viajan a la IA), valida la entrada con Zod, aplica límites, genera el borrador, combina el borrador con los módulos y precios calculados por src/lib/pricing.ts, guarda la propuesta en Supabase con un slug de al menos 16 caracteres aleatorios y devuelve el slug.
3. Límites: máximo 3 generaciones por IP y 3 por correo en 24 horas (con hash, no guardes el IP ni el correo en claro en generation_log). Si se excede, devuelve la propuesta por reglas, sin llamar a la IA, en lugar de un error.
4. Página /propuesta/[slug]: lee la propuesta de Supabase desde el servidor y la muestra con los mismos componentes de la propuesta final. Metadata con robots noindex, nofollow. Si el slug no existe, 404.
5. Variables de entorno validadas al arrancar con mensajes claros si falta alguna.
6. Protección contra abuso básica: límite de tamaño del cuerpo, descripción libre de máximo 600 caracteres y limpieza de caracteres de control.

No muestres claves en logs. Al terminar: lint, build, tests y commit "feat: ai layer, proposal api and shareable page".
```

**Prompt 4.4: Conectar la interfaz (Sonnet)**
```text
Lee CLAUDE.md. Conecta el configurador con la ruta /api/proposal.

1. Al pulsar "Generar mi propuesta" en el paso 4, llama a /api/proposal mientras se muestra la pantalla de generación; los mensajes de progreso avanzan con tiempos mínimos pero esperan a la respuesta real. Si tarda más de 25 segundos, muestra un mensaje amable con botón de reintento.
2. Al recibir el slug, navega a /propuesta/[slug] (la propuesta final queda en la URL compartible).
3. "Compartir enlace" copia la URL real de la propuesta y muestra el aviso "Enlace copiado".
4. Los textos de título, resumen, notas de arquitectura y justificaciones de tecnología provienen del payload guardado; los precios y módulos, de pricing.ts.
5. Los interruptores de módulos opcionales siguen recalculando en el navegador sin volver a llamar a la IA.

Prueba tres escenarios: con IA, con la clave de Gemini borrada a propósito (debe usar el respaldo o las reglas) y sin conexión a ningún proveedor. En todos, el visitante debe llegar a una propuesta completa. Lint, build y commit "feat: connect configurator to proposal api".
```

**Listo cuando:** generas una propuesta con IA, el enlace `/propuesta/xxxx` la muestra, y si borras la clave de Gemini el flujo sigue funcionando.

---

### Fase 5. Leads, correos, reuniones y PDF
**Modelo:** Sonnet · **Resultado:** cada propuesta aceptada te llega a ti.

**Antes de empezar:** crea tu cuenta de Resend y una clave (`RESEND_API_KEY`), define `OWNER_EMAIL` con tu correo y crea tu enlace de reunión en Cal.com (`NEXT_PUBLIC_CAL_LINK`, por ejemplo `tuusuario/30min`). Mientras no verifiques tu dominio en Resend, normalmente solo podrás enviar correos a tu propio correo: está bien para las pruebas.

**Prompt 5.1: Leads**
```text
Lee CLAUDE.md, sección "Datos y privacidad". Implementa el guardado de leads.

1. supabase/migrations/002_leads.sql: tabla leads con id, nombre, correo, whatsapp, proposal_id (referencia a proposals), estado (nuevo, contactado, reunion, propuesta_enviada, cerrado, descartado; por defecto nuevo), puntaje int, etiqueta (caliente, tibio, frio), respuestas jsonb (presupuesto, urgencia, tamaño, usuarios), consentimiento_at, consentimiento_version, meeting_at nullable, notas text, created_at, updated_at. RLS activado, sin lectura pública.
2. src/lib/scoring.ts: puntaje 0 a 100. Presupuesto: más de $400,000 = 40, $150,000 a $400,000 = 30, $50,000 a $150,000 = 20, menos de $50,000 = 10, "aún no lo sé" = 5. Urgencia: lo antes posible = 25, 1 a 3 meses = 15, sin prisa = 5. Usuarios "mis clientes" +10. 8 o más módulos +10. Cada integración +5, máximo 15. Tope 100. Etiqueta: caliente desde 70, tibio de 40 a 69, frío menos de 40. Con pruebas unitarias.
3. Al llegar al paso 4 y pulsar "Generar mi propuesta", el servidor guarda el lead vinculado a la propuesta, con la fecha y la versión del aviso de privacidad aceptado (constante PRIVACY_VERSION en site.ts).
4. El lead se crea una sola vez por correo y propuesta (evita duplicados si recarga).

Al terminar: lint, build, tests y commit "feat: leads storage and scoring".
```

**Prompt 5.2: Correos**
```text
Lee CLAUDE.md. Implementa los correos con Resend (src/lib/email/), con plantillas HTML sencillas en blanco y negro acordes a la marca, compatibles con clientes de correo (estilos en línea, ancho máximo 600px, sin imágenes externas salvo el logotipo).

1. Correo al dueño (OWNER_EMAIL), al crearse el lead: asunto "Nuevo lead {etiqueta}: {nombre}", con nombre, correo, WhatsApp (con enlace wa.me), puntaje y etiqueta, metas, industria, presupuesto, urgencia, módulos principales, rango de inversión y enlace a la propuesta.
2. Correo al cliente: asunto "Tu propuesta de Solvyn Solutions", con saludo por su nombre, resumen corto, inversión estimada, tiempo, botón "Ver mi propuesta" al enlace compartible y una línea de que es preliminar.
3. Al aceptar y agendar: correo al dueño "Reunión agendada: {nombre}" con fecha y hora.
4. Si el envío falla, no rompe el flujo del visitante: se registra el error y el lead queda guardado igualmente.
5. Remitente configurable por variable de entorno (EMAIL_FROM).

Al terminar: lint, build y commit "feat: transactional emails".
```

**Prompt 5.3: Reuniones y WhatsApp**
```text
Lee CLAUDE.md y la sección AGENDAR de design/Configurador.dc.html.

1. Reemplaza los horarios simulados por Cal.com. Primero propón brevemente si usar @calcom/embed-react o la API (recomiendo empezar con el embed por simplicidad) y usa el enlace de NEXT_PUBLIC_CAL_LINK. Mantén el estilo oscuro de la pantalla; configura el embed en modo oscuro y con el nombre y correo del cliente ya precargados.
2. Al pulsar "Aceptar y agendar reunión" en la propuesta: marca el lead como "aceptado" (estado reunion pendiente), muestra el calendario y, al confirmarse la reserva, guarda meeting_at y muestra la pantalla CONFIRMACIÓN con la fecha real.
3. Botón secundario "Prefiero hablar por WhatsApp" que abre wa.me con un mensaje prellenado con el nombre del negocio y el enlace de la propuesta.
4. Si Cal.com no carga, muestra el WhatsApp y el correo como alternativa visible.

Al terminar: lint, build y commit "feat: calendar booking and whatsapp contact".
```

**Prompt 5.4: PDF**
```text
Lee CLAUDE.md. Implementa "Descargar PDF" con el enfoque más simple: una versión imprimible.

1. Ruta /propuesta/[slug]/imprimir con diseño claro apto para papel (fondo blanco, texto negro, logotipo en negro), con resumen, indicadores, módulos con horas, arquitectura en lista, fases, tecnologías, inversión, supuestos y el pie "Propuesta preliminar, se confirma en reunión". Metadata noindex.
2. CSS de impresión con saltos de página limpios, sin barras ni botones.
3. El botón "Descargar PDF" abre esa ruta y dispara la impresión del navegador (guardar como PDF).
4. Para que el logotipo se vea sobre blanco, genera una versión oscura a partir de design/logo/solvyn-logo.png (invertir el color a negro conservando la transparencia) y guárdala en public/brand/.

Al terminar: lint, build y commit "feat: printable proposal pdf".
```

**Listo cuando:** haces el flujo completo con un correo tuyo, te llega el aviso con el lead, el cliente recibe su correo, la reunión queda agendada y el PDF se ve bien.

---

### Fase 6. Tu panel privado
**Modelo:** Opus para 6.1 y 6.2; Sonnet para 6.3 y 6.4. · **Resultado:** `/admin` donde gestionas tus leads.

**Antes de empezar:** en Supabase activa el inicio de sesión por correo (enlace mágico) y agrega `ADMIN_EMAIL` con tu correo a `.env.local` y a Vercel.

**Prompt 6.1: Plan de seguridad (Opus)**
```text
Lee CLAUDE.md, sección "Datos y privacidad". Vamos a construir el panel privado /admin. Primero SOLO el plan de seguridad, sin código.

Requisitos: inicio de sesión con enlace mágico de Supabase Auth; solo puede entrar el correo definido en ADMIN_EMAIL (cualquier otro correo no obtiene acceso ni se entera de si existe); sesión verificada en el SERVIDOR en el middleware y también dentro de cada ruta o acción que lea o escriba datos (no confiar solo en el middleware); RLS para que únicamente el usuario administrador lea o modifique leads, propuestas y ajustes; ninguna clave de servicio en el navegador; protección contra CSRF en acciones que modifican datos; cierre de sesión.

Dame: el modelo de permisos, las políticas RLS exactas que propones, el flujo de login, cómo comprobarás que un correo distinto al mío no puede leer nada (pruebas concretas), y los riesgos que ves. Espera mi aprobación.
```

**Prompt 6.2: Autenticación (Opus)**
```text
Aprobado. Implementa lo planeado: página /admin/login, callback del enlace mágico, middleware, verificación en servidor en cada acceso a datos, cierre de sesión y las políticas RLS en supabase/migrations/003_admin_rls.sql.

Pruebas obligatorias (documéntalas y ejecútalas donde sea posible):
- Sin sesión, /admin y cualquier ruta de datos redirigen al login o devuelven 401.
- Con sesión de un correo distinto a ADMIN_EMAIL, se rechaza el acceso.
- Con mi correo, se accede.
- Las tablas no son legibles con la clave anónima.

Todas las páginas /admin llevan noindex y no aparecen en sitemap.xml. Al terminar: lint, build y commit "feat: admin authentication and rls".
```

**Prompt 6.3: Pantallas de leads (Sonnet)**
```text
Lee CLAUDE.md y mantén el mismo sistema visual (negro, grises, señal verde solo para estados activos). Construye las pantallas del panel:

1. /admin: resumen con total de leads, leads nuevos de la semana, reuniones próximas y conteo por etiqueta (caliente, tibio, frío).
2. /admin/leads: tabla con nombre, negocio, etiqueta con color (caliente en blanco brillante, tibio en gris claro, frío en gris apagado), puntaje, estado, inversión estimada y fecha. Filtros por estado y etiqueta, búsqueda por nombre o correo, orden por fecha o puntaje, paginación.
3. /admin/leads/[id]: detalle con datos de contacto (botones de WhatsApp y correo), todas las respuestas del configurador, enlace a la propuesta, reunión agendada, selector para cambiar el estado (nuevo, contactado, reunión, propuesta enviada, cerrado, descartado), y notas editables con guardado.
4. Responsive: en celular la tabla pasa a tarjetas.

Todas las lecturas y escrituras verifican la sesión en el servidor. Al terminar: lint, build y commit "feat: admin leads screens".
```

**Prompt 6.4: Ajustes y disponibilidad (Sonnet)**
```text
Lee CLAUDE.md. Agrega /admin/ajustes y conéctalo con el resto del sitio.

1. Tabla settings en supabase/migrations/004_settings.sql (una fila): tarifa por hora, próxima fecha de inicio disponible, mensaje de disponibilidad, WhatsApp y correo públicos. RLS: lectura pública solo de los campos públicos (disponibilidad y contacto), escritura solo del administrador. Si prefieres una vista, propónla.
2. Formulario en /admin/ajustes para editarlos, con validación.
3. src/config/pricing.ts y src/config/site.ts pasan a leer estos valores desde la base de datos (con caché y valores de respaldo si falla la lectura). El configurador y las propuestas usan la tarifa vigente; las propuestas ya guardadas conservan la tarifa con la que se generaron.
4. En la landing, agrega bajo el hero (o en la sección de precios, donde mejor encaje con el diseño) una línea discreta: "Próximo inicio disponible: {fecha}".

Al terminar: lint, build y commit "feat: admin settings and availability".
```

**Listo cuando:** un correo distinto al tuyo no puede entrar ni leer datos, y desde el panel ves y actualizas un lead, y cambiar la tarifa modifica los cálculos del sitio.

---

### Fase 7. Lanzamiento
**Modelo:** Haiku · **Resultado:** sitio en tu dominio, con avisos legales y analítica.

**Pasos manuales primero:** en Vercel agrega tu dominio, copia todas las variables de entorno a producción y cambia `NEXT_PUBLIC_SITE_URL` por tu dominio. Verifica tu dominio en Resend y cambia `EMAIL_FROM`.

**Prompt 7.1: Textos legales**
```text
Lee CLAUDE.md. Crea las páginas /privacidad y /terminos con borradores en español de México, adaptados a la legislación mexicana de protección de datos personales (LFPDPPP).

Aviso de privacidad: identidad y contacto del responsable (toma los datos de src/config/site.ts), qué datos se recaban (nombre, correo, WhatsApp, respuestas del configurador), finalidades (generar y enviar la propuesta, contactar sobre ella, agendar reunión, mejora del servicio), que los datos no se envían a proveedores de IA, con quién se comparten (proveedores de infraestructura, correo y calendario) y para qué, derechos ARCO y cómo ejercerlos, plazo de conservación, uso de analítica y cookies, y fecha y versión (usa PRIVACY_VERSION).

Términos: la propuesta es preliminar y no es una oferta vinculante, los precios y tiempos se confirman en la reunión, propiedad del código al finalizar el pago, limitación de responsabilidad básica y contacto.

Estilo visual igual al sitio, lectura cómoda (ancho máximo de 720px). Añade al inicio de ambas páginas un comentario TODO visible solo en el código: "Revisar con abogado antes de publicar". Al terminar: lint, build y commit "feat: legal pages".
```

**Prompt 7.2: Analítica del embudo**
```text
Lee CLAUDE.md. Agrega analítica de embudo sin datos personales.

1. src/lib/analytics.ts con una función track(evento, propiedades) que sea el único punto de envío (para poder cambiar de proveedor después). Impleméntala con Vercel Web Analytics o, si no es posible, con una alternativa gratuita respetuosa de la privacidad; propón cuál antes de instalar.
2. Eventos: configurator_started, step_completed (con el número de paso), proposal_generated (con el origen: ai o rules), module_toggled, proposal_shared, pdf_downloaded, meeting_booked, whatsapp_clicked. Nunca incluyas nombre, correo, teléfono ni texto libre.
3. Si agregas cookies o identificadores, actualiza el aviso de privacidad y muestra el aviso de cookies que corresponda; si no usas cookies, déjalo sin banner.

Al terminar: lint, build y commit "feat: funnel analytics".
```

**Prompt 7.3: Revisión final**
```text
Lee CLAUDE.md. Haz la revisión final antes del lanzamiento y entrégame un reporte.

1. Busca en todo el código y en el contenido los placeholders "[TU CORREO]", "[TU WHATSAPP]" y "[TU PRECIO]" y dime dónde quedan.
2. Verifica que ninguna clave o secreto esté en el repositorio (incluido el historial reciente) y que solo las variables NEXT_PUBLIC_ lleguen al navegador.
3. Confirma que RLS está activo en todas las tablas con datos personales.
4. Verifica sitemap.xml y robots.txt: /admin, /propuesta/* y /propuesta/*/imprimir fuera del índice.
5. Corre lint, build y pruebas. Corre Lighthouse en la landing y el configurador y resume puntuaciones y pendientes.
6. Prueba mental del flujo completo y lista cualquier paso que pueda fallar en producción (variables faltantes, dominios de correo, cuotas).
7. Actualiza la sección "Estado del proyecto" de CLAUDE.md a "Lanzado".

No corrijas nada sin avisarme: primero el reporte.
```

**Pasos manuales al final:** revisión legal con un abogado, alta en Google Search Console con el sitemap, y una prueba completa en producción desde tu celular con un correo real.

---

### Prompt de corrección (úsalo en cualquier fase)
```text
Compara lo que acabas de construir con el diseño. La parte que quiero corregir es: [describe qué ves mal, por ejemplo "el brillo del chip del hero es menos intenso que en el diseño"].

Lee solo la sección correspondiente de design/Main.dc.html o design/Configurador.dc.html (y design/screenshots/ si hay captura). Identifica la diferencia exacta de valores (color, tamaño, espacio, duración, curva de animación) y corrígela sin tocar nada más. Dime qué valor tenía el diseño, qué tenías tú y qué cambiaste.
```

### Prompt de arranque para sesiones nuevas (úsalo cuando retomes el proyecto otro día)
```text
Lee CLAUDE.md y dime en dos líneas en qué fase estamos y qué falta. Mira `git log -10` para ver lo último que se hizo. No cambies nada todavía.
```

---

## Parte D. Ahorro de tokens y solución de problemas

- Una fase por sesión y `/clear` entre fases.
- Plan antes de código en tareas grandes. Claude Code tiene un modo de planificación: confirma en la documentación cómo activarlo.
- Tareas pequeñas y concretas, con la ruta del archivo en lugar de pegar su contenido.
- Si Claude se atora o repite el mismo error dos veces: `/clear`, vuelve a pedir la tarea con el mensaje de error exacto y, solo entonces, sube de modelo.
- Revisa `git diff` antes de cada commit para ver qué cambió.
- Consulta el comando de uso de Claude Code (por ejemplo `/cost`) para ver cuánto llevas gastado; confirma su nombre vigente en la documentación.
- Mantén `CLAUDE.md` corto. Lo que ya está ahí no se repite en los mensajes.
- Si algo se rompe, `git log` y `git restore` / `git revert` te permiten volver atrás: por eso se hace un commit por tarea.

## Parte E. Lista antes de lanzar

- [ ] Ningún placeholder (`[TU CORREO]`, `[TU WHATSAPP]`, `[TU PRECIO]`) en el sitio.
- [ ] `.env.local` no está en Git y las claves están solo en Vercel.
- [ ] RLS activo en todas las tablas con datos personales.
- [ ] Aviso de privacidad y términos revisados por un abogado.
- [ ] Prueba completa del flujo en producción, en celular y computadora.
- [ ] La landing funciona con animaciones desactivadas (`prefers-reduced-motion`).
- [ ] Límites de generación de IA activos; la propuesta de reglas funciona sin IA.
- [ ] Correos de prueba llegan a la bandeja de entrada, no a spam.
- [ ] Analítica registrando el embudo y sitemap enviado a Google.
