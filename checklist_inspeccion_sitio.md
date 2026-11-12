# Lista Priorizada de Información Pendiente de Inspección en Sitio
## Protocolo de Campo para Levantamiento y Validación Técnica
**Proyecto:** Instalación Eléctrica Independiente (Planta Alta, CDMX)  
**Fecha:** 8 de noviembre de 2026  

---

### Semáforo de Prioridades de Inspección:
- 🔴 **CRÍTICA:** Impide la compra de materiales o el trámite ante CFE si no se verifica previamente.
- 🟡 **ALTA:** Afecta el metraje exacto de conductores o la compatibilidad de montaje.
- 🟢 **MEDIA:** Ajustes de confort, mobiliario y acabados estéticos.

---

| Nivel | Elemento / Punto a Inspeccionar | Espacio en Obra | Herramienta Requerida | Observación Derivada de las Fotos | Acción Específica de Verificación |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 🔴 **CRÍTICA** | **Sondeo de poliducto naranja en losas** | Techos de Sala, Cocina, Pasillo y Recámaras | Guía de acero pasacables (cinta de jalado de 20 m) | En la foto 32 se observa poliducto corrugado naranja no certificado llegando a cajas octagonales. | Introducir la guía de punta a punta en cada registro de techo para constatar que el concreto no aplastó ni tapó la tubería. Si está obstruida, debe planearse tubería EMT sobrepuesta o ranura en aplanado. |
| 🔴 **CRÍTICA** | **Ubicación del 2° medidor en fachada** | Fachada exterior de Planta Baja (Nivel Calle) | Flexómetro de 5m y nivel | Las fotos 1 a 51 son de interiores; ninguna muestra la fachada exterior a nivel de banqueta ni el medidor existente. | Verificar que en el paramento exterior exista espacio libre contiguo al medidor 1 para montar la base de 5 terminales sin estorbar rejas o accesos peatonales. |
| 🔴 **CRÍTICA** | **Distancia y libramiento al poste de CFE** | Calle exterior frente al inmueble | Telémetro láser o medición a pasos | En la foto 38 se aprecian cables aéreos a través de la ventana de pasillo. | Medir la distancia horizontal desde la mufa proyectada hasta el poste de CFE. Debe ser menor a 30 metros. Constatar que el cable concéntrico no cruzará entre ramas densas de árboles. |
| 🟡 **ALTA** | **Levantamiento métrico con flexómetro** | Muros de todas las habitaciones | Flexómetro de 5 u 8 metros | En las fotos 33 y 36 se observa un estadal topográfico métrico que sirvió de escala provisional. | Medir con cinta métrica el ancho y largo exacto de cada recámara, estancia, pasillo y baños para sustituir las dimensiones provisionales en el plano 2D. |
| 🟡 **ALTA** | **Prueba de aislamiento en cable existente** | Cubeta blanca con cable (fotos 9, 17, 51) | Megóhmetro a 500V DC y calibrador de alambre | En fotos 9 y 51 hay conductores enrollados en una cubeta de 19 L. | Desenrollar los tramos, medir su longitud real, verificar con imán/corte que sea 100% cobre puro (no CCA) y someterlos a prueba con megóhmetro (> 50 MΩ a 500V). Solo si pasa la prueba se aprueba en el software para descontarlo de compras. |
| 🟡 **ALTA** | **Trayectoria del alimentador por escaleras** | Cubo de escaleras y descanso (fotos 12 a 16) | Flexómetro y detector de metales | Se identificó el tiro hacia azotea y el hueco con muros rosas hacia planta baja. | Trazar la ruta de subida del tubo conduit galvanizado de 1" desde la fachada, atravesando el descanso sin interferir con el paso de personas y sin ranurar castillos estructurales. |
| 🟢 **MEDIA** | **Espacio libre para contacto bajo espejo LED** | Baño 2 (Suite, fotos 39 y 43) | Flexómetro | En la foto 43 hay una chalupa metálica abierta directamente entre el borde del lavabo y la parte inferior del espejo LED. | Medir la distancia vertical libre para comprobar que quepa la placa del receptáculo GFCI sin rozar el monomando negro mate ni tapar el espejo. |
| 🟢 **MEDIA** | **Separación respecto a tuberías de gas** | Cocina (fotos 18, 28 y 29) | Flexómetro | Se observa una estufa de gas en tránsito en medio de la estancia. | Ubicar la salida definitiva de la tubería de gas LP o gas natural y garantizar que las chalupas de contactos eléctricos queden a más de 30 cm de distancia de válvulas y tuberías de gas. |

---

### Instrucciones para el usuario:
Conforme realices cada una de estas mediciones e inspecciones físicas en la casa:
1. Abre la aplicación en tu navegador (`http://localhost:5173`).
2. Actualiza las medidas de las habitaciones en el **Módulo 3 (Plano 2D)**.
3. Si el electricista aprueba el cable de la cubeta con megóhmetro, ve al **Módulo 5 (Materiales)** y haz clic en *"✓ Aprobado para Uso"*.
4. Descarga tu proyecto actualizado en JSON con el botón **"Guardar"**.
