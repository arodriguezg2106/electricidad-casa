import type { 
  ValidatedZone, 
  StreetAccessMarker, 
  PartialMeasurement, 
  InstallationRealStatus, 
  PriorityQuestion 
} from '../types.ts';

// 12 Zonas validadas por usuario según fuente 01 (01_ESTRUCTURA_VALIDADA_POR_USUARIO.png)
// Coordenadas esquemáticas en px (viewBox nativo 1000 x 700 para visualización fiel)
export const VALIDATED_ZONES: ValidatedZone[] = [
  {
    id: 'cuarto_secundario',
    nombre: 'Cuarto secundario',
    categoria: 'recamara',
    poligono_px: [[103, 335], [303, 335], [303, 622], [103, 622]],
    fillColor: '#F3E5C4',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Extremo izquierdo de la vivienda, extendido hacia la izquierda. Verificar aberturas y comunicación con pasillo central.'
  },
  {
    id: 'cuarto_pequeno',
    nombre: 'Cuarto pequeño',
    categoria: 'recamara',
    poligono_px: [[303, 466], [452, 466], [452, 622], [303, 622]],
    fillColor: '#F3E5C4',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Contiguo hacia abajo y a la derecha del cuarto secundario. Conexión a pasillo pendiente de confirmar.'
  },
  {
    id: 'pasillo_central',
    nombre: 'Pasillo central',
    categoria: 'circulacion',
    poligono_px: [[303, 335], [452, 335], [452, 395], [603, 395], [603, 466], [303, 466]],
    fillColor: '#B9DCF2',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Color AZUL = Pasillo de circulación. Distribuye hacia cuartos izquierdos, escaleras y área social.'
  },
  {
    id: 'escalera_azotea',
    nombre: 'Escaleras a la azotea',
    categoria: 'escaleras',
    poligono_px: [[452, 335], [603, 335], [603, 395], [452, 395]],
    fillColor: '#B89DE8',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Color MORADO = Escaleras. Núcleo independiente hacia la azotea / nivel superior.'
  },
  {
    id: 'escalera_planta_baja',
    nombre: 'Escaleras de PB al primer piso',
    categoria: 'escaleras',
    poligono_px: [[452, 466], [603, 466], [603, 622], [452, 622]],
    fillColor: '#B89DE8',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Color MORADO = Escaleras. Núcleo independiente de llegada desde Planta Baja. Posible ruta del alimentador principal.'
  },
  {
    id: 'sala_comedor',
    nombre: 'Sala–comedor',
    categoria: 'area_social',
    poligono_px: [[603, 335], [885, 335], [885, 622], [603, 622]],
    fillColor: '#DCEEDC',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Área social amplia. NOTA: Contiene en su interior esquemático al baño secundario, el cual se debe sustraer para evitar duplicar superficie.'
  },
  {
    id: 'bano_secundario',
    nombre: 'Baño secundario',
    categoria: 'bano',
    poligono_px: [[603, 489], [698, 489], [698, 605], [603, 605]],
    fillColor: '#F2BEDB',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Ubicado en esquina inferior izquierda del bloque de sala. Requiere protección GFCI en contactos de tocador.'
  },
  {
    id: 'cocina',
    nombre: 'Cocina',
    categoria: 'cocina',
    poligono_px: [[603, 228], [800, 228], [800, 335], [603, 335]],
    fillColor: '#FFE0BC',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Ubicada encima del área social. Requiere 2 circuitos obligatorios de 20A para pequeños aparatos con GFCI.'
  },
  {
    id: 'pasillo_cocina_sala',
    nombre: 'Pasillo de cocina a sala–comedor',
    categoria: 'circulacion',
    poligono_px: [[800, 228], [885, 228], [885, 335], [800, 335]],
    fillColor: '#B9DCF2',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Color AZUL = Pasillo de circulación. Cruce clave adyacente a la entrada aproximada desde la calle.'
  },
  {
    id: 'cuarto_principal',
    nombre: 'Cuarto principal',
    categoria: 'recamara',
    poligono_px: [[627, 73], [885, 73], [885, 228], [603, 228], [603, 165], [627, 165]],
    fillColor: '#F3E5C4',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Habitación principal en cuadrante superior derecho. Se comunica con baño principal a través de pasillo.'
  },
  {
    id: 'bano_principal',
    nombre: 'Baño principal',
    categoria: 'bano',
    poligono_px: [[499, 73], [627, 73], [627, 165], [499, 165]],
    fillColor: '#F2BEDB',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'En cuadrante superior, contiguo a cuarto principal. Requiere GFCI en tocador y espejo LED.'
  },
  {
    id: 'pasillo_bano_principal',
    nombre: 'Pasillo al baño principal',
    categoria: 'circulacion',
    poligono_px: [[499, 165], [603, 165], [603, 230], [499, 230]],
    fillColor: '#B9DCF2',
    strokeColor: '#26374A',
    geometria: 'ESQUEMATICA_VALIDADA_EN_TOPOLOGIA_NO_EN_DIMENSIONES',
    notas: 'Color AZUL = Pasillo. Conector de circulación entre vestíbulo y baño principal.'
  }
];

// Acceso desde la calle según dato confirmado por el usuario (borde derecho)
export const STREET_ACCESS: StreetAccessMarker = {
  lado: 'derecho',
  referencia: 'Aproximadamente a la altura del pasillo entre cocina y sala-comedor',
  ancla_px: { x: 885, y: 282 },
  franja_y_px: { y_min: 228, y_max: 335 },
  cercania_zona_id: 'pasillo_cocina_sala',
  confianza: 'POSICION_APROXIMADA; PUNTO_DE_PUERTA_NO_CONFIRMADO',
  requiere_verificar: [
    'Si es puerta exterior directa o acceso a pasillo común exterior',
    'Ancho y altura de vano',
    'Cota de nivel/altura de piso respecto a la calle',
    'Ubicación exacta de la fachada accesible para el medidor CFE',
    'Orientación real del inmueble'
  ]
};

// Cotas parciales observadas en fuentes/02_CROQUIS_CON_MEDIDAS.jpg
export const PARTIAL_MEASUREMENTS: PartialMeasurement[] = [
  {
    id: 'M01',
    valor: 7.43,
    unidad: 'm',
    descripcion: 'Cota longitudinal señalada al lado derecho del croquis «Cocina, pasillo y sala»',
    estatus: 'UBICACION_GRAFICA_IDENTIFICADA; EXTREMOS POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE',
    zona_relacionada: 'sala_comedor'
  },
  {
    id: 'M02',
    valor: 4.06,
    unidad: 'm',
    descripcion: 'Cota horizontal inferior del croquis «Cocina, pasillo y sala»',
    estatus: 'UBICACION_GRAFICA_IDENTIFICADA; EXTREMOS POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE',
    zona_relacionada: 'sala_comedor'
  },
  {
    id: 'M03',
    valor: 3.55,
    unidad: 'm',
    descripcion: 'Cota horizontal rotulada «Cuarto», junto/arriba de cocina',
    estatus: 'ASOCIACION_EXACTA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE',
    zona_relacionada: 'cuarto_principal'
  },
  {
    id: 'M04',
    valor: 2.27,
    unidad: 'm',
    descripcion: 'Cota del costado izquierdo en «Baño y cuarto principal»',
    estatus: 'ASOCIACION_EXACTA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE',
    zona_relacionada: 'bano_principal'
  },
  {
    id: 'M05',
    valor: 3.90,
    unidad: 'm',
    descripcion: 'Cota vertical exterior a la derecha en «Baño y cuarto principal»',
    estatus: 'LECTURA_Y_EXTREMOS_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE',
    zona_relacionada: 'cuarto_principal'
  },
  {
    id: 'M06',
    valor: 1.50,
    unidad: 'm',
    descripcion: 'Ancho de ventana superior dibujada a la derecha',
    estatus: 'IDENTIFICACION_DE_VENTANA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE'
  },
  {
    id: 'M07',
    valor: 1.17,
    unidad: 'm',
    descripcion: 'Altura de ventana superior dibujada a la derecha',
    estatus: 'IDENTIFICACION_DE_VENTANA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE'
  },
  {
    id: 'M08',
    valor: 1.50,
    unidad: 'm',
    descripcion: 'Ancho de ventana inferior dibujada a la derecha',
    estatus: 'IDENTIFICACION_DE_VENTANA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE'
  },
  {
    id: 'M09',
    valor: 1.14,
    unidad: 'm',
    descripcion: 'Altura de ventana inferior dibujada a la derecha',
    estatus: 'IDENTIFICACION_DE_VENTANA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE'
  },
  {
    id: 'M10',
    valor: 2.20,
    unidad: 'm',
    descripcion: 'Cota vertical de armario de cuarto principal',
    estatus: 'ASOCIACION_Y_CIERRE_DE_GEOMETRIA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE'
  },
  {
    id: 'M11',
    valor: 0.65,
    unidad: 'm',
    descripcion: 'Cota horizontal pequeña en dibujo del armario principal',
    estatus: 'ASOCIACION_Y_CIERRE_DE_GEOMETRIA_POR_VERIFICAR',
    fuente: 'fuentes/02_CROQUIS_CON_MEDIDAS.jpg',
    confirmacion_usuario: 'PENDIENTE'
  }
];

// Estado Real de la Instalación (ESTADO_REAL_INSTALACION.csv)
export const INSTALLATION_REAL_STATUS: InstallationRealStatus[] = [
  {
    id: 'E01',
    componente: 'Canalizaciones o mangueras',
    existe: 'SI',
    estado: 'EXISTENTES_SIN_VERIFICAR',
    observaciones: 'Existen mangueras empotradas. Requieren inspección de continuidad, diámetro, ocupación y posible aprovechamiento.',
    compra_ahora: 'NO'
  },
  {
    id: 'E02',
    componente: 'Cajas/huecos de contactos',
    existe: 'SI',
    estado: 'EXISTENTES_SIN_VERIFICAR',
    observaciones: 'Cajas y chalupas empotradas existentes. Registrar cantidad física, tamaño y estado.',
    compra_ahora: 'NO'
  },
  {
    id: 'E03',
    componente: 'Cableado interior nuevo',
    existe: 'NO',
    estado: 'NO_INSTALADO',
    observaciones: 'No hay conductores del nuevo sistema instalados dentro de las canalizaciones. Diseño/cálculo completos pendientes.',
    compra_ahora: 'NO_HASTA_CALCULO'
  },
  {
    id: 'E04',
    componente: 'Contactos montados',
    existe: 'NO',
    estado: 'NO_INSTALADOS',
    observaciones: 'No hay contactos montados. Compra sujeta a cantidad definitiva, tipo de carga y protección GFCI obligatoria.',
    compra_ahora: 'NO_HASTA_DISENO'
  },
  {
    id: 'E05',
    componente: 'Apagadores montados',
    existe: 'DESCONOCIDO',
    estado: 'POR_VERIFICAR',
    observaciones: 'A1-A15 es listado de puntos en croquis, no evidencia de mecanismos físicos funcionales.',
    compra_ahora: 'NO_HASTA_VERIFICAR'
  },
  {
    id: 'E06',
    componente: 'Centro de carga del piso',
    existe: 'NO',
    estado: 'NO_INSTALADO',
    observaciones: 'No existe tablero para este piso. Ubicación, capacidad y configuración deben calcularse.',
    compra_ahora: 'NO_HASTA_CALCULO'
  },
  {
    id: 'E07',
    componente: 'Segundo medidor CFE',
    existe: 'NO',
    estado: 'NO_INSTALADO',
    observaciones: 'Lo instala CFE exclusivamente tras aprobación técnica de la preparación. NUNCA comprar medidor particular.',
    compra_ahora: 'NUNCA_MEDIDOR_PARTICULAR'
  },
  {
    id: 'E08',
    componente: 'Contrato de CFE independiente',
    existe: 'NO',
    estado: 'PENDIENTE',
    observaciones: 'Trámite de viabilidad, preparación según norma CFE-GIC00-05 y contratación formal independiente.',
    compra_ahora: 'TRAMITE_PENDIENTE'
  },
  {
    id: 'E09',
    componente: 'Protecciones y puesta a tierra',
    existe: 'DESCONOCIDO',
    estado: 'POR_PROYECTAR',
    observaciones: 'No asumir que la puesta a tierra del inmueble sirve al nuevo servicio. Diseñar electrodo y conductores dedicados.',
    compra_ahora: 'NO_HASTA_REVISION'
  },
  {
    id: 'E10',
    componente: 'Cable potencial del padre',
    existe: 'DESCONOCIDO',
    estado: 'INVENTARIO_POTENCIAL',
    observaciones: 'Existencia potencial no aprobada. Faltan marca, material (Cu/Al/CCA), calibre, aislamiento, metraje y prueba megger.',
    compra_ahora: 'NO_DESCONTAR_DEL_BOM'
  }
];

// Preguntas Prioritarias de Información Faltante (PREGUNTAS_PRIORITARIAS.csv)
export const PRIORITY_QUESTIONS: PriorityQuestion[] = [
  {
    id: 'Q01',
    prioridad: 'ALTA',
    dato_pendiente: 'Ubicación y distancia del medidor actual, lugar propuesto para el nuevo medidor, acceso de fachada y consulta de viabilidad con CFE.',
    modulo_que_bloquea: 'CFE / Medidor / Acometida',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q02',
    prioridad: 'ALTA',
    dato_pendiente: 'Medidas completas de los 12 espacios (ancho x largo) y alturas de techo / cambios de nivel en escaleras, especialmente cuartos izquierdos.',
    modulo_que_bloquea: 'Geometría y Escala Métrica',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q03',
    prioridad: 'ALTA',
    dato_pendiente: 'Ubicación física y rutas reales de las mangueras y cajas existentes; prueba de continuidad y verificación de diámetro por electricista.',
    modulo_que_bloquea: 'Preinstalación y Canalizaciones Reutilizables',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q04',
    prioridad: 'ALTA',
    dato_pendiente: 'Listado definitivo de aparatos electrodomésticos y fotos legibles de placas de datos técnicos para estimar cargas reales en Watts/VA.',
    modulo_que_bloquea: 'Cuadro de Cargas y Capacidad del Tablero',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q05',
    prioridad: 'ALTA',
    dato_pendiente: 'Sitio viable y accesible para el centro de carga en el piso y trayectoria física de la tubería del alimentador desde el medidor exterior.',
    modulo_que_bloquea: 'Tablero Principal / Alimentador 2F-3H',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q06',
    prioridad: 'MEDIA',
    dato_pendiente: 'Dimensiones definitivas de puertas y ventanas, espesor de muros y sentidos de apertura para ubicar apagadores en lado de chapa.',
    modulo_que_bloquea: 'Aberturas y Ergonomía Eléctrica',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q07',
    prioridad: 'MEDIA',
    dato_pendiente: 'Marcajes sobre aislamiento, material del conductor (Cu o CCA), metraje y estado físico del rollo de cable aportado por el padre.',
    modulo_que_bloquea: 'Reutilización y Descuento en BOM',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  },
  {
    id: 'Q08',
    prioridad: 'MEDIA',
    dato_pendiente: 'Confirmar si las posiciones de levantamiento A1-A15 y C1-C18 satisfacen las necesidades de iluminación y contactos de las usuarias.',
    modulo_que_bloquea: 'Distribución Final de Salidas',
    respuesta: '',
    fecha_respuesta: '',
    validada: 'NO'
  }
];
