# Proyecto eléctrico de nuestra casa — paquete integral de actualización
**Corte de información:** 12 de noviembre de 2026. **Lugar:** Ciudad de México.

## Para iniciar (Antigravity ya está desarrollando la aplicación)
1. Copiar la carpeta completa `referencias_casa/` en la raíz del repositorio de Antigravity (mantener su nombre).
2. Pegar en el chat de Antigravity el contenido de `instrucciones/00_MENSAJE_PARA_PEGAR.txt`.
3. El agente debe leer `instrucciones/01_PROMPT_MAESTRO.md` y verificar TODOS los datos contra fuentes originales antes de modificar el modelo.
4. Revisar primero la **vista arquitectónica corregida y editable**; solo después habilitar cálculo/compra según disponibilidad de datos.

## Jerarquía de documentos (clave para evitar errores)
1. `fuentes/01_ESTRUCTURA_VALIDADA_POR_USUARIO.png` **única fuente autorizada de distribución relativa** de la casa.
2. `fuentes/07_ACLARACION_AZUL_PASILLO_MORADO_ESCALERAS.png`: pasillos azules y escaleras moradas (los textos antiguos que señalan escaleras en zonas azules NO los convierten en escaleras).
3. `modelo/PLANO_BASE_CON_ACCESO_NO_ESCALA.svg` y `modelo/MODELO_ARQUITECTONICO_ESQUEMATICO.json`: digitalización editable **SIN ESCALA**.
4. `fuentes/02_CROQUIS_CON_MEDIDAS.jpg`: medidas parciales, asociar las cotas a sus segmentos solo tras verificarlas.
5. `fuentes/03...`, `04...`, `05...`, `06...`: registros de puertas, ventanas, clósets y posiciones numeradas A/C; apoyo no prevalece sobre fuente 01.
6. `fuentes/08_PRIMER_CROQUIS_DIGITAL.jpg`: antecedente; usar solo como apoyo histórico, no como fuente de geometría vigente.

## Estado de obra confirmado
**Sí existen:** mangueras/canalizaciones y cajas o espacios empotrados preparados para futuros contactos. **No existen instalados:** conductores eléctricos nuevos, mecanismos de contactos, centro de carga propio ni segundo medidor de CFE. El suministro actual viene de un poste por vía aérea y corresponde al otro servicio del inmueble. Se quiere solicitar **servicio, medidor, contrato y facturación independientes** para este piso. La casa ya tiene una **entrada a calle en el lado derecho del esquema, cerca del pasillo entre cocina y sala**, pero la posición exacta del vano no está medida.

La existencia física de una manguera/caja NO implica que su diámetro, ocupación, continuidad, estado o trayectorias sean aptos para el diseño. No comprar automáticamente mangueras nuevas ni dar por aprovechables las existentes.

## Contenido
- `fuentes/`: 8 imágenes originales (no incluye las ilustraciones erróneas previas).
- `modelo/`: plano SVG y PNG **esquemáticos**, modelo JSON geométrico y ficha de estado.
- `instrucciones/`: mensaje de inicio, prompt maestro, diseño por etapas, verificación y requisitos funcionales.
- `datos/`: cotas, puntos, equipos/cargas, rutas, partidas, precios, compras e inspección en CSV editables.
- `normativa/`: fuentes verificadas oficiales y cautelas de cumplimiento.
- `validaciones/`: criterios de aceptación, pruebas y manifiesto.

## Prohibiciones para el agente
No reiniciar repositorio. No borrar avances. No reintroducir dibujos generados anteriormente con habitaciones incorrectas. No tomar píxeles como metros. No asignar norte geográfico. No suponer que todos los colores dividen muros. No inventar cargas, calibres, protecciones, especificación de acometida, distancias ni precios. No sugerir intervención privada de acometida energizada o componentes CFE. No comprar medidor de CFE por cuenta propia.
