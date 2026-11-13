# Criterios de aceptación que Antigravity debe demostrar

**Arquitectura:**
- [ ] Los 12 espacios del JSON mantienen sus IDs sin duplicados; **cuarto secundario** a la izquierda y **cuarto pequeño** a su derecha.
- [ ] Dos escaleras distintas y pasillos diferenciados; AZUL = pasillo, MORADO = escalera.
- [ ] Baño principal, cuarto principal y pasillo al baño arriba; cocina y corredor a su derecha; sala-comedor abajo; baño secundario bajo y próximo a escaleras.
- [ ] Acceso a la calle marcado como `aproximado` en el lado derecho cerca del pasillo cocina/sala; NO se dibujó un vano preciso sin medir.
- [ ] Ningún norte/orientación geográfica supuesta; píxeles NO convertidos a m.
- [ ] Sin áreas duplicadas por superposición del baño secundario en el polígono de sala.

**Preinstalación:**
- [ ] Mangueras y cajas registradas como `existentes, sujetas a inspección`.
- [ ] Conductores interiores nuevos y contactos montados registrados como `NO INSTALADOS`.
- [ ] Centro de carga propio y segundo medidor registrados `NO INSTALADOS`.
- [ ] Cable potencial del padre `SIN DATOS/SIN APROBAR`, no descontado del BOM.

**Ingeniería y seguridad:**
- [ ] Si faltan cargas, rutas, material, temperatura, tensión o protección, motor NO presenta calibres ni interruptores como definitivos.
- [ ] Segundo servicio separado del actual; SIN propuestas de conexión clandestina a red CFE.
- [ ] Cálculos guardan fórmulas, unidades, datos y fuente normativa, además de estado de revisión por electricista.
- [ ] Las compras de medidor CFE NO se incluyen en lista privada; preparación del servicio solo tras visto bueno CFE.

**Costos/operación:**
- [ ] BOM separa material existente, falta comprar y reposición condicionada.
- [ ] Precios sin URL/fecha se reportan SIN COTIZAR, nunca como reales.
- [ ] Tres presupuestos comparables y trazables; no omiten obligaciones de seguridad.
- [ ] Archivos en repo persistidos; exportación SVG/PNG/JSON/CSV válida; tests automáticos ejecutados.

**Entregables:** captura funcional, changelog, lista de bloqueos, preguntas de medida priorizadas y guía de ejecución local.
