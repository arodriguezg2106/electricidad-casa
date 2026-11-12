# Memoria Técnica de Cálculo y Diseño Eléctrico Residencial
## Proyecto: Instalación Eléctrica Nueva e Independiente (Planta Alta)
**Ubicación:** Ciudad de México (CDMX), México  
**Fecha:** 8 de noviembre de 2026  
**Normativa Aplicable:** NOM-001-SEDE-2012 / Especificaciones CFE-EM-BT101 / BT102  

---

### 1. Resumen Ejecutivo y Alcance

El presente proyecto comprende el diseño, modelado, cálculo y presupuestación de una **instalación eléctrica residencial completamente nueva, autónoma e independiente**, proyectada para abastecer un departamento en Planta Alta ocupado por 2 personas.

#### Características Fundamentales:
- **Suministro:** Segundo servicio independiente de CFE a partir de la red aérea de postes en la vía pública.
- **Medición:** Segundo watthorímetro independiente instalado en la fachada exterior a nivel de banqueta.
- **Configuración propuesta:** Bifásica **2 Fases - 3 Hilos (120/240 V AC, 60 Hz)** con neutro y conductor de puesta a tierra independiente (EGC).
- **Tablero general:** Centro de carga **Square D QO-8** (8 polos, 100 A) ubicado en Planta Alta, con barras aisladas para neutro y puesta a tierra.
- **Separación total:** Ningún circuito, neutro ni conductor de protección se comparte con la vivienda preexistente en planta baja.

---

### 2. Marco Normativo Oficial Mexicano

1. **NOM-001-SEDE-2012:** Instalaciones Eléctricas (utilización).
   - *Artículo 110-14:* Terminales y rango de temperatura de conductores.
   - *Artículo 210-8(a)(1) y 210-8(a)(6):* Protección obligatoria de falla a tierra (GFCI/ICFT clase A a 5 mA) en cuartos de baño y sobre cubiertas de cocina.
   - *Artículo 210-19(a) Nota 4:* Caída máxima de tensión en circuitos derivados del 3.0%.
   - *Artículo 210-52:* Separación y ubicación de contactos en unidades de vivienda.
   - *Artículo 215-2:* Dimensionamiento de alimentadores y caída máxima de tensión del 3.0% (5.0% combinado total).
   - *Artículo 220:* Métodos de cálculo de carga instalada y factores de demanda.
   - *Artículo 250:* Puesta a tierra, electrodo y separación en sistemas derivados.
   - *Artículo 310-15 y Tabla 310-15(b)(16):* Ampacidades de conductores de cobre en canalización.
   - *Artículo 362:* Restricciones de tubería conduit de polietileno no metálico (poliducto naranja).
2. **Especificación CFE-EM-BT102:** Acometida aérea para servicio bifásico a baja tensión.
3. **Especificación CFE GIC00-05:** Bases para medidores de energía eléctrica monofásicos y bifásicos.
4. **NMX-J-010-ANCE:** Conductores de cobre con aislamiento termoplástico THW-2-LS 90°C, 600 V.

---

### 3. Diagnóstico Técnico de la Inspección Visual (Fotografías)

Se examinaron las 51 fotografías del inmueble, arrojando los siguientes dictámenes:

1. **Estado constructivo:** Mampostería confinada con castillos y trabes de concreto armado. Losas de entrepiso y azotea en concreto armado aparente o repellado. Pisos terminados con loseta cerámica imitación duela de madera (60 × 20 cm) en áreas secas y cerámica gris en baños.
2. **HALLAZGO CRÍTICO (Poliducto Naranja en losa, Foto 32):** Se identificaron tuberías de poliducto corrugado naranja llegando a cajas octagonales de techo. Se clasificó como riesgo normativo bajo NOM Art. 362; es requisito ineludible realizar **prueba de sondeo con guía de acero** antes de cablear para descartar colapso durante el colado.
3. **Zonas Húmedas (Fotos 24, 39, 43):** Chalupas metálicas abiertas sobre lavabos y bajo el espejo LED en ambos baños. Requieren obligatoriamente receptáculos GFCI 20 A clase A para evitar riesgo de electrocución.
4. **Vertical del Cubo de Escaleras (Fotos 12 a 16):** Muestra el tiro hacia azotea y la abertura hacia planta baja (muros rosas). Representa la trayectoria idónea para subir el tubo conduit galvanizado de 1" del alimentador principal desde la fachada exterior hasta el centro de carga en Planta Alta.
5. **Acometida y Red Aérea (Foto 38):** Se confirma la visibilidad de la red aérea pública de postes por la ventana del pasillo, validando la factibilidad física de acometida aérea.

---

### 4. Memoria Numérica de Cálculo Eléctrico

#### 4.1. Superficie Construida y Carga de Alumbrado General
- Superficie interior calculada: **97.80 m²** (excluyendo fachada y descansos exteriores).
- Carga unitaria reglamentaria (NOM Art. 220-12): **33 VA/m²**.
- Carga mínima de alumbrado general = 97.80 m² × 33 VA/m² = **3,227.40 VA**.

#### 4.2. Circuitos Obligatorios para Pequeños Aparatos y Lavandería
- NOM Art. 220-52(a): 2 circuitos de cocina a 1,500 VA c/u = **3,000 VA**.
- NOM Art. 220-52(b): 1 circuito de lavandería = **1,500 VA**.
- **Subtotal básico:** 3,227.40 + 3,000 + 1,500 = **7,727.40 VA**.

#### 4.3. Demanda Máxima Diversificada (NOM Tabla 220-42)
- Primeros 3,000 VA al 100% = **3,000 VA**.
- Restante (7,727.40 - 3,000 = 4,727.40 VA) al 35% = **1,654.59 VA**.
- Demanda básica diversificada = 3,000 + 1,654.59 = **4,654.59 VA**.
- Cargas adicionales (Refrigerador 400 VA + Computadora 400 VA) = **800 VA**.
- **DEMANDA TOTAL CALCULADA = 5,454.59 VA (5.45 kVA)**.

#### 4.4. Corriente de Diseño y Dimensionamiento del Alimentador
- Para sistema bifásico 120/240 V (cos φ = 0.90):
  $$I_{nominal} = \frac{5,454.59\text{ VA}}{240\text{ V} \times 0.90} = 25.25\text{ A}$$
- Con factor de seguridad continuo del 125% (NOM Art. 215-2(a)(1)):
  $$I_{diseño} = 25.25\text{ A} \times 1.25 = 31.56\text{ A}$$
- **Conductor seleccionado:** Calibre **8 AWG Cobre THW-2-LS 90°C**.
  - Ampacidad nominal a 75°C de terminales = **50 A** (supera holgadamente 31.56 A).
  - Factor de temperatura a 40°C = 0.88; Factor de 4 conductores = 0.80.
  - Ampacidad neta corregida: $50 \times 0.88 \times 0.80 = 35.2\text{ A} > 31.56\text{ A}$.
- **Interruptor principal de protección:** **2 polos × 40 A** Square D QO enchufable.
- **Canalización del alimentador:** Tubo conduit metálico EMT de **1 pulgada (25 mm)**. Factor de llenado: 4 conductores cal. 8 ocupan ~21.8% del área interior (límite máximo permitido es 40% según Capítulo 9 Tabla 1).

#### 4.5. Comprobación de Caída de Tensión en Alimentador (L = 16.0 m)
$$\% e = \frac{2 \times L \times I \times (R \cos\varphi + X \sen\varphi)}{V_{nominal}} \times 100$$
- $L = 16.0\text{ m}$
- $I = 25.25\text{ A}$
- $z = 0.00252 \times 0.90 + 0.00014 \times 0.4358 = 0.00233\ \Omega/\text{m}$
- $V = 240\text{ V}$
$$\% e = \frac{2 \times 16 \times 25.25 \times 0.00233}{240} \times 100 = \mathbf{0.78\%}$$
**Dictamen:** Cumple sobradamente el límite máximo normativo del 3.0%.

---

### 5. Resumen de Circuitos Derivados

| Circuito | Descripción | Fase | Breaker | Conductor | EGC Tierra | Longitud | Caída % e | GFCI |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C1** | Alumbrado General y Espejo LED | L1 | 1P 15A | 14 AWG Cu | 14 AWG Cu | 22 m | 1.48% | No |
| **C2** | Contactos Sala, Estancia y Recámaras | L2 | 1P 20A | 12 AWG Cu | 12 AWG Cu | 24 m | 2.15% | No |
| **C3** | Cocina - Barra y Tarja (Enseres) | L1 | 1P 20A | 12 AWG Cu | 12 AWG Cu | 12 m | 0.90% | **SÍ** |
| **C4** | Cocina - Refrigerador y Microondas | L2 | 1P 20A | 12 AWG Cu | 12 AWG Cu | 14 m | 1.18% | **SÍ** |
| **C5** | Baños 1 y 2 - Contactos GFCI | L1 | 1P 20A | 12 AWG Cu | 12 AWG Cu | 10 m | 0.75% | **SÍ** |
| **C6** | Reserva / Futuro Cuarto de Lavado | L2 | 1P 20A | 12 AWG Cu | 12 AWG Cu | 18 m | 1.35% | **SÍ** |

---

### 6. Sistema de Puesta a Tierra y Acometida

1. **Acometida Aérea:** Mufa de aluminio de 1 1/4" a una altura de 4.80 m sobre nivel de banqueta, sujeta al muro exterior de fachada con abrazaderas tipo omega de 2 barrenos, conectada a la base de medición mediante tubo conduit galvanizado de 1 1/4" pared gruesa.
2. **Base de Medición:** Tipo cuadrada para 5 terminales, 100 A, 120/240 V, instalada en el límite exterior de propiedad sin puertas o rejas que obstaculicen la lectura de CFE.
3. **Electrodo de Puesta a Tierra:** Varilla de acero con recubrimiento electrolítico de cobre tipo Copperweld de 5/8" (16 mm) de diámetro por 3.0 m de longitud, enterrada a 90° en terreno natural al pie del medidor. Conectada mediante conector mecánico de bronce para enterramiento directo y conductor de cobre suave desnudo calibre 8 AWG (NOM Tabla 250-66). Resistencia de tierra exigida: menor a 25 Ohms.
4. **Aislamiento en Centro de Carga derivado:** En el tablero Square D QO-8 de Planta Alta, la barra de neutros permanece aislada de la tierra física (tornillo verde de unión puente removido). Los conductores de protección verde se conectan a su propia barra de tierras fijada al gabinete.

---

### 7. Conclusión y Responsabilidades

El presente cálculo técnico demuestra la viabilidad técnica, seguridad y conformidad de la instalación proyectada con la **NOM-001-SEDE-2012**. Los calibres y especificaciones descritos garantizan una operación libre de sobrecalentamientos, con reservas para ampliaciones futuras y plena protección diferencial GFCI para los ocupantes en todas las áreas con riesgo de humedad.

La compra de materiales y la ejecución deben ceñirse estrictamente a las etapas descritas en el plan de trabajo y a la aprobación del trámite de factibilidad por parte de CFE.
