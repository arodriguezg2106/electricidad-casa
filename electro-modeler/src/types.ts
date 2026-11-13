// Types definition for VoltHome CDMX Electrical Modeling & Engineering App

export type RoomType = 
  | 'living_dining'
  | 'kitchen'
  | 'bedroom'
  | 'bathroom'
  | 'hallway'
  | 'stairs'
  | 'exterior_facade';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  x: number; // in meters
  y: number; // in meters
  width: number; // in meters
  height: number; // in meters
  isProvisional: boolean;
  wallMaterial: string;
  floorMaterial: string;
  ceilingMaterial: string;
  notes: string;
  color?: string;
  level?: 'nivel_1' | 'arriba' | 'fachada_pb';
  associatedPhotos?: number[];
}

export type ElementType = 
  | 'light_ceiling'
  | 'light_wall'
  | 'switch_single'
  | 'switch_3way'
  | 'outlet_duplex'
  | 'outlet_gfci'
  | 'load_center'
  | 'meter_cfe'
  | 'service_drop'
  | 'ground_rod'
  | 'junction_box'
  | 'led_mirror'
  | 'special_load';

export interface ElectricalElement {
  id: string;
  type: ElementType;
  roomId: string;
  x: number; // relative to room or canvas in meters
  y: number;
  circuitId?: string;
  heightOverFloor: number; // in meters
  isExisting: boolean;
  label: string;
  status: 'CONFIRMADA' | 'INFERIDA' | 'PENDIENTE DE VERIFICACIÓN';
  notes?: string;
}

export interface ConduitPath {
  id: string;
  fromId: string;
  toId: string;
  type: 'poliducto_naranja_existente' | 'pvc_pesado' | 'conduit_emt' | 'conduit_pared_gruesa';
  diameter: '1/2"' | '3/4"' | '1"' | '1 1/4"';
  lengthMeters: number;
  conductorsCount: number;
  conductorsDesc: string;
  circuitIds: string[];
  isExisting: boolean;
  notes?: string;
}

export interface LoadItem {
  id: string;
  name: string;
  roomId: string;
  circuitId: string;
  quantity: number;
  watts: number;
  va: number;
  powerFactor: number;
  duty: 'continuous' | 'non_continuous';
  category: 'lighting' | 'receptacle' | 'kitchen' | 'bathroom' | 'appliance' | 'special';
}

export interface Circuit {
  id: string;
  code: string;
  name: string;
  description: string;
  voltage: 120 | 240;
  phase: 'L1' | 'L2' | 'L1-L2';
  breakerAmps: 15 | 20 | 30 | 40;
  breakerPoles: 1 | 2;
  wireGaugeAwg: 14 | 12 | 10 | 8;
  wireType: string;
  conduitDiameter: string;
  totalWatts: number;
  totalVa: number;
  demandVa: number;
  currentAmps: number;
  lengthMeters: number;
  voltageDropPercent: number;
  isGfci: boolean;
  roomIds: string[];
  status: 'PRELIMINAR' | 'VERIFICADO';
}

export interface MaterialItem {
  id: string;
  code: string;
  category: 'Conductores' | 'Canalizaciones' | 'Cajas y Accesorios' | 'Protecciones y Tableros' | 'Dispositivos' | 'Acometida y Puesta a Tierra';
  description: string;
  technicalSpec: string;
  unit: 'm' | 'pza' | 'jgo' | 'tramo';
  quantityEstimated: number;
  quantificationMethod: string;
  unitPriceEco: number; // MXN
  unitPriceMid: number;
  unitPriceHigh: number;
  supplierEco: string;
  supplierMid: string;
  supplierHigh: string;
  validationStatus: 'CONFIRMADO' | 'PENDIENTE_VALIDACION_CFE' | 'ESTIMADO_POR_PLANO';
}

export interface ReusableWire {
  id: string;
  label: string;
  wireGauge: number;
  lengthMeters: number;
  insulationType: string;
  color: string;
  metalType: 'Cobre' | 'Aluminio' | 'CCA (Cobrizado)';
  visualCondition: 'Bueno' | 'Aceptable' | 'Dañado / Reseco';
  continuityTested: boolean;
  meggerTested: boolean;
  isApprovedByElectrician: boolean;
  notes: string;
}

export interface PhotoData {
  id: number;
  filename: string;
  categoryId: number;
  categoryName: string;
  space: string;
  visibleElements: string;
  conduitTrajectories: string;
  wallMaterials: string;
  obstacles: string;
  risks: string;
  pendingVerification: string;
  status: 'CONFIRMADA' | 'INFERIDA' | 'PENDIENTE DE VERIFICACIÓN';
  referenceScale: string;
}

export interface SurveyElement {
  id: string;
  code: string; // 'A1'..'A15', 'C1'..'C18', 'P1'..'P7', 'V1'..'V2', 'Closet 1'..'Closet 3', 'Caja'
  type: 'switch' | 'outlet' | 'door' | 'window' | 'closet' | 'box';
  roomId: string;
  roomName: string;
  sketchSource: 'Parte (1)' | 'Cuartos secundarios' | 'Arriba';
  x: number; // in meters
  y: number; // in meters
  width?: number; // meters
  height?: number; // meters
  depth?: number; // meters
  heightOverFloor?: number; // meters
  wallSide?: 'top' | 'bottom' | 'left' | 'right' | 'interior';
  label: string;
  dimensionsText?: string;
  status: 'CONFIRMADA' | 'INFERIDA' | 'PENDIENTE DE VERIFICACIÓN';
  nomComplianceNote?: string;
  proposedCircuitId?: string;
  notes?: string;
}

export interface ProjectData {
  name: string;
  location: string;
  occupants: number;
  systemType: '2F-3H (120/240V)' | '1F-2H (120V)';
  cfeContractStatus: string;
  lastUpdated: string;
  rooms: Room[];
  elements: ElectricalElement[];
  conduits: ConduitPath[];
  circuits: Circuit[];
  loads: LoadItem[];
  reusableWires: ReusableWire[];
  surveyElements?: SurveyElement[];
}

export interface ValidatedZone {
  id: string;
  nombre: string;
  categoria: 'recamara' | 'circulacion' | 'escaleras' | 'area_social' | 'bano' | 'cocina';
  poligono_px: [number, number][];
  fillColor: string;
  strokeColor: string;
  geometria: string;
  notas?: string;
}

export interface StreetAccessMarker {
  lado: 'derecho';
  referencia: string;
  ancla_px: { x: number; y: number };
  franja_y_px: { y_min: number; y_max: number };
  cercania_zona_id: string;
  confianza: string;
  requiere_verificar: string[];
}

export interface PartialMeasurement {
  id: string;
  valor: number;
  unidad: string;
  descripcion: string;
  estatus: string;
  fuente: string;
  confirmacion_usuario: 'CONFIRMADO' | 'PENDIENTE' | 'CONFLICTO_POR_VERIFICAR';
  zona_relacionada?: string;
}

export interface InstallationRealStatus {
  id: string;
  componente: string;
  existe: 'SI' | 'NO' | 'DESCONOCIDO';
  estado: string;
  observaciones: string;
  compra_ahora: string;
}

export interface PriorityQuestion {
  id: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  dato_pendiente: string;
  modulo_que_bloquea: string;
  respuesta: string;
  fecha_respuesta: string;
  validada: 'SI' | 'NO';
}
