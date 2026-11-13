# Reglas del motor de cálculo eléctrico

1. **Datos base obligatorios** por equipo: carga/VA o potencia y factor de potencia cuando proceda, tensión/placa, uso, ubicación, equipo futuro/actual y simultaneidad normativamente sustentada. Nunca suponer las cargas por cantidad de habitantes.
2. **Circuito**: destino, puntos y carga asociada, tensión, configuración de suministro conocida, ruta física definida, condiciones de instalación, temperatura y agrupamiento; verificar requisitos normativos específicos (cocina, baño, lavado, alumbrado, contactos y equipos especiales).
3. **Conductor**: no seleccionar sección por intuición ni solo por breaker. Aplicar tablas y factores que correspondan según NOM, material, aislamiento, terminales, método, llenado, agrupamiento, caída de tensión y protecciones.
4. **Protección**: coordinación de protecciones, dispositivo principal y termomagnéticos, y dispositivos de protección de falla a tierra/diferencial cuando corresponda, con ratings y ubicación validados. Distintos dispositivos protegen riesgos distintos.
5. **Tierra y unión**: documentar esquema de servicio, unión equipotencial, conductor de protección, conexión a electrodos y verificaciones; una varilla por sí sola no garantiza una puesta a tierra correcta.
6. **Canalización existente**: reutilizable solo tras inspección de continuidad, trayectoria, capacidad, ocupación, material y estado. Si no se verifica, mantener sin cuantificar la diferencia.
7. **Resultado** por cálculo: dato, origen, unidad, fórmula normativa, numeral o tabla verificada, supuestos, resultado, dictamen, revisor y fecha.
8. **Bloqueo crítico**: si falta cualquier dato necesario para escoger conductor, interruptor, mufa, base, cantidad de fases, tablero o distancias, mostrar `NO DETERMINADO – FALTA INFORMACIÓN` y listado de campos. El software puede mostrar escenarios ilustrativos, pero nunca recomendaciones aprobadas.
9. **Pruebas**: entradas 0 / nulas, rutas superpuestas, ausencia de placas, circuito sin cargas, discrepancia de unidades, cotas contradictorias y productos que no cumplen certificación.
