// Material Quantification Engine derived from 2D Layout & Electrical Schematics

import type { ElectricalElement, ConduitPath, ReusableWire, MaterialItem } from '../types.ts';

export interface QuantifiedBillOfMaterials {
  items: MaterialItem[];
  conduitTotalMeters: Record<string, number>;
  wireTotalMeters: Record<string, number>;
  wireDeductedMeters: Record<string, number>;
  wireToBuyMeters: Record<string, number>;
  totalCostEco: number;
  totalCostMid: number;
  totalCostHigh: number;
}

export function quantifyProjectMaterials(params: {
  elements: ElectricalElement[];
  conduits: ConduitPath[];
  reusableWires: ReusableWire[];
  feederLengthMeters?: number;
  systemType?: '2F-3H (120/240V)' | '1F-2H (120V)';
}): QuantifiedBillOfMaterials {
  const { elements, conduits, reusableWires, feederLengthMeters = 16, systemType = '2F-3H (120/240V)' } = params;

  // 1. Calculate conduit lengths by diameter
  const conduitLengths: Record<string, number> = {
    '1/2"': 0,
    '3/4"': 0,
    '1"': 0,
    '1 1/4"': 0,
  };

  conduits.forEach(c => {
    const diam = c.diameter || '3/4"';
    conduitLengths[diam] = (conduitLengths[diam] || 0) + c.lengthMeters;
  });

  // Add 10% reserve/waste for conduit
  Object.keys(conduitLengths).forEach(k => {
    conduitLengths[k] = Math.ceil(conduitLengths[k] * 1.10);
  });

  // Feeder conduit (1" for 2F-3H or 1 1/4")
  const feederConduitDiam = systemType === '2F-3H (120/240V)' ? '1"' : '1 1/4"';
  conduitLengths[feederConduitDiam] = (conduitLengths[feederConduitDiam] || 0) + Math.ceil(feederLengthMeters * 1.10);

  // 2. Calculate wire lengths by gauge and function
  // We apply 15% reserve for splices, box drops, hookups
  const wireGrossLengths: Record<string, number> = {
    '14_negro': 0,
    '14_rojo': 0,
    '14_blanco': 0,
    '14_verde': 0,
    '12_negro': 0,
    '12_rojo': 0,
    '12_blanco': 0,
    '12_verde': 0,
    '8_negro': 0,
    '8_rojo': 0,
    '8_blanco': 0,
    '8_verde': 0,
    '6_negro': 0,
    '6_blanco': 0,
    '6_verde': 0,
  };

  conduits.forEach(c => {
    const length = c.lengthMeters * 1.15; // 15% slack & splicing
    const isLighting = c.circuitIds.includes('C1');
    const is20ACircuit = c.circuitIds.some(id => ['C2', 'C3', 'C4', 'C5', 'C6'].includes(id));

    if (isLighting) {
      wireGrossLengths['14_negro'] += length;
      wireGrossLengths['14_rojo'] += length * 0.7; // return conductors
      wireGrossLengths['14_blanco'] += length;
      wireGrossLengths['14_verde'] += length;
    }

    if (is20ACircuit) {
      wireGrossLengths['12_negro'] += length;
      wireGrossLengths['12_blanco'] += length;
      wireGrossLengths['12_verde'] += length;
    }
  });

  // Feeder wires (CFE meter to Load Center)
  const feederGrossLength = feederLengthMeters * 1.20; // 20% margin for risers and box connections
  if (systemType === '2F-3H (120/240V)') {
    wireGrossLengths['8_negro'] += feederGrossLength; // Phase 1
    wireGrossLengths['8_rojo'] += feederGrossLength;  // Phase 2
    wireGrossLengths['8_blanco'] += feederGrossLength; // Neutral
    wireGrossLengths['8_verde'] += feederGrossLength;  // Ground
  } else {
    wireGrossLengths['6_negro'] += feederGrossLength;
    wireGrossLengths['6_blanco'] += feederGrossLength;
    wireGrossLengths['8_verde'] += feederGrossLength;
  }

  // Round up wire lengths to nearest meter
  const wireTotalMeters: Record<string, number> = {};
  Object.keys(wireGrossLengths).forEach(k => {
    wireTotalMeters[k] = Math.ceil(wireGrossLengths[k]);
  });

  // 3. Deduct approved reusable wire
  const wireDeductedMeters: Record<string, number> = {};
  const wireToBuyMeters: Record<string, number> = {};

  Object.keys(wireTotalMeters).forEach(k => {
    const gauge = parseInt(k.split('_')[0], 10);
    // Find approved reusable wire of that gauge
    const approvedReusables = reusableWires.filter(rw => 
      rw.isApprovedByElectrician && 
      rw.wireGauge === gauge && 
      rw.continuityTested && 
      rw.meggerTested
    );
    const reusableTotal = approvedReusables.reduce((acc, rw) => acc + rw.lengthMeters, 0);

    const needed = wireTotalMeters[k] || 0;
    const canDeduct = Math.min(needed, reusableTotal);

    wireDeductedMeters[k] = canDeduct;
    wireToBuyMeters[k] = Math.max(0, needed - canDeduct);
  });

  // 4. Counts of devices
  const chalupasCount = elements.filter(e => 
    ['switch_single', 'switch_3way', 'outlet_duplex', 'outlet_gfci', 'led_mirror'].includes(e.type)
  ).length;

  const octagonalBoxesCount = elements.filter(e => 
    ['light_ceiling', 'junction_box'].includes(e.type)
  ).length;

  const switchesSingleCount = elements.filter(e => e.type === 'switch_single').length;
  const switches3WayCount = elements.filter(e => e.type === 'switch_3way').length;
  const outletsDuplexCount = elements.filter(e => e.type === 'outlet_duplex').length;
  const outletsGfciCount = elements.filter(e => e.type === 'outlet_gfci').length;
  const lightsCount = elements.filter(e => e.type === 'light_ceiling').length;

  // Connectors count: roughly 2 connectors per conduit run
  const connectorsCount = Math.max(24, conduits.length * 2);

  // 5. Build Material Catalogue
  const items: MaterialItem[] = [
    // Conductores
    {
      id: 'mat_wire_12_black',
      code: 'CND-12-BK',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 12 AWG THW-2-LS 90°C Negro (Fase)',
      technicalSpec: 'Cobre electrolítico suave 100% puro, aislamiento PVC retardante a la flama 600V, NOM-063-SCFI / NMX-J-010-ANCE',
      unit: 'm',
      quantityEstimated: wireToBuyMeters['12_negro'] || 80,
      quantificationMethod: 'Longitud de canalizaciones de 20A + 15% reserva de puntas y dobleces',
      unitPriceEco: 14.50,
      unitPriceMid: 18.20,
      unitPriceHigh: 23.50,
      supplierEco: 'IUSA / Ferretería Mayorista',
      supplierMid: 'Condumex / Casa Eléctrica',
      supplierHigh: 'Viakon / Home Depot',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_12_white',
      code: 'CND-12-WH',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 12 AWG THW-2-LS 90°C Blanco (Neutro)',
      technicalSpec: 'Cobre 100% puro, PVC blanco 600V antillama, baja emisión de humos (LS)',
      unit: 'm',
      quantityEstimated: wireToBuyMeters['12_blanco'] || 80,
      quantificationMethod: 'Canalizaciones de contactos de 20A + 15%',
      unitPriceEco: 14.50,
      unitPriceMid: 18.20,
      unitPriceHigh: 23.50,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_12_green',
      code: 'CND-12-GN',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 12 AWG THW-2-LS 90°C Verde (Puesta a tierra de equipos)',
      technicalSpec: 'Aislamiento verde NOM-001 Art. 250-134, conductor de protección obligatorio',
      unit: 'm',
      quantityEstimated: wireToBuyMeters['12_verde'] || 80,
      quantificationMethod: 'Tendido continuo en todos los ductos de 20A',
      unitPriceEco: 14.50,
      unitPriceMid: 18.20,
      unitPriceHigh: 23.50,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_14_black',
      code: 'CND-14-BK',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 14 AWG THW-2-LS 90°C Negro (Alumbrado)',
      technicalSpec: 'Cobre 14 AWG 600V NOM-ANCE para circuito C1 de 15A',
      unit: 'm',
      quantityEstimated: wireToBuyMeters['14_negro'] || 45,
      quantificationMethod: 'Circuito de alumbrado en losa + 15%',
      unitPriceEco: 9.80,
      unitPriceMid: 12.50,
      unitPriceHigh: 16.00,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_14_white',
      code: 'CND-14-WH',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 14 AWG THW-2-LS 90°C Blanco (Neutro Alumbrado)',
      technicalSpec: 'PVC blanco 14 AWG para neutro exclusivo de alumbrado',
      unit: 'm',
      quantityEstimated: wireToBuyMeters['14_blanco'] || 45,
      quantificationMethod: 'Llegada a centros de luz + 15%',
      unitPriceEco: 9.80,
      unitPriceMid: 12.50,
      unitPriceHigh: 16.00,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_14_red',
      code: 'CND-14-RD',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 14 AWG THW-2-LS 90°C Rojo/Azul (Retornos y puentes de conmutación)',
      technicalSpec: 'Para retornos de apagadores y puentes de 3 vías de pasillo',
      unit: 'm',
      quantityEstimated: wireToBuyMeters['14_rojo'] || 35,
      quantificationMethod: 'Bajadas de apagadores + puentes de escalera',
      unitPriceEco: 9.80,
      unitPriceMid: 12.50,
      unitPriceHigh: 16.00,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_feeder_8',
      code: 'CND-08-FDR',
      category: 'Conductores',
      description: 'Conductor de cobre Calibre 8 AWG THW-2-LS 90°C (Alimentador principal 2F+1N+1T)',
      technicalSpec: 'Cobre 8 AWG 600V (colores Negro, Rojo, Blanco, Verde). Ampacidad 50A @ 75°C',
      unit: 'm',
      quantityEstimated: (wireToBuyMeters['8_negro'] || 20) * 4, // 4 conductors total
      quantificationMethod: 'Trayectoria desde nuevo medidor CFE a Centro de Carga (16 m x 4 hilos = 64 m)',
      unitPriceEco: 34.00,
      unitPriceMid: 42.50,
      unitPriceHigh: 54.00,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'PENDIENTE_VALIDACION_CFE'
    },

    // Canalizaciones
    {
      id: 'mat_conduit_34',
      code: 'CAN-EMT-34',
      category: 'Canalizaciones',
      description: 'Tubo conduit metálico EMT / PVC pesado de 3/4" (19 mm) tramos de 3.0 m',
      technicalSpec: 'Tubería rígida ligera EMT cincada o PVC pesado cédula 40 certificada para bajadas en muros',
      unit: 'tramo',
      quantityEstimated: Math.max(12, Math.ceil((conduitLengths['3/4"'] || 36) / 3)),
      quantificationMethod: 'Metros modelados en plano / 3.0 m por tramo + 10%',
      unitPriceEco: 85.00,
      unitPriceMid: 110.00,
      unitPriceHigh: 145.00,
      supplierEco: 'Omega / Ferretería',
      supplierMid: 'Rymco EMT / Casa Eléctrica',
      supplierHigh: 'Crouse-Hinds Eaton',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_conduit_feeder_1',
      code: 'CAN-EMT-100',
      category: 'Canalizaciones',
      description: 'Tubo conduit metálico galvanizado de 1" (25 mm) para alimentador principal',
      technicalSpec: 'EMT o galvanizado pared delgada/gruesa para protección mecánica del alimentador por cubo de escalera',
      unit: 'tramo',
      quantityEstimated: Math.max(6, Math.ceil(feederLengthMeters / 3) + 1),
      quantificationMethod: 'Ruta vertical de acometida a tablero',
      unitPriceEco: 145.00,
      unitPriceMid: 185.00,
      unitPriceHigh: 240.00,
      supplierEco: 'Ferretería local',
      supplierMid: 'Rymco',
      supplierHigh: 'Crouse-Hinds',
      validationStatus: 'CONFIRMADO'
    },

    // Cajas y Accesorios
    {
      id: 'mat_chalupa_galv',
      code: 'CJ-CHAL-24',
      category: 'Cajas y Accesorios',
      description: 'Caja metálica rectangular chalupa 2" x 4" x 1 1/2" troquelada galvanizada',
      technicalSpec: 'Lámina de acero galvanizada en caliente cal. 18 con orificios de 1/2" y 3/4"',
      unit: 'pza',
      quantityEstimated: Math.max(18, chalupasCount),
      quantificationMethod: 'Conteo directo de contactos y apagadores en plano',
      unitPriceEco: 14.00,
      unitPriceMid: 19.50,
      unitPriceHigh: 26.00,
      supplierEco: 'Volteck',
      supplierMid: 'Bticino / Rymco',
      supplierHigh: 'Crouse-Hinds',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_caja_octagonal',
      code: 'CJ-OCT-4',
      category: 'Cajas y Accesorios',
      description: 'Caja metálica octagonal de 4" x 1 1/2" galvanizada para plafón',
      technicalSpec: 'Troqueles laterales y de fondo para tubería 1/2" y 3/4"',
      unit: 'pza',
      quantityEstimated: Math.max(8, octagonalBoxesCount),
      quantificationMethod: 'Salidas cenitales de losa y registros',
      unitPriceEco: 16.50,
      unitPriceMid: 22.00,
      unitPriceHigh: 31.00,
      supplierEco: 'Volteck',
      supplierMid: 'Rymco',
      supplierHigh: 'Crouse-Hinds',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_connectors_34',
      code: 'CON-EMT-34',
      category: 'Cajas y Accesorios',
      description: 'Conector recto metálico con tornillo de opresión para conduit 3/4"',
      technicalSpec: 'Zamak o acero galvanizado con contratuerca para fijación a chalupas y registros',
      unit: 'pza',
      quantityEstimated: connectorsCount,
      quantificationMethod: '2 piezas por cada remate de tubería en caja',
      unitPriceEco: 9.50,
      unitPriceMid: 14.00,
      unitPriceHigh: 21.00,
      supplierEco: 'Volteck',
      supplierMid: 'Rawelt / Rymco',
      supplierHigh: 'Appleton / Eaton',
      validationStatus: 'CONFIRMADO'
    },

    // Protecciones y Tableros
    {
      id: 'mat_load_center',
      code: 'TAB-QO-8',
      category: 'Protecciones y Tableros',
      description: 'Centro de Carga 8 polos QO empotrar monofásico/bifásico 100A NEMA 1',
      technicalSpec: 'Gabinete Square D Schneider Electric QOD8S o QOX208, barras estañadas de cobre/aluminio, incluye barra de tierra aislada PKGT1',
      unit: 'pza',
      quantityEstimated: 1,
      quantificationMethod: '1 centro de carga exclusivo para la vivienda en Planta Alta',
      unitPriceEco: 580.00,
      unitPriceMid: 820.00,
      unitPriceHigh: 1250.00,
      supplierEco: 'IUSA / Bticino',
      supplierMid: 'Square D Schneider QO',
      supplierHigh: 'Square D Plug-on Neutral',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_breaker_15',
      code: 'INT-QO-115',
      category: 'Protecciones y Tableros',
      description: 'Interruptor termomagnético 1 polo 15A 120/240V enchufable',
      technicalSpec: 'Tipo QO 1P 15A 10kA I.C. Square D Schneider Electric para circuito de alumbrado C1',
      unit: 'pza',
      quantityEstimated: 1,
      quantificationMethod: '1 para circuito C1 Alumbrado',
      unitPriceEco: 120.00,
      unitPriceMid: 165.00,
      unitPriceHigh: 230.00,
      supplierEco: 'Volteck',
      supplierMid: 'Square D Schneider',
      supplierHigh: 'Siemens / Square D',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_breaker_20',
      code: 'INT-QO-120',
      category: 'Protecciones y Tableros',
      description: 'Interruptor termomagnético 1 polo 20A 120/240V enchufable',
      technicalSpec: 'Tipo QO 1P 20A 10kA I.C. para circuitos derivados de contactos C2, C3, C4, C5, C6',
      unit: 'pza',
      quantityEstimated: 5,
      quantificationMethod: '5 interruptores derivados para contactos y áreas especiales',
      unitPriceEco: 125.00,
      unitPriceMid: 170.00,
      unitPriceHigh: 235.00,
      supplierEco: 'Volteck',
      supplierMid: 'Square D Schneider',
      supplierHigh: 'Siemens / Square D',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_breaker_main_40',
      code: 'INT-QO-240',
      category: 'Protecciones y Tableros',
      description: 'Interruptor termomagnético 2 polos 40A (Desconectador principal junto a medidor CFE)',
      technicalSpec: 'Para protección del alimentador principal a no más de 5.0 m del medidor exterior según norma CFE',
      unit: 'pza',
      quantityEstimated: 1,
      quantificationMethod: '1 interruptor principal en planta baja/fachada exterior',
      unitPriceEco: 310.00,
      unitPriceMid: 420.00,
      unitPriceHigh: 580.00,
      supplierEco: 'IUSA',
      supplierMid: 'Square D Schneider',
      supplierHigh: 'Square D QO240',
      validationStatus: 'PENDIENTE_VALIDACION_CFE'
    },

    // Dispositivos y Acabados
    {
      id: 'mat_outlet_gfci',
      code: 'DIS-GFCI-20',
      category: 'Dispositivos',
      description: 'Receptáculo dúplex GFCI 20A 125V con autoprueba y luz indicadora de falla',
      technicalSpec: 'Protección contra falla a tierra clase A 5mA, resistente a manipulación indebida (TR), NOM-003-SCFI',
      unit: 'pza',
      quantityEstimated: Math.max(4, outletsGfciCount || 4),
      quantificationMethod: '2 para cocina sobre barra/tarja + 2 para baños (1 en cada baño)',
      unitPriceEco: 195.00,
      unitPriceMid: 285.00,
      unitPriceHigh: 420.00,
      supplierEco: 'Volteck Pro',
      supplierMid: 'Bticino Modus / Leviton Smartlock',
      supplierHigh: 'Leviton Decora Plus / Bticino Living',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_outlet_duplex',
      code: 'DIS-DUP-15',
      category: 'Dispositivos',
      description: 'Contacto dúplex polarizado y aterrizado 15A 127V con placa',
      technicalSpec: 'Configuración NEMA 5-15R, terminales para cable 14-12 AWG con puesta a tierra',
      unit: 'pza',
      quantityEstimated: Math.max(12, outletsDuplexCount),
      quantificationMethod: 'Conteo en recámaras, sala, comedor y pasillo',
      unitPriceEco: 42.00,
      unitPriceMid: 68.00,
      unitPriceHigh: 115.00,
      supplierEco: 'Volteck Línea Lisboa',
      supplierMid: 'Bticino Quinziño MX',
      supplierHigh: 'Leviton Decora / Bticino LivingLight',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_switch_single',
      code: 'DIS-SW-1',
      category: 'Dispositivos',
      description: 'Apagador sencillo 1 módulo 10A/16A 127V con placa',
      technicalSpec: 'Mecanismo basculante silencioso con contactos de aleación de plata',
      unit: 'pza',
      quantityEstimated: Math.max(6, switchesSingleCount),
      quantificationMethod: 'Control de recámaras, baños y cocina',
      unitPriceEco: 38.00,
      unitPriceMid: 58.00,
      unitPriceHigh: 98.00,
      supplierEco: 'Volteck',
      supplierMid: 'Bticino Quinziño',
      supplierHigh: 'Bticino Living / Leviton',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_switch_3way',
      code: 'DIS-SW-3W',
      category: 'Dispositivos',
      description: 'Apagador de 3 vías (de escalera / conmutador) 10A 127V con placa',
      technicalSpec: 'Para encendido y apagado de alumbrado de pasillo desde dos extremos',
      unit: 'pza',
      quantityEstimated: Math.max(2, switches3WayCount || 2),
      quantificationMethod: '2 para extremos de pasillo y escalera',
      unitPriceEco: 48.00,
      unitPriceMid: 76.00,
      unitPriceHigh: 125.00,
      supplierEco: 'Volteck',
      supplierMid: 'Bticino Quinziño',
      supplierHigh: 'Bticino Living',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_led_downlight',
      code: 'LUM-LED-12W',
      category: 'Dispositivos',
      description: 'Luminaria de sobreponer / empotrar LED 12W 120V Luz Cálida/Neutra 3000K-4000K',
      technicalSpec: 'Cuerpo de aluminio y difusor opalino, 950 lúmenes, factor de potencia > 0.9, vida útil 30,000 h',
      unit: 'pza',
      quantityEstimated: Math.max(8, lightsCount),
      quantificationMethod: '1 por cada salida de centro en habitaciones, pasillo y baños',
      unitPriceEco: 85.00,
      unitPriceMid: 145.00,
      unitPriceHigh: 260.00,
      supplierEco: 'Volteck LED',
      supplierMid: 'TecnoLite / Philips LED',
      supplierHigh: 'Osram Ledvance / Lutron',
      validationStatus: 'CONFIRMADO'
    },

    // Acometida y Puesta a Tierra (CFE)
    {
      id: 'mat_cfe_base_meter',
      code: 'CFE-BASE-5T',
      category: 'Acometida y Puesta a Tierra',
      description: 'Base para watthorímetro 5 terminales 100A bifásica cuadrada 120/240V',
      technicalSpec: 'Gabinete de lámina galvanizada con pintura electrostática gris, terminales de latón, aro para sello de CFE, especificación CFE GIC00-05',
      unit: 'pza',
      quantityEstimated: 1,
      quantificationMethod: '1 base para el nuevo servicio independiente',
      unitPriceEco: 380.00,
      unitPriceMid: 485.00,
      unitPriceHigh: 650.00,
      supplierEco: 'IUSA',
      supplierMid: 'Square D / Bticino',
      supplierHigh: 'Square D Schneider',
      validationStatus: 'PENDIENTE_VALIDACION_CFE'
    },
    {
      id: 'mat_cfe_mufa_tubo',
      code: 'CFE-MUFA-114',
      category: 'Acometida y Puesta a Tierra',
      description: 'Mufa para acometida de aluminio de 1 1/4" con tubo conduit galvanizado pared gruesa 3.0 m',
      technicalSpec: 'Mufa roscada para servicio aéreo, tubo galvanizado por inmersión en caliente según especificación CFE CFE-EM-BT101/102',
      unit: 'jgo',
      quantityEstimated: 1,
      quantificationMethod: '1 juego completo de recepción aérea en fachada',
      unitPriceEco: 420.00,
      unitPriceMid: 560.00,
      unitPriceHigh: 750.00,
      supplierEco: 'IUSA / Ferretera',
      supplierMid: 'Rymco / Bticino',
      supplierHigh: 'Crouse-Hinds',
      validationStatus: 'PENDIENTE_VALIDACION_CFE'
    },
    {
      id: 'mat_ground_rod',
      code: 'TR-VAR-58',
      category: 'Acometida y Puesta a Tierra',
      description: 'Varilla de puesta a tierra de acero recubierta de cobre tipo Copperweld 5/8" x 3.0 m',
      technicalSpec: 'Capa electrolítica de cobre de 0.25 mm (254 micras), certificada bajo NMX-J-549-ANCE y NOM-001 Art. 250-52(a)(5)',
      unit: 'pza',
      quantityEstimated: 1,
      quantificationMethod: '1 electrodo para el nuevo sistema de tierra de la base de medición',
      unitPriceEco: 340.00,
      unitPriceMid: 440.00,
      unitPriceHigh: 590.00,
      supplierEco: 'Volteck',
      supplierMid: 'IUSA / Total Ground',
      supplierHigh: 'Total Ground / Burndy',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_ground_clamp',
      code: 'TR-CON-58',
      category: 'Acometida y Puesta a Tierra',
      description: 'Conector mecánico de bronce para varilla de 5/8" a conductor 8-4 AWG',
      technicalSpec: 'Bronce de alta resistencia a la corrosión para enterramiento directo (Direct Burial DB)',
      unit: 'pza',
      quantityEstimated: 1,
      quantificationMethod: 'Unión mecánica entre varilla y cable electrodo',
      unitPriceEco: 45.00,
      unitPriceMid: 65.00,
      unitPriceHigh: 95.00,
      supplierEco: 'Volteck',
      supplierMid: 'Burndy / IUSA',
      supplierHigh: 'Burndy',
      validationStatus: 'CONFIRMADO'
    },
    {
      id: 'mat_wire_ground_bare',
      code: 'TR-CND-8D',
      category: 'Acometida y Puesta a Tierra',
      description: 'Conductor de cobre suave desnudo Calibre 8 AWG para electrodo de tierra',
      technicalSpec: 'Cobre electrolítico desnudo según NOM-001 Tabla 250-66',
      unit: 'm',
      quantityEstimated: 8,
      quantificationMethod: 'Distancia desde base de medidor hasta varilla enterrada en jardín/banqueta',
      unitPriceEco: 32.00,
      unitPriceMid: 41.00,
      unitPriceHigh: 52.00,
      supplierEco: 'IUSA',
      supplierMid: 'Condumex',
      supplierHigh: 'Viakon',
      validationStatus: 'CONFIRMADO'
    }
  ];

  // Calculate totals for each scenario
  const totalCostEco = items.reduce((sum, item) => sum + (item.quantityEstimated * item.unitPriceEco), 0);
  const totalCostMid = items.reduce((sum, item) => sum + (item.quantityEstimated * item.unitPriceMid), 0);
  const totalCostHigh = items.reduce((sum, item) => sum + (item.quantityEstimated * item.unitPriceHigh), 0);

  return {
    items,
    conduitTotalMeters: conduitLengths,
    wireTotalMeters,
    wireDeductedMeters,
    wireToBuyMeters,
    totalCostEco: Math.round(totalCostEco),
    totalCostMid: Math.round(totalCostMid),
    totalCostHigh: Math.round(totalCostHigh),
  };
}
