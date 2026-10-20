# Diseño aprobado de Solvyn Solutions

Esta carpeta es la **referencia visual y funcional definitiva**. Fue diseñada y aprobada antes de empezar a programar.

## Archivos

| Archivo | Qué es |
|---|---|
| `Main.dc.html` | Landing completa |
| `Configurador.dc.html` | Flujo del configurador completo y su lógica |
| `logo/solvyn-logo.png` | Logotipo completo (blanco sobre transparente, 1100 px de ancho) |
| `logo/solvyn-iso.png` | Isotipo hexagonal |
| `logo/solvyn-logo-original.png` | Logotipo en alta resolución (2172 × 724) |
| `screenshots/` | Capturas de referencia con nombres fijos (ver `GUIA-DESARROLLO.md`, paso B3). Se miran antes de portar cada sección y se comparan al terminar |

## Cómo leer los archivos `.dc.html`

Son prototipos escritos en un formato propio. Tienen tres partes:

1. **`<helmet>`**: fuentes y CSS (animaciones, hover, puntos de corte responsive). Aquí están los valores exactos de movimiento.
2. **`<x-dc>`**: el marcado. Los estilos van en línea (`style="..."`) con los valores finales de color, tamaño y espacio. Etiquetas propias:
   - `<sc-for list="{{x}}" as="i">`: repetir elementos (equivale a `.map()`).
   - `<sc-if value="{{x}}">`: mostrar condicionalmente (equivale a `{x && ...}`).
   - `{{nombre}}`: valor que viene del script.
   - `onClick="{{fn}}"`: manejador de evento.
3. **`<script type="text/x-dc">`** al final: la lógica. La clase `Component` guarda el estado en `this.state` y `renderVals()` devuelve todo lo que el marcado consume. Aquí viven el cálculo de precios, el catálogo de módulos, las plantillas de la vista previa por tipo de solución y las reglas del flujo.

El atributo `data-props` define los ajustes que el diseñador puede mover: `signal` (Verde o Blanco), `circuitOpacity`, `pulses` y `rate` (tarifa por hora). **En producción: la señal es siempre verde, y la tarifa vive en `src/config/pricing.ts`.**

## Mapa de secciones

**`Main.dc.html`** (busca los comentarios `<!-- ... -->`):
`HERO` · `CÓMO FUNCIONA` · `PROPUESTA EN VIVO` · `SOLUCIONES` · `INDUSTRIAS` · `DEMOS` · `PROCESO` · `POR QUÉ` · `PRECIOS` · `FAQ` · `CTA FINAL` · footer.

**`Configurador.dc.html`**:
`HEADER` con barra de progreso · `PASOS 1–4` (objetivo, industria, detalles, contacto) con el `PANEL EN VIVO` · `GENERANDO` · `PROPUESTA FINAL` (resumen, indicadores, módulos, arquitectura, vista previa de escritorio y móvil, fases, tecnologías, cierre) · `AGENDAR` · `CONFIRMACIÓN`.

## Detalles que no se deben perder

- **Circuito del hero**: las rutas SVG están en el marcado del `HERO` (grupos de `<path class="trace">`, el grupo duplicado para el haz del cursor y los `<path class="pulse">`). Cópialas tal cual a un archivo de datos.
- **Haz del cursor**: segunda copia de los trazos, más brillante, visible solo dentro de una máscara radial que sigue al mouse.
- **Entrada del hero**: los trazos se dibujan con `stroke-dashoffset`, pero el contenido es visible desde el inicio.
- **Revelado al scroll**: `animation-timeline: view()` con contenido visible por defecto cuando el navegador no lo soporta.
- **Panel en vivo**: los módulos aparecen con una animación corta lateral; los números cambian al activar módulos.
- **Vista previa del cliente**: cuatro plantillas (ventas, agenda, tablero, operación) que cambian según la meta principal, con el nombre del negocio y el color elegidos.
- **Accesibilidad ya resuelta en el diseño**: `aria-pressed` en interruptores y opciones, `label` en campos, `aria-live` en el panel en vivo, objetivos táctiles de 44 px.
