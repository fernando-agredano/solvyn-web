# Solvyn Solutions: landing + configurador de soluciones

## Qué es este proyecto
Sitio web de **Solvyn Solutions**, un estudio de software independiente (una sola persona) en México. Tiene dos partes:

1. **Landing informativa** en `/`.
2. **Configurador de soluciones** en `/configurar`: el visitante elige qué quiere lograr, responde preguntas, ve su propuesta armarse en vivo y recibe una propuesta con módulos, arquitectura, vista previa, fases e inversión. Puede aceptarla y agendar reunión. Sus datos llegan al dueño como lead.

Idioma de la interfaz: español de México. Moneda: MXN. Código, nombres de variables y mensajes de commit: inglés.

## Fuente de verdad del diseño (IMPORTANTE)
El diseño ya está **aprobado**. No lo rediseñes ni lo "mejores": reprodúcelo fielmente.

- `design/Main.dc.html`: landing completa.
- `design/Configurador.dc.html`: flujo completo del configurador (pasos 1 a 4, generación, propuesta final, agenda, confirmación) y su lógica de cálculo.
- `design/logo/`: logos oficiales.
- `design/screenshots/`: capturas de referencia (`hero.png`, `como-funciona.png`, `precios.png`, `cfg-paso1-objetivo.png`, `cfg-propuesta-arquitectura.png`, etc.). **Si existe la captura de la sección que vas a portar, mírala antes de empezar y compárala con tu resultado al terminar**, reportando diferencias. Si no existe, guíate por el código del prototipo. Las pantallas de `/admin` no tienen diseño previo: usa el mismo sistema visual.
- `design/README.md`: cómo leer estos archivos. Léelo antes de portar nada.

Reglas para usarlos:
- **Lee solo la sección que vas a portar.** Los archivos son grandes y traen comentarios `<!-- SECCIÓN -->`. No los leas completos.
- Usan sintaxis de prototipo (`<sc-for>`, `<sc-if>`, `{{ }}`, `renderVals`). Son **referencia, no código para copiar**: tradúcelos a componentes React/TSX conservando valores exactos (colores, tamaños, espacios, textos, animaciones).
- Si el archivo y tu criterio difieren, **gana el archivo**. Si algo falta, pregunta.

## Stack
Next.js (App Router) + TypeScript + Tailwind CSS (usa la versión que instaló `create-next-app`; no la cambies) + Motion para animaciones + Supabase (base de datos y autenticación) + Vercel AI SDK con Gemini + Resend (correos) + Cal.com (reuniones). Hosting en Vercel o equivalente.

## Sistema visual
Interfaz oscura, premium, en blanco y negro. Jerarquía por brillo, no por color.

**Colores**
- Fondo `#000000`. Superficies elevadas `#0A0A0A` a `#141414`.
- Texto principal `#F5F5F5`, títulos `#FFFFFF`, secundario `#A3A3A3`, etiquetas `#8A8A8A`, apagado `#737373`.
- Bordes: `rgba(255,255,255,0.08)` entre secciones, `0.12` a `0.14` en tarjetas, `0.28` a `0.40` en elementos destacados.
- **Señal verde `#46D19A`** (brillo `rgba(70,209,154,0.55)`): solo como indicador de "activo/ok". Se usa en: punto "En vivo", interruptores encendidos, 1 de cada 3 pulsos del circuito, palomitas de pasos completados y la confirmación de reunión. **Nunca** en botones, títulos ni decoración.
- Error: `#FCA5A5`, solo en validaciones.
- **La vista previa de la solución del cliente es el único lugar con color de marca**: acentos `#2563EB`, `#059669`, `#EA580C`, `#7C3AED`.

**Tipografía**: Archivo (variable, eje de ancho `wdth` 62 a 125). Títulos grandes con `font-stretch: 125%` (clase `.wide`), subtítulos con `112%` (`.semi`), texto normal. Tamaños con `clamp()` como en el diseño.

**Componentes base**
- Botón primario: fondo blanco, texto negro, radio 10px, alto mínimo 44 a 54px. Hover: elevación 1px y halo blanco.
- Botón secundario: borde `rgba(255,255,255,0.22)`, fondo transparente.
- Tarjetas: borde de 1px, degradado sutil de blanco a transparente, radio 14 a 18px.
- Objetivos táctiles de al menos 44px. Foco visible: contorno blanco de 2px.

**Movimiento**
- Hero: los trazos del circuito se dibujan al cargar; pulsos de luz recorren las líneas; un haz de luz sigue al cursor (máscara radial de 230px); el chip central lleva el isotipo.
- Secciones: aparecen al hacer scroll (desplazamiento corto y fundido).
- **Ningún contenido importante puede depender de una animación para verse.** Todo debe ser visible por defecto y la animación solo mejora.
- Respeta `prefers-reduced-motion`.
- Responsive: puntos de corte en 1000, 980, 860 y 620px, tal como el diseño.

**Logos** (los diseños referencian imágenes por id; este es el equivalente):
- `855bbb00e1cc9bc724df395f4279d17b` = `design/logo/solvyn-logo.png` (logotipo completo, blanco sobre transparente).
- `e99d7c55e8dcf339fb93f1717932072b` = `design/logo/solvyn-iso.png` (isotipo hexagonal).
- `design/logo/solvyn-logo-original.png` es la versión en alta resolución.

**Datos pendientes (placeholders)**: `[TU CORREO]`, `[TU WHATSAPP]`, `[TU PRECIO]`. Centralízalos en `src/config/site.ts`; no los repitas por el código.

## Lógica del configurador
El catálogo de metas, módulos, integraciones y extras está en la función `catalog()` de `design/Configurador.dc.html`. Pásalo a `src/config/catalog.ts` sin cambiar horas ni textos. Las reglas de cálculo, en `src/lib/pricing.ts`:

- Tarifa por defecto: **600 MXN/hora**, definida en `src/config/pricing.ts` (será editable desde el panel).
- Horas totales = suma de módulos activos × multiplicador por tamaño (1–10: 1, 11–50: 1.05, 51–200: 1.15, 200+: 1.3).
- Inversión: de `horas × tarifa × 0.85` a `horas × tarifa × 1.15`, redondeada al millar.
- Semanas: mínimo `max(2, floor(horas × 0.9 / 30))`, máximo `max(mín + 1, ceil(horas × 1.1 / 30))`.
- Complejidad: menos de 220 h baja, menos de 420 h media, de ahí en adelante alta.
- Fases: descubrimiento 10%, diseño 20%, desarrollo 55%, pruebas y lanzamiento 15%.
- **Los precios salen siempre de estas reglas, nunca de la IA.**

## IA (Fase 4)
- Toda llamada a un modelo pasa por **una sola capa intermedia** en `src/lib/ai/`. Ningún componente llama a un proveedor directo.
- Proveedor principal: Gemini (nivel gratuito). Respaldo: OpenRouter (modelo gratuito) y, si todo falla, una **propuesta generada solo con reglas**, para que el visitante nunca vea un error.
- Los nombres de modelo van en variables de entorno, no en el código.
- La IA devuelve **JSON validado con Zod**. Solo puede elegir módulos que existan en el catálogo.
- **Nunca envíes a la IA nombre, correo ni teléfono.** Solo la descripción del proyecto.
- Guarda cada propuesta generada y reutilízala; limita las generaciones por persona.

## Datos y privacidad
- Claves y secretos solo en `.env.local` y en las variables de Vercel. **Nunca en el repositorio.** `.env.local` debe estar en `.gitignore`.
- Cumplir con la LFPDPPP: aviso de privacidad visible, consentimiento registrado (fecha y versión del aviso) antes de guardar datos personales.
- Las propuestas compartibles usan identificadores largos e imposibles de adivinar y llevan `noindex`.
- Las tablas con datos de contactos usan Row Level Security; solo el dueño autenticado puede leerlas.
- Analítica del embudo: `track()` en `src/lib/analytics.ts` solo escribe en consola en desarrollo y no envía nada. Sin cookies ni identificadores, así que no hay banner. La analítica real se conectará al desplegar; al hacerlo, actualizar el aviso de privacidad y `PRIVACY_VERSION`.

## Cómo trabajar (para ahorrar tokens y evitar errores)
- Trabaja **una fase a la vez**. La fase actual está al final de este archivo.
- En tareas grandes, **primero un plan** (archivos y componentes, sin código) y espera aprobación.
- Cambios pequeños y enfocados. No refactorices ni toques archivos fuera del alcance pedido.
- No instales dependencias nuevas sin avisar y justificar.
- Antes de dar algo por terminado: `npm run lint` y `npm run build` sin errores.
- Haz un commit por tarea terminada, con mensaje breve en inglés.
- No releas archivos grandes que ya leíste en esta sesión.
- Si algo es ambiguo, pregunta en lugar de suponer.

## Comandos
- `npm run dev`: servidor local en http://localhost:3000
- `npm run build`: compilación de producción
- `npm run lint`: revisión de código

## Estado del proyecto
Fase actual: 7.1 (textos legales)

Esta línea indica el **siguiente paso pendiente** del proyecto. Se actualiza al final de cada prompt de implementación, dentro de su mismo commit. No la cambies por tu cuenta en otras circunstancias.
