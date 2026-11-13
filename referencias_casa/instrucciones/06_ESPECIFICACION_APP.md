# Definición de producto: aplicación local para levantar, diseñar y presupuestar

## Tecnología
Adaptarse al stack del repositorio actual, preferentemente web local (React/TypeScript/SVG o equivalente). No imponer migración que destruya el trabajo. Todo deberá poder ejecutarse localmente sin cuenta de terceros; la búsqueda en línea es opcional para precios.

## Objetos del modelo
`Zona` (`id`, `nombre`, `categoria`, `poligono_px`, `poligono_m` nullable, `nivel`, `fuente`, `estado`, `notas`);
`Medida` (`id`, `valor`, `unidad`, `segmento_ref`, `fuente`, `confianza`, `validada_por`);
`Abertura` (`id`, `tipo`, `muros_ref`, `ancho`, `alto`, `posicion`, `fuente`, `estado`);
`PuntoElectrico` (`id`, `tipo`, `zona`, `caja_existente`, `mecanismo_instalado`, `circuito_ref` nullable, `evidencia`);
`Canalizacion` (`id`, `desde`, `hasta`, `diametro`, `material`, `recorrido_m` nullable, `ocupacion`, `continuidad`, `reutilizable` nullable, `inspeccion`);
`EquipoCarga` (`id`, `zona`, `nombre`, `potencia`, `unidad`, `voltaje`, `placa`, `uso`, `futuro`);
`Circuito` (`id`, `cargas`, `puntos`, `trayectoria`, `calculo`, `proteccion`, `estatus_aprobacion`);
`Material` (`id`, `especificacion`, `cantidad`, `unidad`, `evidencia`, `categoria_estado`, `aprobado`);
`Oferta` (`material_id`, `proveedor`, `url`, `precio`, `fecha`, `iva`, `envio`, `stock`, `certificacion`, `compatible`).

## Requisitos UX
Panel 'Datos conocidos / Inferidos / Pendientes'; prohibir que una celda nula se muestre como cero. Editor que no altere fuente original. Capas: arquitectura relativa, arquitectura métrica validada, pasillos, escaleras, puertas/ventanas, cajas existentes, ductos existentes, puntos propuestos, circuitos, alimentación/medidor, protecciones, puesta a tierra.

## Compatibilidad y persistencia
Importar JSON del paquete sin perder los IDs de las 12 zonas. Guardar cambios y hacer undo/redo. SVG y PNG exportables; CSV BOM y cargas. Al modificar dimensiones métrica verificada, actualizar rutas y cantidades DERIVADAS, no la evidencia original. Mantener trazabilidad por archivo y región.

## Error handling
Si no hay evidencia suficiente de distancias o configuración del suministro, bloquear funciones de 'generar compra final', 'diagrama unifilar ejecutivo', 'calibre aprobado'. Permitir borradores visiblemente etiquetados `ANTEPROYECTO – SIN VALIDAR`.
