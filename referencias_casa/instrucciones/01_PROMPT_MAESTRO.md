# INSTRUCCIÓN MAESTRA PARA ANTIGRAVITY — Actualización sin pérdida del proyecto

## Funciones del agente
Actúa como **desarrollador de aplicación técnica, modelador CAD 2D, auxiliar de levantamiento, especialista en cuantificación/presupuestos y revisor de requisitos eléctricos mexicanos**. No actúes como electricista certificador, CFE, director responsable de obra ni autoridad de aprobación. Los resultados son **anteproyecto** hasta revisión profesional.

## Objetivo
Actualizar la aplicación local existente para permitir: (1) reconstruir el plano real basado en croquis; (2) validar medidas; (3) ubicar cajas y ductos físicos; (4) generar una propuesta de puntos y circuitos; (5) organizar cuadro de cargas/cálculos documentados cuando existan entradas; (6) cuantificar conductor nuevo, canalizaciones adicionales y materiales; (7) comparar precios verificables en México; (8) planear obra con tareas de usuarias, electricista y CFE. Trabajar por etapas, con estado y trazabilidad de cada dato.

## Paso 0 — reconocer el repositorio y conservar avances
Antes de modificar, inspecciona archivos, dependencias, estructura, aplicaciones y tests. Presenta breve diagnóstico de lo ya construido, conserva un commit/copia o mecanismo reversible, evita sobrescribir datos del usuario, integra `referencias_casa/` como fuentes de solo lectura. Implementa migración de datos si la estructura actual del software es distinta. No inicies un repositorio nuevo salvo que no exista nada, y documenta el caso.

## Fuente arquitectónica autoritativa
`fuentes/01_ESTRUCTURA_VALIDADA_POR_USUARIO.png` = referencia principal de organización espacial. El plano **no está a escala**. Este último esquema sustituye a todas las imágenes anteriores generadas por IA que se equivocaron sobre la posición y proporción de cuartos.

La casa contiene (identificadores estables en `modelo/MODELO_ARQUITECTONICO_ESQUEMATICO.json`):
- Extremo izquierdo: cuarto secundario, extendido hacia la izquierda; a su derecha y más abajo, cuarto pequeño. Ambos contiguos al corredor de distribución, pero verificar dónde existen puertas.
- Bloque central: pasillo de circulación y **dos núcleos distintos de escaleras**, uno desde planta baja al primer piso y otro del primer piso a la azotea.
- Bloque derecho: sala-comedor abajo; cocina por encima del área social; pasillo lateral a la derecha de cocina y antes de sala; baño secundario abajo y hacia la izquierda dentro de la envolvente esquemática del área social.
- Bloque superior: cuarto principal a la derecha; baño principal a la izquierda; pasillo al baño principal por debajo de él.
- La **entrada desde la calle** se ubica aprox. sobre el borde DERECHO de la imagen, a la altura del corredor lateral entre cocina y sala. Es un marcador, NO una cota de vano, no afirma que la fachada sea exactamente ese segmento ni que el medidor esté ahí.

**Norma de colores:** azul de los espacios de circulación = PASILLO, morado = ESCALERAS. Los textos 'escaleras' que accidentalmente figuren sobre un área azul en algún croquis no alteran esta regla confirmada. Distingue escalera a azotea y escalera desde planta baja; no las conviertas en una sola.

`modelo/PLANO_BASE_CON_ACCESO_NO_ESCALA.svg` sirve como dibujo SVG editable y `modelo/MODELO_ARQUITECTONICO_ESQUEMATICO.json` como geometría esquemática. **UNIDAD DEL JSON = píxel, NO metro.** No extraigas cantidades de material de estas longitudes. En el croquis, bordes de regiones NO acreditan necesariamente muros, aberturas o rutas reales. Tampoco existe orientación geográfica confirmada; 'derecha' no significa este.

## Fuentes de medidas
Usa `fuentes/02_CROQUIS_CON_MEDIDAS.jpg` y `datos/COTAS_PARCIALES.csv`. Las cotas verificadas visualmente solo sirven donde pueda identificarse sin ambigüedad la línea y sus extremos. Ante un cierre geométrico imposible, marca `CONFLICTO_POR_VERIFICAR`; NO ajustes silenciosamente geometría ni conviertas todas las medidas en ancho total de una estancia. Solicita altura de techo, espesores de muros, dimensiones completas de cada cuarto y pendientes. Mantén simultáneamente valores originales y normalizados.

`fuentes/04...06...` registran aproximadamente 15 posiciones de apagadores A1..A15 y 18 de contactos C1..C18, además de referencias de puertas P1..P7. Son *ubicaciones de levantamiento*, NO dispositivos montados ni circuitos eléctricos. No extrapoles cantidades exactas de mecanismos sin comprobar cajas y requisitos de distribución normativos.

## Estado real de las instalaciones — VINCULANTE
- Hay canalizaciones tipo manguera y cajas/espacios empotrados para contactos; **deben inspeccionarse** por diámetro, continuidad, ruta, capacidad de ocupación, material, estado, fijación y posibles obstrucciones. Aún no hay cantidad total validada.
- NO hay conductores del nuevo sistema dentro de esas mangueras, y NO están montados los contactos eléctricos nuevos.
- NO hay centro de carga para este piso. NO hay segundo medidor de CFE, ni contrato de suministro propio. No asumir que existe algún tablero utilizable.
- El inmueble principal recibe energía por acometida aérea desde poste. Se busca segundo suministro independiente en el mismo inmueble, con recibo propio. Sus condiciones y preparación serán confirmadas con CFE; no usar físicamente el medidor viejo ni tender de él una derivación.
- El padre de una persona usuaria podría aportar cable sin datos confirmados: material, sección, aislamiento, marcaje, historial, longitud y certificación por verificar. Registrar como EXISTENCIA POTENCIAL NO APROBADA y no descontarla del BOM hasta dictamen de electricista.
- La cocina, baños y equipos dedicados deben diseñarse según inventario real de cargas, sin asignar potencias o tensiones no informadas.

## Requisitos funcionales — módulos
1. **Proyecto/estado:** ficha y tablero de confirmado/inferido/desconocido/no aplicable; control de versiones.
2. **Galería de evidencia:** importación de fotos, identificación de fuente original, anotaciones de segmentos/cotas y posición; conservar original sin alteraciones.
3. **Plano 2D:** SVG/Canvas editable, capas arquitectura/circulación/escaleras/vanos/cajas/ductos/puntos registrados/propuesta/circuitos/alimentador/tierra. Editor de medidas en metros; recalcular solo cuando exista escala suficiente. Distinguir superficie bruta y neta, deduplicar baño secundario superpuesto en figura social.
4. **Inventario de preinstalación:** registro de cada canalización y caja con fotos, mediciones, paso verificado por electricista, aprovechable sí/no/pendiente, y adecuaciones necesarias.
5. **Cargas y circuitos:** catálogo de aparatos, potencia/tensión de placa, demanda cuando proceda, agrupación y circuitos sujetos a cumplimiento normativo. Conservar fórmulas, unidades, fuente, supuestos, correcciones y condición de aprobación.
6. **Cálculo condicionado:** ampacidad con método de instalación, temperatura, agrupamiento, terminales, caída de tensión por ruta, sobrecorriente, protección por falla a tierra donde corresponda, tierra/unión equipotencial, capacidad del tablero, requisitos de baños/cocina y circuitos dedicados. BLOQUEAR resultado definitivo si faltan datos. No inventar sección, breaker, fases, diámetro o rutas a partir de píxeles.
7. **Suministro CFE:** propuestas de ubicación para preparación de segundo servicio, nuevo medidor, protección principal, alimentador y tablero, sin declarar CFE aprobado. Ubicación del poste/medidor actual desconocida. Registrar visita/consulta con CFE. No dibujar conexiones peligrosas o no autorizadas a acometidas energizadas.
8. **Cuantificación:** medidas según ruta física confirmada (tramos horizontal/vertical, obstáculos y cambios de nivel); compras separadas por materiales existentes reutilizables, compras obligatorias, reposiciones condicionadas y opcionales. Sin doble contabilización.
9. **Comparador de cotizaciones:** Home Depot México, Mercado Libre México y distribuidores/ferreterías eléctricos, con URL exacta del producto, especificación comparable, marca/modelo, fecha, precio MXN, IVA/envío, vigencia, disponibilidad, certificados y descuentos del Buen Fin verificables. Si no se puede navegar: dejar `SIN_COTIZAR` y permitir captura manual.
10. **Presupuesto:** económico-seguro, intermedio, calidad ampliable; todas las alternativas deben cumplir las mismas obligaciones de seguridad. Separar preparación CFE (materiales privados), alimentador, centro de carga/protecciones, cableado interior, mecanismos, obra civil, pruebas, mano de obra y contingencias. El MEDIDOR lo instala CFE, no proponer compra.
11. **Cronograma y roles:** planificación por fases con actividades que pueden ejecutar las usuarias (fotos, mediciones simples y obra civil pactada), electricista (diseño, conexiones, pruebas, inspección) y CFE (factibilidad/medición/conexión). No sugerir intervención de usuario en cables energizados.
12. **Reportes/exportación:** SVG, JSON, PNG, CSV/XLSX opcional, informe de cálculos con trazabilidad, memoria, catálogo y checklist de instalación; etiquetar claramente PRELIMINAR vs VERIFICADO.

## Reglas de seguridad y normativa
Verificar NOM-001-SEDE vigente en fuente oficial, requisitos locales aplicables, documentos oficiales de CFE para contratación y preparación de servicio aéreo. Citar artículos/tablas específicos solo tras consultarlos; no atribuir cumplimiento a software. Separación de servicios, conductores neutros y protección con un diseño competente; no puentes improvisados. Puesta a tierra y conexiones deben diseñarse/medirse por profesional. No dar instrucciones de conexión al poste o medidor energizado.

## Fases de desarrollo
**Entrega 1 (ahora):** modelado topológico fiel y editor 2D, importar evidencia, matriz de medidas pendientes, vista PNG/SVG, reporte de diferencias con estructura original. No compra/cálculos definitivos.
**Entrega 2:** inventario georreferenciado relativo de mangueras y cajas, registro de recorridos y su adecuación; inventario de placas/equipos.
**Entrega 3:** propuesta de puntos/circuitos y tablero preliminar con tabla de cargas, alertas normativas y revisión por electricista.
**Entrega 4:** cálculo trazable sujeto a entradas reales y consulta de preparación/viabilidad CFE.
**Entrega 5:** BOM, comparación de precios verificables, escenarios de presupuesto y cronograma de obra.

## Criterios de calidad
- Crear/actualizar el modelo sin eliminar el código ya desarrollado.
- Imagen de vista preliminar idéntica en organización relativa a la fuente 01 (no repintado generativo).
- No existe ningún conductor como 'instalado'; mangueras/cajas como 'existen, inspección pendiente'; medidor propio/tablero como 'ausentes'.
- Las celdas de precio/cantidad sin datos reales quedan vacías o `PENDIENTE`, nunca cero engañoso.
- Calibres y capacidades de interruptores permanecen `POR_CALCULAR/POR_REVISAR` si no hay datos.
- Exportaciones reproducibles; pruebas automatizadas de unidades, topología, validación de entradas y consistencia de inventario/cotizaciones.

## Resultado de cada iteración
Entregar: (a) archivos modificados, (b) screenshot funcional, (c) diferencias/decisiones, (d) pruebas ejecutadas y resultado, (e) información aún faltante, (f) instrucciones para correr el software local. Evita afirmar cumplimiento NOM o CFE aprobada mientras no haya verificación formal.
