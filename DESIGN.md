---
name: Kambio
description: Marketplace de segunda mano impreso como risografía a una tinta, violeta sobre papel negro, con la segunda pasada desplazada.
colors:
  paper: "#0f0e13"
  sheet: "#17151d"
  sheet-high: "#1d1a27"
  line: "#2c2838"
  ink: "#f2effa"
  ink-dim: "#cfc9e2"
  ink-faint: "#a9a3c0"
  violet: "#8b5cf6"
  violet-deep: "#5b34c9"
  violet-soft: "#c4b5fd"
  amber: "#fbbf24"
typography:
  logo:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  price:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "40px"
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.33
  body:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  slogan:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.43
    letterSpacing: "0.025em"
  stamp:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.1em"
  price-display:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tabular-nums"
  title:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  notice-title:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.4
  description:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "32px"
  stamp-large:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "52px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.1em"
  hero:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "80px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "32px"
  field-label:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  tag:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "20px"
  caption:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
  page-title:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  micro:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  day-label:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.025em"
rounded:
  focus: "4px"
  tag: "6px"
  control: "10px"
  notice: "12px"
  card: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  header-gap: "40px"
  detail-gap: "40px"
  panel-padding: "32px"
  page-x: "48px"
  auth-gap: "64px"
  upload-gap: "56px"
  form-gap: "24px"
  sales-gap: "40px"
  row-thumb: "88px"
  inbox-min: "300px"
  inbox-max: "380px"
  inbox-thumb: "56px"
  thread-thumb: "48px"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.violet-soft}"
  button-primary-large:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-secondary-hover:
    textColor: "{colors.violet-soft}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  search-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px 0 48px"
    height: "48px"
  chip:
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
  product-card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.card}"
    padding: "14px 16px 16px"
  status-available:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    rounded: "{rounded.tag}"
    padding: "2px 10px"
  status-reserved:
    textColor: "{colors.amber}"
    rounded: "{rounded.tag}"
    padding: "2px 10px"
  status-sold:
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.tag}"
    padding: "2px 10px"
  sold-stamp:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.stamp}"
    rounded: "6px"
    padding: "8px 20px"
  sold-stamp-large:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.stamp-large}"
    rounded: "6px"
    padding: "12px 32px"
  info-panel:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "32px"
  notice-panel:
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.notice}"
    padding: "20px"
  notice-panel-active:
    backgroundColor: "{colors.sheet-high}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.notice}"
    padding: "20px"
  seller-avatar:
    backgroundColor: "{colors.violet-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "56px"
  auth-card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "32px"
    width: "500px"
  auth-tab:
    textColor: "{colors.ink-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  auth-tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  text-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  form-alert:
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    rounded: "8px"
    padding: "12px 16px"
  form-alert-info:
    textColor: "{colors.ink-dim}"
    typography: "{typography.label}"
    rounded: "8px"
    padding: "12px 16px"
  textarea-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  photo-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
  photo-field-dragging:
    backgroundColor: "{colors.sheet-high}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
  form-note:
    textColor: "{colors.ink-dim}"
    typography: "{typography.label}"
    rounded: "8px"
    padding: "12px 16px"
  listing-preview:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.card}"
    padding: "14px 16px 16px"
    width: "340px"
  button-primary-compact:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  sale-row:
    textColor: "{colors.ink}"
    padding: "16px 0"
  sale-row-highlighted:
    textColor: "{colors.ink}"
    rounded: "{rounded.notice}"
    padding: "16px 12px"
  sale-thumbnail:
    backgroundColor: "{colors.sheet-high}"
    rounded: "{rounded.notice}"
    size: "88px"
  sales-empty-invite:
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.card}"
    padding: "24px"
    width: "576px"
  chat-panel:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  conversation-row:
    textColor: "{colors.ink}"
    padding: "14px 16px"
  conversation-row-active:
    backgroundColor: "{colors.sheet-high}"
    textColor: "{colors.ink}"
    padding: "14px 16px"
  conversation-thumbnail:
    backgroundColor: "{colors.sheet-high}"
    rounded: "{rounded.notice}"
    size: "56px"
  bubble-mine:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "10px 16px"
  bubble-theirs:
    backgroundColor: "{colors.sheet-high}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "10px 16px"
  composer-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  connection-strip:
    textColor: "{colors.amber}"
    padding: "8px 24px"
---

# Design System: Kambio

> Documentado desde el código entregado. Están construidas las seis pantallas previstas: listado con buscador (1), ficha del producto (2), entrar y crear cuenta (3), subir producto `/subir` (4), Mis ventas `/mis-ventas` (5) y chat `/chat` y `/chat/:productId` (6). Todo lo de abajo es lo que esas pantallas usan de verdad; lo que se añada después debe derivarse de estas reglas y registrarse aquí. La actualización del chat es por consulta periódica (polling); los WebSockets están previstos para más adelante.

## Overview

**Creative North Star: "Tinta Riso"**

Kambio se imprime como una risografía a una sola tinta: violeta sobre papel negro. No hay segunda gama de color; la profundidad sale de dos pasadas de la misma tinta, una clara y otra profunda, y de que la segunda pasada nunca está perfectamente alineada. El papel lleva un grano de ruido fino apenas perceptible, generado en SVG dentro del CSS, y sobre él, solo mientras se mueve el ratón, aparece papel pautado que se ondula alrededor del cursor. El mundo rechaza el aspecto de marketplace oscuro genérico: tarjetas grises redondeadas flotando sobre sombras suaves, tipografía neutra tipo Inter.

La densidad es de catálogo: rejilla de tarjetas de foto grande, precio como primera lectura y estado de la venta siempre visible. El carácter se concentra en el registro desplazado (logotipo, precios, y la plancha dura bajo el buscador y los botones primarios), en el sello de "Vendido" y en el halftone, que solo aparece como marca de "sin foto". Chips, paneles y texto corrido se quedan sobrios y planos.

La ficha del producto es la misma imprenta en dos columnas: foto grande y descripción a la izquierda; a la derecha un panel de información que lee de arriba abajo estado, precio de 64 px con registro, nombre, lugar, categoría, compra y vendedor. La compra ocurre dentro del panel, sin ventana modal: el botón se convierte en un bloque de confirmación con borde violeta y después en un aviso de "Compra registrada". Los avisos (propio, reservado, vendido) son bloques de borde punteado, sobrios y sin plancha.

Entrar y crear cuenta es la misma imprenta con el lema por delante: a la izquierda "Pass it, spark change." a 80 px con registro y una frase que explica por qué se pide cuenta según adónde iba la persona; a la derecha, una tarjeta de formulario de 500 px con dos pestañas en píldora que reutilizan los estados de los chips. La cabecera pierde el menú de cuenta en estas dos rutas y deja solo "← Volver al listado". El formulario valida al enviar y después en vivo, lleva el foco al primer campo inválido y, tras un login fallido, lo devuelve a la contraseña; crear cuenta entra directamente al terminar.

Subir producto es la misma imprenta convertida en mesa de trabajo: a la izquierda un formulario de hasta 720 px con el título "Subir producto" a 40 px, y a la derecha una columna fija con la prueba de impresión, es decir, la tarjeta del listado tal como quedará. La vista previa reutiliza el lenguaje del listado (halftone como marca de "sin foto", precio con registro) y es honesta: mientras no hay un precio válido muestra un "— €" liso, sin plancha, porque la doble tinta solo se imprime sobre un precio real. El formulario avisa antes de publicar de que la categoría puede cambiar el precio, y tras publicar la ficha lo confirma en un aviso informativo de borde violeta.

Mis ventas es la misma imprenta convertida en tablero de despacho: bajo el título de 40 px y una frase con datos reales ("Has vendido N artículos por X €", solo si hay ventas), tres columnas iguales, una por estado y siempre en el mismo orden: En venta, Pendiente de envío, Vendido. No son tarjetas anidadas: cada artículo es una fila separada por filetes, con miniatura, nombre, precio y una línea de datos. Lo único que pide acción es el pedido pendiente, y esa acción es final, así que se confirma en línea, dentro de la fila. Cuando un artículo cambia de columna se queda marcado con un contorno violeta hasta que el puntero o el foco lo alcanzan: el cambio permanece encendido hasta que se ha visto.

Mensajes es la misma imprenta convertida en mesa de correo: un único panel con filete de 1,5 px, esquina de 16 px y relleno Pliego, partido en dos. A la izquierda, la bandeja (300 a 380 px) con las conversaciones como filas planas separadas por filetes; a la derecha, la conversación abierta. La tinta va en el mensaje propio (relleno violeta, texto Papel Negro, a la derecha) y el ajeno es Pliego Alto con filete (a la izquierda); cada burbuja lleva plana la esquina inferior de su lado. No hay plancha ni segunda pasada en el chat salvo en "Enviar", que es un botón primario. La actualización es por consulta periódica: la conversación pregunta cada 3 s solo por lo nuevo, la bandeja cada 8 s, y ambas se pausan con la pestaña oculta y se refrescan al volver.

**Key Characteristics:**
- Una tinta (violeta) más papel negro; ámbar solo para atención ("Pendiente de envío", errores y avisos de problema), siempre con texto o icono.
- Superficies con filete de 1,5 px; la profundidad es tonal y de registro. La única sombra de caja es la plancha de registro dura, sin desenfoque.
- Segunda pasada desplazada (4 px en reposo) en logotipo, precios, buscador y botones primarios (cabecera y compra), que se encaja a 0 al enfocar, señalar o pulsar.
- Cabecera como pliego de prueba: logotipo de 44 px con lema y filete de 1,5 px.
- Lo vendido se nota: sello punteado "VENDIDO" sobre la foto (30 px en tarjeta, 52 px en ficha), precio tachado y sin tintas.
- Ficha en dos columnas: foto de 520 px de alto y descripción a la izquierda, panel de información a la derecha; la compra se confirma dentro del panel, sin modal.
- Titulares y precios en Bricolage Grotesque extrapesada; el resto en Hanken Grotesk.
- Entrar y crear cuenta: lema de 80 px con registro a la izquierda y tarjeta de formulario de 500 px a la derecha; campos de 48 px, botón de envío de 56 px con plancha.
- Subir producto: formulario de hasta 720 px (título de 40 px) y columna fija de 340 a 400 px con la vista previa del anuncio; zona de foto arrastrable, campo de precio con "€" y aviso del precio final según la categoría.
- Mis ventas: tres columnas iguales (hueco 40 px) por estado, cabecera con la etiqueta de estado, recuento de 24 px y filete de 1,5 px; filas con miniatura de 88 px separadas por filetes, no tarjetas; confirmación en línea de acciones finales; el artículo que cambia de columna queda marcado con contorno violeta hasta que se ve.
- Mensajes: un solo panel (filete 1,5 px, esquina 16 px, Pliego) en dos zonas, bandeja de 300 a 380 px y conversación; filas separadas por filetes, no tarjetas anidadas; burbuja propia violeta con texto Papel Negro y ajena en Pliego Alto con filete, cada una con la esquina inferior de su lado plana; compositor de 2 filas con "Enviar" primario con plancha; franja ámbar de texto cuando se pierde la conexión.
- Escritorio solamente por ahora (ancho mínimo 1100 px).

## Colors

Un papel casi negro con tinta violeta y un único tono cálido reservado para un estado.

### Primary
- **Tinta Violeta** (#8b5cf6): la tinta. Botón primario, etiqueta "En venta", borde de tarjeta al enfocar o pasar, borde del buscador y de los campos de formulario al enfocar, borde del aviso informativo (incluido el "Anuncio publicado" de la ficha), borde de la zona de la foto mientras se arrastra un archivo, borde del bloque de confirmación de compra y del avatar del vendedor, relleno de la burbuja propia del chat (con texto Papel Negro), contorno de 2 px (interior) de la fila de Mis ventas que acaba de cambiar de columna, borde del botón secundario al pasar, cursor de texto, selección, puntos del halftone, destello del lema, segunda pasada del logotipo y pasada viva (al 55 %) de los precios y de las ondas.
- **Violeta Profundo** (#5b34c9): la pasada profunda de los precios, la plancha dura bajo buscador y botones primarios, el relleno del avatar del vendedor, el subrayado del enlace "Entrar" y la pasada profunda de las ondas. No se usa como color de texto ni de relleno de interfaz.
- **Violeta Claro** (#c4b5fd): anillo de foco global (2 px), hover del botón primario, enlaces "Entrar", "← Volver al listado" y de los avisos, lupa del buscador, icono de cámara de la zona de la foto, conmutador "Mostrar" / "Ocultar" de las contraseñas, texto del botón secundario al pasar y color del precio al señalar la tarjeta.

### Secondary
- **Ámbar de Aviso** (#fbbf24): atención, con dos significados: texto y borde de la etiqueta "Pendiente de envío" y todo error o aviso de problema, es decir, borde y mensaje (con icono de aviso) de un campo inválido, borde y mensaje de la zona de la foto (sin icono), alerta de formulario (`FormAlert`) error de compra en la ficha y error al cambiar un pedido en Mis ventas (texto bajo la fila), franja "Sin conexión con el servidor…" del chat (filete superior y texto) y error de la bandeja de conversaciones (caja con borde y texto). Nunca es la única señal: lleva siempre texto, y en los campos además icono.

### Neutral
- **Papel Negro** (#0f0e13): fondo de página (con grano) y texto sobre relleno violeta o tinta clara.
- **Pliego** (#17151d): superficie de tarjetas, buscador, paneles de estado, panel de información de la ficha, tarjeta de formulario, campos de formulario, zona de la foto y tarjeta de vista previa.
- **Pliego Alto** (#1d1a27): fondo del halftone, del bloque de carga (skeleton) y de los bloques de confirmación y de compra registrada, y de la zona de la foto mientras se arrastra un archivo, de la burbuja ajena del chat, de la fila activa de la bandeja y de las miniaturas del chat.
- **Filete** (#2c2838): filetes entre filas de Mis ventas y de la bandeja del chat, borde del panel de mensajes y de la burbuja ajena, divisiones de cabecera y compositor del chat, bordes de tarjetas y chips en reposo, filete bajo la cabecera; barra de desplazamiento.
- **Tinta Clara** (#f2effa): texto principal, chip seleccionado, logotipo.
- **Tinta Suave** (#cfc9e2): frase resumen de Mis ventas, total cobrado en la cabecera de columna, frase de confirmación de una fila, nombre del producto, lema, chips y pestañas en reposo, enlace "Mis ventas", etiquetas de campo, frase de motivo del acceso, texto del aviso informativo.
- **Tinta Tenue** (#a9a3c0): hora de cada mensaje y de cada conversación, separadores de día, último mensaje de cada fila de la bandeja, ayuda y contador bajo el compositor, línea de datos de las filas de Mis ventas, frases de columna vacía, precio tachado de un artículo vendido, enlace "Cancelar pedido" y "Volver", filete bajo la cabecera de columna (al 50 %), metadatos (categoría, contador), placeholder, estado "Vendido", borde en reposo del buscador y de los campos de formulario (al 60 %), ayudas bajo el campo, etiqueta "Opcional", borde en reposo de la zona de la foto (al 60 %), tamaño del archivo, enlace "Quitar", sufijo "€" del precio y textos de relleno de la vista previa ("— €", "El nombre de tu producto", "Categoría automática").

### Named Rules
**The One Ink Rule.** La interfaz es violeta más neutros. No se añade otro matiz. El ámbar es la única excepción y significa una sola cosa, atención, que hoy cubre dos casos: el estado pendiente ("Pendiente de envío") y el error o aviso de problema (campo inválido, alerta de formulario, error de compra). Es una decisión deliberada de todo el sistema (`BuyPanel`, `TextField`, `FormAlert`), no una deriva. El ámbar nunca va solo: siempre con texto, y en los campos inválidos también con icono de aviso. Lo informativo y lo hecho no usan ámbar: el aviso informativo lleva borde violeta y la confirmación borde violeta sólido. Rojo y verde siguen sin existir.

**The Real Photos Rule.** La foto real nunca se tiñe, atenúa, filtra ni trama, tampoco cuando el anuncio está vendido. Lo único que puede cubrirla es el sello de "Vendido" (papel al 85 %, borde punteado de tinta, sin color; en dos tamaños). El violeta nunca cubre una foto; el papel pautado de las ondas va detrás de las tarjetas, nunca encima.

**The Canvas Preview Rule.** La foto elegida en el formulario se dibuja en un `<canvas>` (`PhotoCanvas`, hasta 900 px de ancho, recortada con `object-cover`) y nunca se enlaza con una URL de objeto insertada en el HTML; es una decisión de seguridad heredada del formulario anterior. Si el navegador no puede decodificar el archivo, se descarta antes de subirlo y el campo muestra el error.

## Typography

**Display Font:** Bricolage Grotesque Variable (con Arial Narrow, sans-serif), autoalojada con @fontsource-variable.
**Body Font:** Hanken Grotesk Variable (con system-ui, sans-serif), autoalojada con @fontsource-variable.

**Character:** Bricolage, pesada y de proporciones algo comprimidas, imprime los números y los títulos como tipos de imprenta; Hanken, limpia y neutra, deja leer el resto sin competir.

### Hierarchy
- **Logo** (800, 44px, line-height 1, tracking -0.03em): "Kambio" en la cabecera, con segunda pasada violeta vivo.
- **Price** (800, 36px, 40px, tracking -0.01em, cifras tabulares): precio de cada tarjeta; es lo primero que se lee, con dos pasadas superpuestas.
- **Price Display** (800, 64px, line-height 1, tracking -0.02em, cifras tabulares): precio de la ficha, con las mismas dos pasadas; vendido va tachado (línea de 4 px) en Tinta Tenue y sin pasadas.
- **Title** (800, 32px, tracking -0.01em): nombre del producto en la ficha y título del formulario de acceso (`h1`).
- **Page Title** (800, 40px, line-height 1.25, tracking -0.02em): `h1` de página: "Subir producto" y "Mis ventas", los únicos títulos de ese tamaño.
- **Headline** (800, 24px): "Mensajes" en la cabecera de la bandeja, título de los paneles vacíos del panel derecho del chat, título de los paneles de error, vacío y sin resultados, "Descripción" en la ficha y, en Mis ventas, el recuento de cada columna y el precio de cada fila (cifras tabulares, interlineado 32 px; vendido, tachado con línea de 2 px en Tinta Tenue, sin plancha).
- **Notice Title** (800, 20px): título de los avisos de la ficha, nombre de la otra persona en la cabecera de la conversación (interlineado 24 px), título de la bandeja vacía, nombre del vendedor y encabezado "Así se verá en el listado" sobre la vista previa.
- **Body** (400, 16px, 24px): texto de las burbujas (interlineado 24 px, respeta saltos de línea), nombre del producto en Tinta Suave (dos líneas fijas; en Mis ventas, 600 en Tinta Clara y hasta dos líneas), frase resumen de Mis ventas (18 px, 28 px, Tinta Suave), textos de panel, botones (600), entrada del buscador.
- **Description** (400, 18px, 32px, máx. 68ch, Tinta Suave): descripción del anuncio en la ficha, respeta saltos de línea.
- **Label** (400, 15px): texto de los chips de categoría (seleccionado en 600).
- **Slogan** (600, 14px, tracking 0.025em): "Pass it, spark change" bajo el logotipo, en Tinta Suave.
- **Hero** (800, 80px, line-height 0.95, tracking -0.03em): el lema "Pass it, spark change." en entrar y crear cuenta, con las dos pasadas de los precios (4 y 8 px, estáticas).
- **Lead** (400, 20px, 32px, máx. 38ch, Tinta Suave): frase de motivo bajo el lema ("Entra para comprar este artículo.").
- **Field Label** (600, 15px, Tinta Suave): etiqueta de campo. Ayuda, error, "Opcional" y el conmutador "Mostrar" miden 14 px (Caption; el conmutador en 600).
- **Stamp** (800, 30px, line-height 1, tracking 0.1em, mayúsculas): sello "VENDIDO" sobre la foto de la tarjeta, rotado -10 grados. **Stamp Large** igual a 52 px en la ficha.
- **Tag** (600, 13px, 20px): etiquetas de estado.
- **Micro** (400, 12px, 16px): hora bajo cada burbuja, tiempo relativo de cada fila de la bandeja y línea de ayuda del compositor con su contador ("942/1000", cifras tabulares), siempre en Tinta Tenue. Es el único texto por debajo de 13 px.
- **Day Label** (600, 12px, tracking 0.025em, mayúsculas): separador de día centrado en el registro de mensajes ("HOY", "AYER", "12 oct"), en Tinta Tenue. Es un separador funcional de la lista, no un rótulo de sección.
- **Caption** (400, 14px): línea de datos de cada fila de Mis ventas ("Publicado hace N días" o "Pedido hace N días · comprador nº N"), categoría en la tarjeta y contador "Mostrando N de M anuncios", nota bajo la vista previa y tamaño del archivo elegido.

### Named Rules
**The Heavy Numbers Rule.** Precios y títulos van en Bricolage 800; nunca en Hanken ni en pesos intermedios. El texto corrido nunca va en Bricolage.

## Layout

Columna central con `max-width` 1740 px, ancho mínimo 1100 px, centrada, con 48 px de margen lateral, 32 px arriba y 64 px abajo. La cabecera es una fila (hueco 40 px, alineada al centro): bloque de marca (logotipo y lema, 8 px entre ambos), buscador que ocupa el resto, y navegación de cuenta con el botón "+ Subir producto". Bajo la fila, 28 px de aire y un filete de 1,5 px en Filete. Debajo, a 24 px, la fila de chips (hueco 10 px) y a otros 24 px la rejilla de 3 columnas con hueco de 24 px (4 columnas desde 1800 px de ancho). El contador va 24 px bajo la rejilla.

**Ficha del producto:** misma columna y misma cabecera; en el hueco del buscador va el enlace "← Volver al listado" (vuelve atrás conservando búsqueda y categoría si se llegó desde la app; si no, al inicio). Debajo, rejilla de dos columnas `3fr / 2fr` (la derecha con mínimo 420 px), hueco 40 px, alineada arriba. Izquierda: galería (foto de 520 px de alto) y, a 32 px, "Descripción". Derecha: panel de información de 32 px de padding con 28 px entre bloques (cabecera de datos con 16 px entre líneas, compra, vendedor). Carga: dos bloques lisos de 520 px (Pliego Alto y Pliego) con pulso.

**Entrar y crear cuenta** (`/login`, `/registro`): misma columna y cabecera, sin menú de cuenta; en el hueco del buscador va "← Volver al listado". Debajo, a 24 px, rejilla de dos columnas `minmax(0,1fr) / minmax(420px,500px)`, hueco 64 px, centradas en vertical. Izquierda (máx. 640 px): lema de 80 px y, 32 px más abajo, la frase de motivo. Derecha: tarjeta de 500 px como máximo, padding 32 px; pestañas, 28 px de aire, y el formulario con 20 px entre elementos (6 px entre etiqueta, campo y mensaje; 4 px extra sobre el botón de envío).

**Subir producto** (`/subir`, ruta con sesión: sin ella se pasa por el login y se vuelve): misma columna y cabecera, con "← Volver al listado" en el hueco del buscador. Debajo, 8 px de aire y rejilla `minmax(0,1fr) / minmax(340px,400px)` con hueco de 56 px, alineada arriba. Izquierda: formulario de 720 px como máximo, con 24 px entre bloques (título, foto, nombre, descripción, fila precio y categoría, nota, alerta, botón). Precio y categoría comparten fila de dos columnas con 20 px de hueco. Derecha: columna fija (`sticky`, 32 px desde arriba) con el encabezado de 20 px a 16 px de la tarjeta de vista previa y, a 12 px, la nota de 14 px.

**Mis ventas** (`/mis-ventas`, ruta con sesión: sin ella se pasa por el login y se vuelve): misma columna y cabecera, con "← Volver al listado" en el hueco del buscador. Debajo, 8 px de aire y una pila con 32 px entre bloques: título de 40 px (con la frase resumen a 4 px debajo) y, a continuación, rejilla de 3 columnas iguales con hueco de 40 px, alineada arriba (las columnas crecen de forma independiente). Cada columna: cabecera en fila (12 px entre elementos, alineada al centro: etiqueta de estado, recuento y, a la derecha, el total cobrado solo en Vendido) sobre filete de 1,5 px en Tinta Tenue al 50 % con 12 px de aire; debajo, la lista de filas. Fila: 16 px arriba y abajo, 16 px entre miniatura (88 px) y texto, filete de 1,5 px en Filete al pie; el texto se apila con 4 px (nombre, precio, datos) y las acciones del pedido pendiente a 8 px. Orden: lo más recientemente publicado primero. Columna vacía: una frase de 16 px en Tinta Tenue con 24 px de aire. Carga: tres columnas con un bloque de cabecera de 36 px (Pliego Alto) y tres bloques de 88 px (Pliego) con pulso. Sin ningún anuncio: panel de invitación de 576 px máximo, con filete punteado.

**Mensajes** (`/chat` y `/chat/:productId`; el vendedor añade `?comprador=ID`; ruta con sesión: sin ella se pasa por el login y se vuelve): misma columna y cabecera, con "← Volver al listado" en el hueco del buscador y un `h1` "Mensajes" solo para lectores. Debajo, un panel único de altura `calc(100vh - 200px)` (mínimo 560 px) con rejilla `minmax(300px,380px) / minmax(0,1fr)`, sin hueco y con un filete de 1,5 px entre zonas. Bandeja: cabecera "Mensajes" (24 px, 16 px de padding, filete debajo) y lista con desplazamiento propio; fila de 14 px arriba y abajo y 16 px a los lados, 12 px entre miniatura de 56 px y texto, 2 px entre líneas, filete de 1,5 px al pie. Conversación: cabecera con 24 px laterales y 16 px verticales, 16 px entre miniatura de 48 px, textos y etiqueta de estado, filete debajo; registro con 24 px laterales y 20 px verticales, 4 px entre elementos y 12 px de aire en cada separador de día; franja de conexión; compositor con filete encima, 24 px laterales, 16 px verticales y 8 px entre elementos, con el textarea y el botón de 48 px alineados abajo y 12 px de hueco. Burbujas de hasta el 72 % del ancho del registro. El desplazamiento se queda abajo solo si la persona ya estaba a menos de 80 px del final o acaba de enviar. Carga de la bandeja: cuatro bloques de 72 px (Pliego Alto, esquina 12 px) con pulso.

Ritmo de espaciado observado: 4, 6, 8, 10, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64. Altura de controles de cabecera: 48 px (buscador y botón); en los paneles de estado, 44 px; en la ficha, 56 px el botón principal y el secundario de ancho completo, 48 px dentro de los bloques de confirmación; en entrar y crear cuenta, 48 px los campos y 56 px el botón de envío; en subir producto, 48 px los campos de una línea, 44 px el botón de la foto y 56 px el de publicar; en Mis ventas, 40 px el botón de acción de una fila (compacto) y 44 px y 48 px los de los paneles de error y de invitación; en Mensajes, 48 px "Enviar" y 44 px "Reintentar" del error de carga de la conversación. No hay diseño móvil; solo escritorio. Al entrar, las tarjetas "imprimen" escalonadas (45 ms por posición, hasta la undécima).

## Elevation & Depth

Tonal y de registro. La jerarquía se expresa con el salto de Papel a Pliego, con filetes de 1,5 px, con la segunda pasada de tinta y con un levantamiento de 6 px de la tarjeta al señalarla (desplazamiento, no sombra). No hay sombras difusas ni de elevación. Las únicas sombras del sistema son desplazamientos duros sin desenfoque, propios del medio impreso: la plancha de registro.

### Shadow Vocabulary
- **Plancha de texto** (`text-shadow: var(--reg) var(--reg) 0 violet-deep, calc(var(--reg) * 2) calc(var(--reg) * 2) 0 violet 55 %`): precios, dos pasadas superpuestas. El logotipo lleva una sola pasada (`var(--reg) var(--reg) 0 violet`).
- **Plancha de caja** (`box-shadow: 4px 4px 0 violet-deep`): segunda plancha bajo el buscador y todo botón primario (clase compartida `PLATE` en `components/styles.ts`: "+ Subir producto", "Comprar por X", "Confirmar compra", "Entrar", "Crear cuenta"). Al pasar, enfocar (en el buscador, `focus-within`) o pulsar, la sombra pasa a ninguna y, solo con `motion-safe`, el elemento se traslada 4 px (x e y) y se asienta sobre su plancha (200 ms, ease-out-expo). Con `prefers-reduced-motion` la sombra se anula al instante, sin transición ni traslación.

### Named Rules
**The Registration Rule.** `--reg` es la distancia de la segunda pasada: 4 px en reposo en logotipo y precios (propiedad registrada y animable). Precio de la ficha (64 px): mismas dos pasadas a 4 y 8 px, estático, sin slam ni escala. Precios de tarjeta: al señalar o enfocar la tarjeta, `--reg` baja a 0 con la animación `register-slam` (de 16 px a 0, 0,55 s, ease-out-expo, sin rebote), el precio se escala a 1,1 (origen izquierdo) y pasa a Violeta Claro, y la tarjeta sube 6 px. Logotipo: se encaja a 0 al señalar o enfocar el enlace. Buscador y botones primarios usan la versión de caja (4 px fijos, sin `--reg`). Un precio vendido no lleva segunda pasada (sin plancha, sin hover de color ni escala). No se aplica a chips, botones de panel, enlaces ni texto corrido.

**The Plate Only Rule.** Una sombra de caja solo puede ser la plancha de registro: desplazamiento duro, 0 de desenfoque, color Violeta Profundo, y se anula al interactuar. Nunca elevación suave, brillo ni sombra difusa. Esta regla sustituye a la antigua "Flat Paper", que era falsa respecto a lo construido.

## Shapes

Esquinas moderadas y consistentes: tarjetas, galería y panel de información 16 px, bloques de aviso 12 px, controles (buscador, campos de formulario y botones) 10 px, tarjeta de formulario 16 px, alertas de formulario 8 px, avatar circular, etiquetas de estado 6 px, chips en píldora completa, anillo de foco 4 px. Todo borde es de 1,5 px. El borde distingue estados: sólido para lo normal, punteado (dashed) para lo vendido o vacío; los avisos de la ficha usan filete punteado (propio, reservado, vendido) y el bloque activo (confirmación, compra registrada) filete sólido violeta; el sello de "Vendido" lleva borde punteado (3 px en tarjeta, 4 px en ficha) y esquina 6 px. La foto se recorta al borde superior de la tarjeta con altura fija de 236 px y `object-cover`. En Mis ventas la miniatura es de 88 px con esquina de 12 px y la fila marcada lleva una esquina de 12 px; el contorno de 2 px es interior (no desplaza el contenido) y no se confunde con el filete de 1,5 px. En Mensajes, el panel es de 16 px, las miniaturas (56 px en la bandeja, 48 px en la cabecera) de 12 px y el campo del compositor de 10 px; las burbujas son de 16 px con la esquina inferior de su lado a 6 px (derecha la propia, izquierda la ajena), de modo que la cola apunta a quien habla; la ajena lleva filete de 1,5 px y la propia no. El destello del lema es una estrella de cuatro puntas de 16 px, dibujada en SVG con una sola trayectoria cerrada, de relleno Tinta Violeta.

## Components

### Header
Fila de marca, buscador y cuenta sobre un filete de 1,5 px en Filete. Con sesión, el menú de cuenta es "Mensajes" (enlace a `/chat`, con el mismo estilo que "Mis ventas": Tinta Suave, 600, hover Tinta Clara; sin contador de no leídos), "Mis ventas", "Salir" y "+ Subir producto". La marca es un enlace: logotipo (Bricolage 44 px, con segunda pasada violeta) y debajo el lema con el destello. En `/login` y `/registro` la cabecera omite el menú de cuenta ("Entrar", "Mis ventas", "Salir", "+ Subir producto"), porque la persona ya está haciéndolo, y el hueco del buscador lo ocupa "← Volver al listado".

### Buttons
- **Shape:** esquina de 10 px, altura 48 px en cabecera (44 px en los paneles de estado), padding horizontal 24 px (20 px en paneles), texto 16 px en 600.
- **Primary:** relleno Tinta Violeta con texto Papel Negro ("+ Subir producto", "Comprar por X", "Confirmar compra", "Entrar", "Crear cuenta"). Lleva la plancha de caja (Elevation) vía `PRIMARY_BUTTON`. **Large:** 56 px de alto, ancho completo y texto 18 px, el "Comprar por X" de la ficha y el botón de envío de entrar, crear cuenta y subir producto ("Publicar producto"; deshabilitado: "Entrando…", "Creando tu cuenta…", "Subiendo la foto…", "Publicando…"). Deshabilitado ("Registrando…"): opacidad 60 % y cursor no permitido.
- **Secondary** (`SECONDARY_BUTTON`): borde 1,5 px Tinta Tenue al 70 %, sin relleno ni plancha, texto Tinta Clara 16 px en 600; al pasar, borde Tinta Violeta y texto Violeta Claro. 56 px de ancho completo ("Chatear con el vendedor"); 48 px en bloques ("Cancelar"); 44 px en la zona de la foto ("Elegir foto", "Cambiar").
- **Hover / Focus / Press:** el fondo pasa a Violeta Claro y el botón pierde la plancha; con `motion-safe` además se asienta 4 px sobre ella (200 ms); anillo de foco global de 2 px Violeta Claro con 3 px de separación. "Reintentar" y el botón del panel vacío del listado no llevan plancha.
- **Outline** (listado): borde 1,5 px Tinta Tenue sin relleno, el borde pasa a Tinta Clara al pasar ("Quitar filtros").
- **Compact** (`button-primary-compact`): 40 px, padding 16 px, texto 15 px; es el botón primario de las acciones dentro de una fila de lista ("Marcar como vendido", "Sí, …"). Mantiene plancha de 4 px y todos los estados del primario.
- **Text link:** "Entrar" en Violeta Claro subrayado en Violeta Profundo; "Mis ventas" y "Salir" en Tinta Suave y Tenue, hover a Tinta Clara. "← Volver al listado" y los enlaces de aviso ("Ir a Mis ventas", "Ver más en X") en Violeta Claro, subrayados (hover a Tinta Clara). "Quitar" (zona de la foto): 14 px en 600, Tinta Tenue, hover Tinta Clara, sin subrayado ni borde.

### Chips
- **Style:** píldora, borde 1,5 px Filete, texto Tinta Suave 15 px, padding 6 x 14 px.
- **State:** seleccionado = relleno Tinta Clara con texto Papel Negro y peso 600 (no violeta, para que el violeta quede para la acción); hover en reposo = borde Tinta Tenue. Pulsar el chip activo lo deselecciona; "Todo" limpia la categoría. En la ficha, la categoría es un enlace en forma de chip (reposo, sin selección) que lleva al listado filtrado.

### Cards / Containers
- **Corner Style:** 16 px.
- **Background:** Pliego, con filete de 1,5 px Filete.
- **Shadow Strategy:** ninguna; ver Elevation.
- **Hover / Focus:** el filete pasa a Tinta Violeta, la tarjeta sube 6 px (300 ms, ease-out-expo), el precio crece a 1,1, pasa a Violeta Claro y su segunda pasada se encaja con `register-slam`.
- **Sold:** filete punteado en Tinta Tenue al 60 % (sólido violeta al señalar o enfocar); nombre en Tinta Tenue; precio en Tinta Tenue tachado con línea de 3 px, sin plancha, sin color ni escala al señalar; sello "VENDIDO" centrado sobre la foto (ver Status Tags). La foto no se toca.
- **Internal Padding:** 14 px arriba, 16 px lados y abajo; hueco interno de 4 px; nombre con altura mínima de 48 px (dos líneas) para alinear las etiquetas.

### Inputs / Fields
- **Style:** Pliego, borde 1,5 px Tinta Tenue al 60 %, esquina 10 px, altura 48 px, lupa SVG de 20 px en Violeta Claro a la izquierda (padding izquierdo 48 px). Lleva la plancha de caja en el contenedor. Placeholder: "Busca una bici, un iPhone, una lámpara…".
- **Focus:** el borde pasa a Tinta Violeta, sin anillo adicional, la plancha se anula y, con `motion-safe`, el campo se asienta 4 px sobre ella.

### Text Field (formularios de acceso y de subida)
Campo etiquetado y apilado: etiqueta, campo y mensaje con 6 px entre sí.
- **Style:** Pliego, borde 1,5 px Tinta Tenue al 60 %, esquina 10 px, altura 48 px, padding horizontal 16 px, texto 16 px en Tinta Clara; sin placeholder y sin plancha. Etiqueta arriba en Tinta Suave (15 px, 600); si es opcional, "Opcional" a la derecha de la etiqueta en Tinta Tenue (14 px).
- **Hover / Focus:** al pasar, el borde sube a Tinta Tenue plena; al enfocar pasa a Tinta Violeta, sin anillo adicional.
- **Hint:** ayuda de 14 px en Tinta Tenue bajo el campo ("Mínimo 8 caracteres."); la sustituye el error cuando lo hay.
- **Error:** borde ámbar y, bajo el campo, mensaje de 14 px en ámbar con icono de triángulo de aviso (SVG de 16 px). `aria-invalid` y `aria-describedby` enlazan campo y mensaje. Es borde, icono y texto a la vez, nunca solo color. El borde ámbar manda también con el foco puesto.
- **Password:** botón de texto "Mostrar" / "Ocultar" dentro del campo, a la derecha (14 px, 600, Violeta Claro, hover Tinta Clara, `aria-pressed`); el campo reserva 96 px de padding derecho.
- **Validación:** refleja las reglas del backend, con `noValidate` (sin avisos nativos). Se evalúa al enviar y, tras el primer intento, en vivo mientras se corrige. El foco va al primer campo inválido; un email repetido (409) se muestra como error del campo email. Tras un login fallido el foco vuelve a la contraseña. En subir producto el foco va al primer campo inválido en el orden foto, nombre, descripción, precio, categoría.
- **Multilínea** (`multiline`, `rows`): la descripción es un área de 5 filas con la misma superficie, borde y esquina de 10 px, padding 12 x 16 px, interlineado de 28 px y redimensionable en vertical. La ayuda lleva un contador en vivo ("93/5000"); `maxLength` es 5000.
- **Sufijo** (`suffix`): texto fijo "€" a la derecha, a 16 px del borde, en Tinta Tenue, sin eventos y oculto a lectores de pantalla; el campo reserva 48 px de padding derecho. Se acompaña de `inputMode="decimal"` (teclado decimal).
- **Sugerencias** (`list`): la categoría es un campo libre y opcional con `datalist` nativo; las sugerencias son las categorías que ya existen en los anuncios. Si no se pueden pedir, el campo sigue siendo libre. El desplegable lo dibuja el navegador, no el sistema.
- **Ayuda con efecto:** la ayuda del precio pasa a decir cuánto se publicará cuando la categoría escrita tiene regla ("Con «Deporte» (−10 %) se publicará a 90 €."); si no, "En euros, por ejemplo 45 o 45,50.".

### Form Alert
Alerta a nivel de formulario, entre los campos y el botón de envío (la informativa va encima de los campos). Esquina 8 px, borde 1,5 px, padding 12 x 16 px, texto 15 px, sin relleno.
- **Error** (`role="alert"`): borde y texto ámbar. Fallos de red o del servidor ("No hemos podido conectar con el servidor…"), también al subir o publicar. Lleva texto, sin icono.
- **Informativo** (`role="status"`): borde Tinta Violeta y texto Tinta Suave. Lo usa el login cuando la cuenta se creó pero el acceso automático falló ("Tu cuenta está creada. Entra con tu email y tu contraseña.") y la ficha recién publicada (ver Published Notice).

### Auth Shell y pestañas
Pantalla de acceso de dos columnas (ver Layout) que comparten `/login` y `/registro`.
- **Lema:** "Pass it, spark change." en Hero (80 px) con las dos pasadas de los precios, sin animación, y debajo la frase de motivo en Lead: "Entra para…" o "Crea tu cuenta para…" más lo que la persona iba a hacer (comprar, subir un producto…), derivado de a dónde se dirigía.
- **Tarjeta:** Pliego, filete 1,5 px Filete, esquina 16 px, padding 32 px, 500 px como máximo, sin plancha ni sombra.
- **Pestañas** "Entrar" / "Crear cuenta": enlaces de navegación (`nav` "Acceso", `aria-current="page"`), no tablist. Misma forma que los chips: píldora, borde 1,5 px, texto 15 px, padding 6 x 16 px. Activa = relleno Tinta Clara, texto Papel Negro en 600; inactiva = borde Filete y texto Tinta Suave, con hover a borde Tinta Tenue y texto Tinta Clara. Cambiar de pestaña conserva el destino (`?next=`).
- **Envío:** botón primario grande (56 px, 18 px, plancha), ancho completo. Crear cuenta inicia sesión automáticamente al terminar y vuelve al destino.

### Photo Field (subir producto)
Zona de foto en una sola fila, a la altura de un campo: icono de cámara dibujado en SVG (36 px, trazo de 1,6 px, Violeta Claro, decorativo), a su lado "Arrastra una foto aquí o elige un archivo." en Tinta Suave y, a la derecha, el botón secundario de 44 px "Elegir foto". Con archivo elegido, el texto pasa a nombre del archivo (600, Tinta Clara, truncado) y tamaño ("0,4 MB", 14 px, Tinta Tenue), el botón pasa a "Cambiar" y aparece "Quitar".
- **Estilo:** Pliego, borde 1,5 px Tinta Tenue al 60 %, esquina 10 px, padding 16 x 20 px, 16 px entre elementos; etiqueta "Foto" encima (15 px, 600, Tinta Suave) y ayuda "JPG, PNG o WEBP, de hasta 5 MB." debajo (14 px, Tinta Tenue).
- **Arrastrando:** borde Tinta Violeta y fondo Pliego Alto (150 ms).
- **Error:** borde ámbar y mensaje ámbar de 14 px bajo la zona, sustituyendo a la ayuda; el error manda sobre el estado de arrastre. Valida tipo y tamaño en el cliente, y el 413 o 415 del servidor vuelve como el mismo error. Si el navegador no puede decodificar el archivo se descarta con "Ese archivo no se puede mostrar como imagen. Elige otra foto.".
- **Accesibilidad:** grupo con etiqueta, el `input` de archivo oculto con `sr-only` y el botón visible como único punto de entrada; al fallar, el foco va al botón. Es la única fotografía del formulario y se dibuja en un lienzo (ver The Canvas Preview Rule).

### Form Note (subir producto)
Nota llana antes del botón de envío que explica las reglas de precio del servidor: Tecnología suma el 21 % de IVA, Deporte resta el 10 %, Ofertas resta 5 € (mínimo 1 €) y Premium suma el 25 %. Borde de 1,5 px Filete, esquina 8 px, padding 12 x 16 px, texto de 15 px en Tinta Suave, sin relleno, sin icono ni plancha. Es informativa y no usa ámbar: las reglas son un hecho, no un error.

### Listing Preview (subir producto)
Prueba de impresión del anuncio en la columna derecha: copia visual de la tarjeta del listado (Pliego, filete de 1,5 px Filete, esquina 16 px, foto de 236 px, precio de 36 px, nombre de dos líneas fijas, etiqueta "En venta" y categoría), pero inerte: `aria-hidden`, sin enlace, sin hover ni entrada.
- **Sin foto:** halftone, que sigue siendo solo la marca de "sin foto". Con foto: la foto dibujada en lienzo, sin tratamiento.
- **Precio:** "— €" liso en Tinta Tenue, sin plancha, hasta que hay un precio válido; entonces el precio final estimado (con la regla de categoría aplicada) con las dos pasadas del listado.
- **Relleno:** "El nombre de tu producto" en Tinta Tenue mientras el nombre está vacío; la categoría vacía muestra "Categoría automática".
- **Rótulo:** encabezado "Así se verá en el listado" y nota "Una muestra: la categoría y el precio final se confirman al publicar.".

### Published Notice (ficha)
Tras publicar, la ficha muestra encima del artículo un aviso informativo (`FormAlert` de `role="status"`: borde Tinta Violeta, texto Tinta Suave, esquina 8 px) con un resumen: "Anuncio publicado.", si la categoría la eligió la IA ("La IA le ha puesto la categoría «X».") y, si el precio cambió, "El precio final es X: pediste Y y la categoría aplica Z.". El estado viaja en la navegación, así que al recargar desaparece.

### Sales Board (Mis ventas)
Tablero de tres columnas (ver Layout), una `section` con etiqueta por estado ("Artículos en venta", "pendientes de envío", "vendidos"). La cabecera de columna reutiliza tal cual las etiquetas de estado (forma y color) más el recuento en Headline y, en Vendido, el total cobrado en 15 px, Tinta Suave, a la derecha. Es una lista plana: filas separadas por filetes, nunca tarjetas anidadas ni plancha.
- **Resumen:** bajo el `h1`, "Has vendido N artículo(s) por X €." en 18 px, Tinta Suave; solo aparece si hay al menos una venta, y sale de los datos reales.
- **Columna vacía:** frase llana en Tinta Tenue ("No tienes nada a la venta ahora mismo.", "Ningún pedido pendiente de envío.", "Todavía no has vendido nada."), sin panel.
- **Sin anuncios:** panel de invitación con filete punteado, esquina 16 px, padding 24 px: "Todavía no has subido nada", una frase y "+ Subir producto" (primario 48 px con plancha). Filete punteado = no hay nada que hacer aún.
- **Carga:** tres columnas de bloques lisos con pulso (solo con movimiento permitido) y un `role="status"` oculto "Cargando tus ventas…". Nunca halftone.
- **Error:** panel de error (Pliego, filete sólido, esquina 16 px, 576 px máximo) con titular "No hemos podido cargar tus ventas", el mensaje y "Reintentar" (primario 44 px con plancha).

### Sale Row (Mis ventas)
Fila de lista: miniatura de 88 px (Pliego Alto, esquina 12 px; sin foto o con error de carga, halftone fino; la foto nunca se trata ni lleva sello aquí), y a su derecha el nombre (16 px, 600, Tinta Clara, hasta dos líneas, enlace a la ficha, hover Violeta Claro), el precio en Headline y la línea de datos en Caption Tinta Tenue. El precio vendido va en Tinta Tenue tachado y sin plancha; en el tablero no hay matrículas de registro. La miniatura enlaza a la ficha pero queda fuera de la tabulación y oculta a lectores; el enlace del nombre es el punto de entrada.
- **Datos:** "Publicado hace N días" o, en pendiente, "Pedido hace N días · comprador nº N". La API da solo `buyer_id`, sin nombre, y la interfaz no inventa uno.
- **Acciones del pedido pendiente:** botón primario compacto "Marcar como vendido" (40 px, padding horizontal 16 px, texto 15 px en 600, con plancha de caja) y enlace de texto "Cancelar pedido" (15 px, 600, Tinta Tenue subrayado al 50 %, hover Tinta Clara). Ambos cambios son finales y se confirman en línea.
- **Chat con el comprador:** en el pedido pendiente, entre "Marcar como vendido" y "Cancelar pedido", el enlace "Chatear con el comprador" (15 px, 600, Violeta Claro, subrayado de 2 px en Violeta Profundo, hover Tinta Clara) lleva a `/chat/:productId?comprador=ID`. Es el único enlace violeta de la fila: abre una conversación, no cambia el pedido.
- **Confirmación en línea:** sustituye a las dos acciones dentro de la fila (sin modal ni bloque con borde): frase explicativa de 15 px en Tinta Suave ("Pasará a «Vendido» y no se puede deshacer. Hazlo cuando ya lo hayas enviado o entregado." / "Se cancela el pedido y el anuncio vuelve a estar en venta. No se puede deshacer."), el botón compacto "Sí, marcar como vendido" o "Sí, cancelar el pedido" (en curso: "Guardando…", deshabilitado) y el enlace "Volver". Cancelar el pedido usa el mismo botón primario, no ámbar: es una decisión, no un error.
- **Error:** si el cambio falla, la confirmación se cierra y bajo la fila sale el mensaje en ámbar (15 px, `role="alert"`), sin borde ni icono. Si falta el pedido de un artículo pendiente: línea de 14 px en Tinta Tenue "No encontramos el pedido de este artículo. Recarga la página.".
- **Fila marcada** (el artículo acaba de cambiar de columna): contorno de 2 px Tinta Violeta hacia dentro (`outline-offset` -2 px), esquina 12 px y 12 px de padding lateral, hasta que el puntero entra en la fila o el foco llega a ella. El estado vive en la sesión de la página: al recargar desaparece.

### Chat Panel (Mensajes)
Un solo contenedor (Pliego, filete de 1,5 px, esquina 16 px, `overflow: hidden`) con dos zonas (ver Layout). Nada dentro es una tarjeta: bandeja y conversación se separan por filetes y no hay plancha ni sombra. Dos secciones con etiqueta ("Conversaciones", "Conversación").
- **Bandeja:** `h2` "Mensajes" en Headline. Cada conversación es una fila-enlace: miniatura redondeada de 56 px (foto sin tratar, halftone fino si falta o falla; decorativa), nombre de la otra persona en 600 Tinta Clara con el tiempo relativo a la derecha (Micro, Tinta Tenue), nombre del producto en 14 px Tinta Suave y último mensaje en 14 px Tinta Tenue con "Tú: " delante si es propio; todas las líneas truncadas. Reposo sin relleno; al señalar y activa, Pliego Alto (la activa con `aria-current="page"`). Filas separadas por filetes de 1,5 px.
- **Bandeja vacía:** "Todavía no tienes conversaciones" (Notice Title), una frase en Tinta Suave y el enlace "Ver anuncios" (Violeta Claro subrayado). **Error:** caja con borde ámbar de 1,5 px, esquina 8 px y texto ámbar de 15 px (`role="alert"`). **Carga:** cuatro bloques lisos con pulso y un `role="status"` oculto.
- **Cabecera de conversación:** miniatura de 48 px (decorativa, enlaza a la ficha, fuera de la tabulación), nombre de la otra persona en Notice Title, debajo el nombre del producto (enlace, 600, hover Violeta Claro) y el precio en 14 px Tinta Suave, y a la derecha la etiqueta de estado del anuncio. Para el vendedor, si el comprador aún no ha escrito, el nombre es "Comprador nº N" (la interfaz no inventa otro).
- **Paneles vacíos de la zona derecha:** centrados, un título en Headline y una frase en Tinta Suave de hasta `max-w-sm`: "Elige una conversación", "Este anuncio es tuyo" (el vendedor sin comprador indicado), "Este anuncio no existe" y "Cargando…". Sin icono, sin borde, sin botón. Error de carga del anuncio: frase en Tinta Suave y el enlace de texto "Reintentar" en Violeta Claro.
- **Sin mensajes todavía:** frase centrada en Tinta Suave dentro del registro ("Todavía no hay mensajes. Escribe el primero a X sobre «Y»."). **Error de carga de la conversación:** texto en Tinta Suave (`role="alert"`) y "Reintentar" primario de 44 px con plancha. **Carga:** "Cargando la conversación…" en Tinta Tenue.

### Message Log y burbujas
Registro con `role="log"` y `aria-live="polite"`, etiquetado "Mensajes con X", con desplazamiento propio. Los mensajes van en orden cronológico; cuando cambia el día aparece el separador (Day Label: "HOY", "AYER" o "12 oct", comparando días del calendario local).
- **Propia:** relleno Tinta Violeta, texto Papel Negro, alineada a la derecha, esquina inferior derecha de 6 px y las demás de 16 px; padding 10 x 16 px, 16 px con interlineado de 24 px, respeta saltos de línea y parte palabras largas.
- **Ajena:** relleno Pliego Alto, filete de 1,5 px Filete, texto Tinta Clara, alineada a la izquierda, esquina inferior izquierda de 6 px.
- **Medida y hora:** hasta el 72 % del ancho; debajo de cada burbuja la hora local ("14:05") en Micro, Tinta Tenue, con 4 px de padding lateral, alineada con la burbuja. Cada burbuja lleva un prefijo solo para lectores ("Tú: " o el nombre), porque la alineación y el color no bastan.
- **Conexión perdida:** franja de texto entre el registro y el compositor, con filete superior de 1,5 px ámbar y texto ámbar de 14 px ("Sin conexión con el servidor. Seguimos intentándolo…", `role="status"`); sin icono ni relleno. Desaparece sola al volver la conexión.

### Composer (Mensajes)
Formulario al pie de la conversación, bajo un filete de 1,5 px. Campo de varias líneas de 2 filas, no redimensionable, sin etiqueta visible (etiqueta oculta "Escribe un mensaje a X") y con el marcador "Escribe un mensaje…"; Pliego, borde 1,5 px Tinta Tenue al 60 %, esquina 10 px, padding 12 x 16 px, texto 16 px con interlineado de 24 px; hover Tinta Tenue plena, foco borde Tinta Violeta, sin plancha. Al lado, "Enviar" (primario de 48 px con plancha; "Enviando…" mientras se envía; deshabilitado, al 60 %, si el texto está vacío o en blanco). Intro envía, Mayús+Intro hace salto de línea y un IME en composición no envía. Máximo 1000 caracteres; el contador "N/1000" aparece desde 900. Debajo, en Micro y Tinta Tenue, la línea de ayuda "Intro envía · Mayús+Intro, nueva línea · se actualiza solo cada pocos segundos". Si el envío falla, una `FormAlert` ámbar encima del campo y el texto escrito se conserva; tras enviar, el campo se vacía y recupera el foco.

### Polling (comportamiento del chat)
La conversación se refresca cada 3 s pidiendo solo los mensajes más nuevos que el último recibido (`after_id`); la bandeja, cada 8 s. Las consultas no se apilan (si una tarda, se salta la siguiente), se pausan mientras la pestaña está oculta y se lanzan de inmediato al volver. No hay indicador de "escribiendo" ni de no leídos. Los WebSockets están previstos para más adelante y sustituirán a esto sin cambiar lo visual.

### Status Tags (signature)
Cada estado tiene color y forma fijos, para no depender solo del color: **En venta** = relleno violeta con texto Papel Negro; **Pendiente de envío** = borde ámbar 1,5 px sólido con texto ámbar; **Vendido** = borde punteado Tinta Tenue con texto Tinta Tenue. Esquina 6 px, texto 13 px en 600. Nunca se oculta ni se mueve de la base de la tarjeta. En Mis ventas la misma etiqueta encabeza cada columna.

**Sello de vendido:** además de la etiqueta, el anuncio vendido lleva un sello centrado sobre la foto: "VENDIDO" en Bricolage 800, tracking 0.1em, mayúsculas, texto Tinta Clara, fondo Papel Negro al 85 %, borde punteado en Tinta Clara, esquina 6 px, rotado -10 grados. Dos tamaños (`SoldStamp`): **tarjeta** 30 px, borde 3 px, padding 8 x 20 px; **grande** (ficha) 52 px, borde 4 px, padding 12 x 32 px. Es decorativo (`aria-hidden`; el estado lo lee la etiqueta) y no recibe eventos. Tapa parte de la foto pero no la tiñe ni la atenúa.

### Info Panel (ficha)
Panel de Pliego con filete de 1,5 px, esquina 16 px, padding 32 px y 28 px entre bloques. Orden fijo: etiqueta de estado, precio de 64 px, nombre de 32 px, línea "ubicación · Publicado hace N días" en Tinta Suave, enlace de categoría en chip, bloque de compra, y al final la tarjeta del vendedor separada por filete.

### Buy Panel y avisos
La compra se resuelve dentro del panel, sin modal. Disponible: "Comprar por X" (primario grande con plancha) y debajo "Chatear con el vendedor" (secundario). Al pulsar comprar, el botón se sustituye por un **bloque de confirmación** (Pliego Alto, borde sólido de 1,5 px Tinta Violeta, esquina 12 px, padding 20 px): título de 20 px "¿Confirmas la compra?", texto y, en fila, "Confirmar compra" (primario 48 px, flexible) y "Cancelar" (secundario). Tras comprar, el **bloque de éxito** "Compra registrada" (misma superficie y borde violeta) con "Chatear con el vendedor". Los **avisos sin acción de compra** usan filete punteado de 1,5 px en Filete, esquina 12 px, padding 20 px, sin relleno: "Este anuncio es tuyo" (con enlace a Mis ventas), "Ya está reservado" y "Este artículo ya se vendió" (con enlace "Ver más en X"). Regla de forma: borde sólido violeta = acción en curso o hecha; punteado = no hay acción de compra posible. En reservado el chat sigue disponible; en vendido y en el aviso propio no. Si la compra falla, el error sale como alerta ámbar (borde y texto, esquina 8 px) bajo el bloque, con el mismo tratamiento que el error de `FormAlert`.

### Seller Card
Fila bajo filete de 1,5 px: avatar circular de 56 px (relleno Violeta Profundo, borde 1,5 px Tinta Violeta, inicial en Bricolage 24 px, `aria-hidden`), nombre en 20 px 800 y debajo ubicación y "N anuncios en Kambio" en Tinta Suave. Sin foto de perfil.

### Gallery
Marco de 520 px de alto, esquina 16 px, filete de 1,5 px, foto `object-cover` (nunca tratada); sin foto o con error de carga, halftone con texto alternativo; el sello grande cubre el centro si está vendido. Admite varias fotos con fila de miniaturas (rejilla de 4, 120 px de alto, esquina 12 px, borde violeta en la activa), pero la API da una sola foto y hoy no se muestra ninguna miniatura.

### Halftone (signature, uso restringido)
Trama de puntos violeta (radio 2,2 px, paso 11 px; variantes fina 8 px y gruesa 14 px, elegida por `id` del producto) sobre Pliego Alto. Significa únicamente "esta foto falta o no carga" y lleva `role="img"` con texto alternativo. No se usa como decoración, fondo ni estado de carga: el skeleton es un bloque liso en Pliego Alto con pulso (solo si el usuario no pidió movimiento reducido).

### Wave field (signature, ambiental)
Un lienzo fijo detrás de todo el contenido. Solo mientras el puntero se mueve dibuja papel pautado (líneas de 1,5 px cada 26 px) deformado por ondas circulares alrededor del cursor, en dos pasadas como el resto del mundo: Violeta Profundo (al 75 %, desplazada 4 px) debajo y Tinta Violeta (al 90 %) encima. Una máscara de degradado radial de 460 px lo desvanece hacia los bordes; a los 1,6 s sin movimiento se desvanece y el bucle se detiene. No se dibuja con `prefers-reduced-motion`. No recibe eventos y es invisible a lectores de pantalla.

### Panels (error, vacío, sin resultados)
Contenedor de 576 px máximo, esquina 16 px, padding 24 px, titular Bricolage 24 px. Error = Pliego con filete sólido; vacío y sin resultados = filete punteado, sin relleno. Acción primaria violeta o de contorno. Mis ventas reutiliza el panel de error (con "Reintentar" primario) y un panel de invitación punteado para la persona sin anuncios.

### Motion
Entrada de tarjetas `print-in` (0,7 s, ease-out-expo, la segunda pasada parte a 11 px y se asienta en 4 px, con subida de 8 px y fundido); `register-slam` al señalar una tarjeta (0,55 s); transiciones de color de 150 a 200 ms. Todo el movimiento de precios usa ease-out-expo, nunca rebote. Con `prefers-reduced-motion`: se anulan la entrada, el `register-slam` y la transición del registro (el encaje pasa a ser instantáneo), el levantamiento y el escalado de la tarjeta, y la transición y traslación de la plancha de caja de buscador y botón (todo bajo `motion-safe`; la sombra sí se anula al instante), el pulso del skeleton y el campo de ondas.

## Do's and Don'ts

### Do:
- **Do** limitar la paleta a papel, pliegos, las tres tintas violeta, las tres tintas neutras y el ámbar de atención (pendiente, error, aviso) definidos arriba.
- **Do** dar segunda pasada solo a logotipo, precios, buscador y botones primarios (`PRIMARY_BUTTON`) con la plancha de caja de 4 px, y encajarla a 0 al enfocar, señalar o pulsar. Las acciones secundarias van de contorno y sin plancha (`SECONDARY_BUTTON`).
- **Do** resolver confirmaciones dentro del panel (bloque con borde violeta sólido) y marcar con filete punteado todo aviso sin acción disponible.
- **Do** codificar cada estado de venta con color y forma a la vez (lleno, con borde, punteado); lo vendido además lleva sello y precio tachado sin tintas.
- **Do** mantener precio en Bricolage 800 con cifras tabulares, y alinear las etiquetas de estado con altura de nombre fija.
- **Do** usar bordes de 1,5 px y un anillo de foco visible de 2 px Violeta Claro en todo elemento interactivo (el buscador lo sustituye por el borde violeta y el asiento sobre su plancha).
- **Do** marcar todo error con ámbar más texto (en los campos, además borde e icono de aviso), llevar el foco al primer campo inválido y devolverlo a la contraseña tras un login fallido. Lo informativo va con borde violeta, no con ámbar.
- **Do** mover con ease-out-expo y sin rebote; respetar `prefers-reduced-motion`.
- **Do** mostrar el precio de la vista previa liso ("— €") hasta que exista un precio válido, y dibujar la foto elegida en un lienzo, nunca con una URL de objeto.
- **Do** contar antes de publicar lo que cambia el precio (nota llana y ayuda del campo) y confirmarlo después en el aviso informativo violeta de la ficha.
- **Do** presentar listas de gestión como filas planas separadas por filetes de 1,5 px bajo una cabecera de columna con la etiqueta de estado (forma y color), no como tarjetas anidadas.
- **Do** confirmar en línea, dentro de la fila, toda acción que no se puede deshacer: frase que dice qué pasará, botón "Sí, …" primario y "Volver" como enlace.
- **Do** mantener marcado, con contorno violeta de 2 px hacia dentro, lo que ha cambiado de sitio hasta que el puntero o el foco lo alcancen.
- **Do** decir solo lo que la API sabe ("comprador nº N") y calcular los resúmenes ("Has vendido N artículos por X €") a partir de datos reales, ocultándolos cuando no hay ventas.
- **Do** distinguir la voz propia de la ajena en una conversación por relleno y por lado a la vez (violeta con texto Papel Negro a la derecha; Pliego Alto con filete a la izquierda), con la esquina inferior plana del lado de quien habla y la hora bajo cada burbuja.
- **Do** mantener el desplazamiento del registro en su sitio si la persona está releyendo, y llevarlo abajo solo si ya estaba cerca del final o acaba de enviar.
- **Do** avisar de una conexión perdida con texto (franja ámbar con filete superior), nunca solo con color, y conservar el borrador si un envío falla.
- **Do** repetir el patrón de campo (etiqueta 15 px en 600, campo con borde Tinta Tenue al 60 %, ayuda o error de 14 px) en todo control nuevo de formulario.

### Don't:
- **Don't** usar el halftone como adorno, fondo o estado de carga; es la marca de "sin foto".
- **Don't** teñir, atenuar, filtrar ni tramar una foto real; solo el sello de "Vendido" puede cubrirla. El campo de ondas va siempre detrás.
- **Don't** usar sombras difusas, de elevación ni con desenfoque; la única sombra de caja es la plancha dura de 4 px en Violeta Profundo.
- **Don't** extender la plancha a chips, tarjetas, paneles, avisos, botones secundarios ni enlaces sin decidirlo como cambio de sistema.
- **Don't** abrir una ventana modal para confirmar la compra; la confirmación es en línea.
- **Don't** añadir una segunda tinta cromática (azul, verde, rosa, ni rojo para errores) ni usar ámbar para algo que no sea atención (pendiente, error, aviso), ni dejar que el ámbar sea la única señal.
- **Don't** usar Inter ni una fuente de sistema como cara de título.
- **Don't** copiar el aspecto de marketplace oscuro genérico: tarjetas grises redondeadas con sombra suave.
- **Don't** darle segunda pasada a un precio que aún no existe, ni hacer interactiva la vista previa: es una muestra, no un enlace.
- **Don't** anidar tarjetas dentro de las columnas de Mis ventas ni ponerles plancha, sello o matrícula de precio: el tablero es plano.
- **Don't** anidar tarjetas dentro de la bandeja del chat ni darles plancha: las conversaciones son filas planas separadas por filetes, y la fila activa solo cambia de relleno.
- **Don't** poner plancha, segunda pasada ni sombra a las burbujas, ni teñir la burbuja ajena de violeta: el violeta del chat es de quien escribe.
- **Don't** usar ámbar para la nota de reglas de precio; lo informativo va con filete neutro o violeta.

## Known drift (no canonizado)

- Los botones de los paneles (`Reintentar`, "Subir producto" del panel vacío, `Quitar filtros`) miden 44 px, sin plancha, frente a los 48 px con plancha del botón de cabecera. Inconsistencia previa a esta ronda, no reparada.
- Buscador y campos de formulario usan Tinta Tenue al 60 % en reposo; tarjetas, chips y pestañas usan Filete. Es la convención de los controles de entrada, pero no está unificada con el resto de bordes.
- Las tablas de ramas tonales del sidecar son sintetizadas por mezcla, no definidas en el código; solo existen los once valores de `@theme`.
- Las seis pantallas previstas están construidas. El compositor del chat no reutiliza `TextField`: repite a mano superficie, borde, esquina y foco de la variante multilínea, pero sin etiqueta visible y con marcador de posición, al contrario que los demás campos del sistema.
- Mensajes introduce un tamaño de 12 px (Micro y Day Label) fuera de la rampa anterior, que no bajaba de 13 px. Se registra por repetirse en hora de mensaje, tiempo de fila, separador de día, ayuda y contador del compositor.
- Los paneles vacíos de la zona derecha del chat llevan un título en Headline (24 px) y una frase, no solo una frase; "Cargando…" también usa Headline. Los errores del chat no son uniformes: la bandeja usa caja con borde ámbar (8 px, 15 px), la conversación texto en Tinta Suave sin ámbar con "Reintentar" primario de 44 px con plancha, y el anuncio un enlace de texto "Reintentar" sin plancha. Se suma a la inconsistencia de botones de panel ya registrada.
- La franja de conexión perdida y el error de la bandeja repiten el ámbar a mano (franja de 14 px, caja de 15 px), sin usar `FormAlert`, y no llevan icono de aviso.
- La línea de ayuda del compositor expone el mecanismo ("se actualiza solo cada pocos segundos"); es texto provisional hasta que lleguen los WebSockets, no una regla de lenguaje.
- La fila de la bandeja usa dos tamaños de texto de 14 px en Tinta Suave y Tinta Tenue para producto y último mensaje, y el tiempo relativo de 12 px; la separación entre producto y mensaje depende solo del tono de gris.
- El chat no tiene indicador de no leídos, ni en la bandeja ni en el enlace "Mensajes" de la cabecera: limitación del producto, no decisión visual.
- La burbuja propia es una gran superficie de Tinta Violeta con texto Papel Negro, un uso del violeta como relleno de interfaz mayor que el de botones y etiquetas; es deliberado (la tinta es de quien escribe) y no se extiende a otras superficies.
- Mis ventas introduce un botón primario de 40 px con texto de 15 px (con plancha) que no existía; se registra como `button-primary-compact` por usarse en tres sitios de la fila. Se suma a las alturas de 44, 48 y 56 px ya existentes.
- El error de una acción de pedido en Mis ventas es solo texto ámbar de 15 px bajo la fila, sin borde ni icono de aviso, con otro formato que `FormAlert` (con borde y esquina de 8 px) y que el error de campo (con icono). La señal es legible por texto, pero no es idéntica a las demás.
- La fila marcada añade 12 px de padding lateral al activarse el contorno, así que el contenido de la fila se desplaza 12 px al marcarse y al verse. Es un salto de maquetación del build, no una regla.
- El panel de error y el de invitación de Mis ventas repiten a mano la forma de los paneles del listado (esquina 16 px, 576 px, Headline) sin componente compartido; el de error usa `PRIMARY_BUTTON` de 44 px con plancha, como el de la ficha.
- El precio tachado de la fila usa línea de 2 px, frente a los 3 px de la tarjeta y los 4 px de la ficha; el filete de la cabecera de columna usa Tinta Tenue al 50 % en vez de Filete como el resto de filetes divisorios.
- La frase resumen de Mis ventas (18 px, 28 px de interlineado) y el total de la cabecera de columna (15 px) no están en la rampa; el total repite la cifra de la frase resumen.
- Mis ventas depende de datos que la API no da: no hay nombre del comprador (se muestra "comprador nº N"), y el tablero no ofrece borrar ni editar anuncios ni "mis compras". Limitación del producto, no decisión visual.
- "Reintentar" en el error de la ficha usa `PRIMARY_BUTTON` (con plancha, 44 px) mientras que el de listado no lleva plancha; refuerza la inconsistencia ya registrada de botones de panel.
- El botón secundario (borde Tinta Tenue al 70 %, hover violeta) y el outline del listado (Tinta Tenue, hover Tinta Clara) son dos variantes de lo mismo. Pendiente de unificar.
- El enlace de categoría de la ficha usa padding 4 x 14 px frente a los 6 x 14 px de los chips del listado.
- Tamaños de texto fuera de la rampa original pero repetidos: 20 px en 800 (avisos y nombre del vendedor) y 18 px (descripción y botón grande). Se registran como Notice Title y Description por repetirse en el build.
- Una sombra dura de desplazamiento fuera de un mundo neobrutalista puede leerse como defecto; aquí se registra solo porque es la plancha de registro del propio mundo riso, acotada por The Plate Only Rule. Si el mundo cambia, la regla caduca.
- El lema aparece dos veces en `/login` y `/registro`: bajo el logotipo de la cabecera (14 px) y como Hero (80 px). Repetición del build, no una regla.
- Las pestañas de acceso llevan padding 6 x 16 px frente a los 6 x 14 px de los chips que imitan (y los 4 x 14 px del enlace de categoría).
- El error de compra de `BuyPanel` repite a mano el patrón de `FormAlert` (texto 16 px frente a 15 px, mismo ámbar y 8 px de esquina) en lugar de usar el componente; y ambas alertas miden 8 px de esquina frente a los 12 px de los bloques de aviso de la ficha.
- La zona de la foto muestra el error con borde y mensaje ámbar pero sin el icono de triángulo que llevan los campos de texto (`TextField`); el aviso es legible por texto, pero la señal no es idéntica.
- La zona de la foto repite a mano la etiqueta (15 px, 600), la ayuda y el borde de `TextField` en lugar de reutilizarlos, y el área del campo de categoría usa el `datalist` nativo, cuyo desplegable y flecha los dibuja el navegador fuera de la paleta.
- El precio de la vista previa muestra el precio con la regla de categoría ya aplicada (réplica en `utils/pricing.ts` de `backend/services/pricing.py`) y la nota de reglas repite sus valores como texto fijo: si el servidor cambia una regla, hay tres sitios que actualizar. La vista previa avisa de que es una muestra.
- La ayuda de la descripción mezcla el texto de orientación con el contador de caracteres en una sola línea, en lugar de separarlos.
- La nota de reglas de precio (esquina 8 px, 15 px) y el aviso "Anuncio publicado" comparten forma con `FormAlert` y con el error de compra; todas las alertas de formulario siguen en 8 px frente a los 12 px de los bloques de aviso de la ficha.
