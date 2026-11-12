# VoltHome CDMX: Sistema de Modelado, Cálculo, Documentación y Presupuesto de Instalación Eléctrica Residencial

Sistema integral interactivo y editable de ingeniería eléctrica para el diseño, cálculo normativo, documentación técnica, levantamiento físico y presupuestación de una instalación eléctrica completamente nueva e independiente en planta alta residencial (Ciudad de México).

**Normativa Técnica Aplicable:**
- **NOM-001-SEDE-2012:** Instalaciones Eléctricas (utilización) — Artículos 110, 210, 215, 220, 250, 310, 358 y 362.
- **CFE-EM-BT102 / CFE-GIC00-05:** Especificación técnica para acometida bifásica aérea (120/240 V, 3 hilos) y bases de medición de 5 terminales hasta 100 A.
- **NMX-J-010-ANCE / NMX-J-549-ANCE:** Conductores antiflama THW-2-LS 90°C 600V y electrodos de puesta a tierra.

---

## ⚡ Contexto y Alcance del Proyecto

La vivienda será habitada por dos personas y forma parte de un inmueble con suministro previo. El proyecto consiste en **diseñar y construir una instalación eléctrica 100% nueva e independiente**, con:

1. **Segundo medidor de CFE:** Base redonda de 5 terminales ubicada en fachada exterior a nivel de banqueta.
2. **Contrato y recibo CFE propios e independientes.**
3. **Alimentación aérea exclusiva:** Acometida desde red pública mediante poste y mufa aérea de 1 1/4" a 4.80 m de altura.
4. **Alimentador principal aislado:** Tubería conduit metálica de 1" por cubo de escalera (conductores 2F-3H Calibre 8 AWG cobre / 6 AWG fase con neutro concéntrico y tierra 8 AWG desnuda).
5. **Centro de carga propio:** Tablero Square D QO-8 empotrado en muro de pasillo central (en el registro vertebral "Caja").
6. **Circuitos derivados nuevos:** Alumbrado, contactos generales, circuitos obligatorios de pequeños enseres en cocina (2 x 20A), circuito exclusivo de lavado y contactos con protección diferencial GFCI Clase A en baños, cocina y exteriores.
7. **Independencia absoluta:** Cero interferencia, cero cruces de neutros y cero dependencia de la instalación existente de la planta baja.
8. **Planificación presupuestaria para El Buen Fin 2026:** Cuantificación rigurosa con 3 escenarios comerciales (Económico, Medio y Certificado/Alto).

---

## 🚀 Inicio Rápido (Lanzamiento en 1 Clic)

### Opción A: Lanzador directo de Windows (Sin dependencias)
Haz doble clic sobre el archivo ejecutable por lotes:
```cmd
iniciar_aplicacion.bat
```
El script iniciará el servidor local y abrirá automáticamente tu navegador web predeterminado en:
**`http://localhost:5173`**

### Opción B: Modo de Desarrollo (Node.js + Vite)
```bash
cd electro-modeler
npm install
npm run dev
```

### Opción C: Ejecución de Pruebas Unitarias del Motor de Cálculo
Valida los 16 algoritmos de cálculo normativo (caídas de tensión, factores de agrupamiento NOM Tabla 310-15, diversificación residencial Art. 220 y catálogo de materiales):
```bash
node --experimental-strip-types electro-modeler/test_engine.ts
```

---

## 📂 Estructura de Entregables Técnicos en este Repositorio

| Archivo | Formato | Descripción Técnica |
| :--- | :---: | :--- |
| [`iniciar_aplicacion.bat`](iniciar_aplicacion.bat) | Batch | Lanzador de un solo clic de la aplicación web local VoltHome CDMX |
| [`memoria_tecnica_de_calculo.md`](memoria_tecnica_de_calculo.md) | Markdown | Memoria oficial de cálculo eléctrico según NOM-001-SEDE-2012 y CFE |
| [`inventario_levantamiento_croquis.md`](inventario_levantamiento_croquis.md) | Markdown | Inventario del levantamiento físico: 18 contactos, 15 apagadores, 7 puertas, ventanas y clósets |
| [`checklist_inspeccion_sitio.md`](checklist_inspeccion_sitio.md) | Markdown | Protocolo y lista priorizada de validaciones físicas en obra |
| [`manual_de_usuario.md`](manual_de_usuario.md) | Markdown | Guía completa de uso y arquitectura de software de la aplicación |
| [`cuadro_de_cargas_y_circuitos.csv`](cuadro_de_cargas_y_circuitos.csv) | CSV | Cuadro de cargas, fases, protecciones y calibres para Excel |
| [`presupuesto_cuantificado_buen_fin.csv`](presupuesto_cuantificado_buen_fin.csv) | CSV | Catálogo con 26 partidas de obra y 3 escenarios comerciales |
| [`plano_levantamiento_croquis_2D.svg`](plano_levantamiento_croquis_2D.svg) | SVG | Plano 2D vectorial exclusivo del levantamiento físico de obra (croquis) |
| [`plano_levantamiento_croquis_2D.dxf`](plano_levantamiento_croquis_2D.dxf) | DXF | Plano CAD de levantamiento compatible con AutoCAD / LibreCAD |
| [`plano_propuesta_electrica_2D.svg`](plano_propuesta_electrica_2D.svg) | SVG | Plano técnico vectorial de la propuesta eléctrica nueva calculada |
| [`plano_propuesta_electrica_2D.dxf`](plano_propuesta_electrica_2D.dxf) | DXF | Plano CAD de la propuesta eléctrica para AutoCAD |
| [`diagrama_unifilar.svg`](diagrama_unifilar.svg) | SVG | Diagrama unifilar vectorial completo desde acometida hasta circuitos derivados |

---

## 📋 Resumen del Cuadro de Cargas y Circuitos Propuestos

- **Tensión de Suministro:** 120/240 V (Bifásico 2F-3H, 60 Hz).
- **Carga Total Conectada:** 12,490 VA (11,465 W).
- **Demanda Máxima Diversificada (NOM Art. 220):** **5,454 VA** ($22.7\text{ A}$ por fase).
- **Interruptor Principal Sugerido:** 2 Polos $\times$ 40 A o 50 A (Tensión nominal 240 V, capacidad interruptiva 10 kA).
- **Alimentador Principal:** 2 Conductores Calibre 8 AWG fase + 1 Neutro 8 AWG + 1 Tierra 8 AWG desnuda en tubería conduit metálica de 1" ($\Delta V = 1.34\% \le 2.0\%$).

| Circuito | Fase | Tensión | Protección | Calibre | Carga (VA) | Área / Cargas Servidas | Obligación Normativa |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **C1** | L1 | 120 V | 1P-15A | 14 AWG | 1,170 VA | Alumbrado general (12 salidas LED) y conmutadores | NOM Art. 210-70 |
| **C2** | L2 | 120 V | 1P-20A | 12 AWG | 2,880 VA | Contactos generales en sala, comedor, recámaras y pasillo | NOM Art. 210-52(A) |
| **C3** | L1 | 120 V | 1P-20A | 12 AWG | 1,800 VA | Cocina 1: Contactos de barra y tarja (**GFCI**) | NOM Art. 210-52(B) |
| **C4** | L2 | 120 V | 1P-20A | 12 AWG | 1,920 VA | Cocina 2: Refrigerador y horno de microondas | NOM Art. 210-52(B) |
| **C5** | L1 | 120 V | 1P-20A | 12 AWG | 2,400 VA | Baños 1 y 2: Contactos de tocador y espejo (**GFCI**) | NOM Art. 210-8(A)(1) |
| **C6** | L2 | 120 V | 1P-20A | 12 AWG | 2,320 VA | Servicios y Azotea: Lavadora y cuarto superior (**GFCI**) | NOM Art. 210-52(F) |

---

## 🛠️ Tecnologías Empleadas

- **Frontend:** React 19, TypeScript, Vite 8, Lucide React Icons.
- **Gráficos CAD Vectoriales:** SVG nativo escalable con soporte para zoom, pan, acotaciones interactivas, capas y exportador ASCII DXF (AutoCAD R12).
- **Backend / Automatización:** Python 3 (servidor HTTP ligero, generador de entregables y procesamiento de metadatos de imágenes).
- **Control de Calidad:** Suite automatizada de 16 pruebas unitarias (`test_engine.ts`) con verificación matemática de fórmulas de ingeniería eléctrica.

---

## 📄 Licencia y Derechos

Desarrollado para el proyecto de instalación eléctrica residencial en Ciudad de México. Todos los derechos reservados.
