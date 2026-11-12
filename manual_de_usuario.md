# Manual de Usuario y Operación de la Aplicación VoltHome CDMX
## Sistema de Modelado, Cálculo y Presupuesto Eléctrico Residencial
**Versión:** 1.0 (Noviembre 2026)  
**Norma:** NOM-001-SEDE-2012 / Especificaciones CFE Baja Tensión  

---

### 1. ¿Cómo Iniciar la Aplicación en tu Computadora?

La aplicación está diseñada para ejecutarse 100% de manera local, sin necesidad de conexión a internet para funcionar ni pagos de licencias.

#### Opción Rápida (Recomendada en Windows):
1. Abre tu carpeta `C:\Users\rodri\Downloads\Casa`.
2. Haz doble clic en el archivo **`iniciar_aplicacion.bat`**.
3. Se abrirá una ventana de consola y tu navegador web se abrirá automáticamente en:  
   👉 **`http://localhost:5173`**

#### Opción Manual por Terminal:
Si prefieres iniciarla manualmente:
```powershell
cd C:\Users\rodri\Downloads\Casa
python -m http.server 5173 --directory electro-modeler/dist
```
Y abre `http://localhost:5173` en Google Chrome, Microsoft Edge o Mozilla Firefox.

---

### 2. Estructura y Navegación de los 7 Módulos

La barra superior contiene los indicadores principales (Superficie en m², Demanda diversificada en kVA, Tipo de suministro CFE y Alimentador sugerido) junto a los botones de acción global (**Abrir**, **Guardar**, **Exportar DXF**, **CSV Presupuesto**, **Reporte PDF**).

Justo debajo se encuentra el menú con los 7 módulos del sistema:

#### Módulo 1: Proyecto y Estado
- Contiene la ficha técnica general del inmueble (ubicación en CDMX, 2 ocupantes, Planta Alta).
- Selector del tipo de servicio CFE: Puedes alternar entre **2F-3H (120/240V Bifásico recomendado)** y **1F-2H (120V Monofásico)** para comparar el impacto en el calibre del alimentador y el balance de cargas.
- Semáforo de Certeza Técnica (Confirmado vs Inferido vs Pendiente).
- Resumen de hallazgos críticos de seguridad detectados en la inspección visual (alerta sobre el poliducto naranja en losas).
- Checklist interactivo de validaciones previas a compras.

#### Módulo 2: Fotografías (51 Fotografías Reales)
- Galería visual completa que alberga las 51 fotos tomadas en el inmueble.
- Filtros por las 10 categorías normativas y por estado de verificación.
- Buscador por texto libre (busca por "baño", "escalera", "poliducto", "estadal", etc.).
- Al hacer clic en cualquier fotografía se abre un **visor interactivo con zoom** y la **Ficha Técnica de Ingeniería**, donde se desglosan:
  - Espacio representado
  - Elementos eléctricos visibles
  - Posibles trayectorias de canalización
  - Materiales de muros y losas
  - Obstáculos constructivos
  - Riesgos eléctricos y referencias de la NOM-001-SEDE-2012
  - Referencia métrica identificada (azulejos, estadal topográfico, cubeta)
  - Tareas pendientes de inspección física.

#### Módulo 3: Plano Eléctrico 2D (Editor CAD)
- Lienzo interactivo vectorizado con cuadrícula métrica (cuadros mayores de 1.0 m, menores de 0.5 m).
- Controles de zoom (+, -) y desplazamiento (arrastrar con el ratón).
- Filtros de capas (Capas A a J): Puedes ocultar o mostrar la arquitectura, luminarias, contactos generales, cocina, baños, ductos o alimentador CFE.
- **Herramienta Regla de Medir:** Haz clic en *"Regla de Medir"*, haz clic en un punto A y luego en un punto B para ver la distancia exacta en metros reales.
- **Edición dimensional de habitaciones:** Haz clic en cualquier habitación (por ejemplo, *Recámara 1* o *Sala-Comedor*); en el panel derecho introduce las medidas exactas de ancho y largo que tomes con tu flexómetro en obra. Si ya comprobaste la medida, desmarca la casilla *"Medida Provisional"*.
- **Edición de elementos eléctricos:** Haz clic en cualquier símbolo eléctrico (lámpara, apagador, contacto, medidor) para editar su altura sobre piso terminado, su nombre o asignarle otro circuito.
- **Exportación:** Botón para descargar el plano en **SVG vectorial** y en **DXF universal** compatible con AutoCAD, Revit o LibreCAD.

#### Módulo 4: Cargas y Diagrama Unifilar
- **Cuadro de Cargas:** Tabla técnica con los 6 circuitos proyectados (C1 Alumbrado, C2 Contactos Generales, C3 Cocina Barra, C4 Cocina Refri/Micro, C5 Baños GFCI, C6 Reserva Lavado), desglosando fase (L1/L2), interruptores (15A/20A), calibre de conductor, metros de recorrido, caída de tensión calculada (% e) y si requiere protección diferencial GFCI.
- **Diagrama Unifilar Interactivo:** Esquema unifilar vectorial completo que muestra la mufa aérea CFE a 4.80 m, la base de 5 terminales, el interruptor principal 2x40A, el electrodo de tierra Copperweld 5/8" x 3m, el alimentador de 16 metros y el centro de carga Square D QO-8 con barras aisladas.
- **Inventario Detallado de Cargas:** Tabla donde puedes agregar, modificar o quitar electrodomésticos, lámparas y aparatos para ver el recálculo instantáneo de la demanda según el Artículo 220 de la NOM.

#### Módulo 5: Materiales e Inventario
- **Control de Materiales Existentes:** Tabla para registrar los rollos de cable que ya se tienen (como el cable en la cubeta de la foto 9).
  * *Regla fundamental:* El botón *"✓ Aprobado para Uso"* solo debe activarse si un electricista realiza la prueba con megóhmetro y certifica que es 100% cobre y tiene aislamiento > 50 MΩ. En cuanto se activa, el metraje se descuenta automáticamente de la lista de compras.
- **Catálogo Cuantificado:** Más de 25 partidas clasificadas (Conductores, Canalizaciones, Cajas y Accesorios, Protecciones y Tableros, Dispositivos, Acometida CFE) con especificaciones técnicas, cantidades derivadas del plano 2D (+10% merma en ductos, +15% en cables) y estado de validación.

#### Módulo 6: Presupuesto y Proveedores
- **Comparativa de 3 Escenarios:**
  1. *Económico Seguro* (IUSA / Volteck / Bticino Modus / QO básico)
  2. *Intermedio Recomendado* (Condumex / Square D Schneider / Bticino Quinziño MX)
  3. *Mayor Calidad* (Viakon / Square D QO Plug-on / Leviton Decora Plus)
- Desglose por rubros: Materiales, Mano de obra, Obra civil (ranurados/resanes) y Trámites CFE.
- **Calculadora Buen Fin 2026:** Ajusta los deslizadores de descuento directo en tienda y bonificación con tarjeta de crédito para calcular el ahorro neto real en pesos frente al precio ordinario de lista.
- Comparativa por tienda: Home Depot México vs Tiendas Oficiales de Mercado Libre vs Distribuidores Mayoristas de CDMX.
- Botón **"CSV Presupuesto"** para descargar la hoja de cálculo lista para abrirse en Microsoft Excel.

#### Módulo 7: Memoria y Reportes
- Memoria técnica de cálculo completa con fórmulas KaTeX, artículos oficiales de la NOM-001-SEDE-2012 y especificaciones CFE.
- Plan de ejecución en 10 etapas con dependencias y alertas sobre qué materiales no deben comprarse antes de ciertas etapas.
- Checklist priorizado de inspección en obra.
- Botón **"Reporte PDF"** (o presionar `Ctrl + P`) para imprimir o guardar en archivo PDF con formato limpio ejecutivo.

---

### 3. Procedimiento para Guardar y Reanudar tu Trabajo

1. Conforme vayas midiendo habitaciones o actualizando datos en la aplicación, haz clic en el botón **"Guardar"** (icono de descarga) en la barra superior.
2. Tu navegador descargará un archivo con nombre:  
   `Proyecto_VoltHome_Instalacion_Electrica_Independiente.json`
3. Este archivo contiene **la totalidad de tus modificaciones**: medidas corregidas, elementos reubicados, nuevos aparatos y estado de aprobación de cables.
4. Para reabrir tu proyecto en otra ocasión o computadora:
   - Haz clic en el botón **"Abrir"** (icono de subida) en la barra superior.
   - Selecciona tu archivo `.json`.
   - La aplicación restaurará exactamente tu avance sin perder ningún dato.
