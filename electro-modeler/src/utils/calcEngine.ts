// Engine for electrical engineering calculations according to NOM-001-SEDE-2012 & CFE standards

import type { Circuit, LoadItem, Room } from '../types.ts';

export const COPPER_WIRE_DATA: Record<number, {
  rOhmPerKm: number;
  xOhmPerKm: number;
  ampacity75C: number;
  ampacity90C: number;
  maxBreakerAmps: number;
}> = {
  14: { rOhmPerKm: 10.17, xOhmPerKm: 0.16, ampacity75C: 20, ampacity90C: 25, maxBreakerAmps: 15 },
  12: { rOhmPerKm: 6.40, xOhmPerKm: 0.15, ampacity75C: 25, ampacity90C: 30, maxBreakerAmps: 20 },
  10: { rOhmPerKm: 4.02, xOhmPerKm: 0.15, ampacity75C: 35, ampacity90C: 40, maxBreakerAmps: 30 },
  8:  { rOhmPerKm: 2.52, xOhmPerKm: 0.14, ampacity75C: 50, ampacity90C: 55, maxBreakerAmps: 40 },
  6:  { rOhmPerKm: 1.59, xOhmPerKm: 0.14, ampacity75C: 65, ampacity90C: 75, maxBreakerAmps: 60 },
  4:  { rOhmPerKm: 1.00, xOhmPerKm: 0.13, ampacity75C: 85, ampacity90C: 95, maxBreakerAmps: 80 },
};

/**
 * Calculates voltage drop percentage (% e)
 * Reference: NOM-001-SEDE-2012 Art. 210-19(a) Nota 4 and Art. 215-2(a) Nota 2
 * Maximum allowable: <= 3% in branch circuit, <= 3% in feeder, <= 5% total combined.
 *
 * Formula: % e = (2 * L * I * z) / V_nominal * 100
 * where z = R * cos(phi) + X * sin(phi)
 */
export function calculateVoltageDrop(params: {
  lengthMeters: number;
  currentAmps: number;
  wireGaugeAwg: number;
  voltage: 120 | 240;
  powerFactor?: number;
}): {
  dropVolts: number;
  dropPercent: number;
  isCompliant: boolean;
  maxAllowedPercent: number;
  formula: string;
} {
  const { lengthMeters, currentAmps, wireGaugeAwg, voltage, powerFactor = 0.90 } = params;
  const wire = COPPER_WIRE_DATA[wireGaugeAwg] || COPPER_WIRE_DATA[12];
  
  const cosPhi = powerFactor;
  const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
  
  // Convert ohm/km to ohm/m
  const rOhmPerMeter = wire.rOhmPerKm / 1000;
  const xOhmPerMeter = wire.xOhmPerKm / 1000;
  const zOhmPerMeter = rOhmPerMeter * cosPhi + xOhmPerMeter * sinPhi;
  
  // 1-phase 2-wire drop
  const dropVolts = 2 * lengthMeters * currentAmps * zOhmPerMeter;
  const dropPercent = (dropVolts / voltage) * 100;
  const maxAllowedPercent = 3.0; // 3% for branch circuit according to NOM
  
  return {
    dropVolts: Number(dropVolts.toFixed(2)),
    dropPercent: Number(dropPercent.toFixed(2)),
    isCompliant: dropPercent <= maxAllowedPercent,
    maxAllowedPercent,
    formula: `% e = (2 * ${lengthMeters.toFixed(1)}m * ${currentAmps.toFixed(1)}A * ${zOhmPerMeter.toFixed(5)}Ω/m) / ${voltage}V * 100 = ${dropPercent.toFixed(2)}%`
  };
}

/**
 * Calculates temperature and grouping derating factors
 * NOM-001-SEDE-2012 Tabla 310-15(b)(2)(a) and Tabla 310-15(b)(3)(a)
 */
export function getDeratingFactors(ambientTempC: number, currentCarryingConductorsCount: number): {
  tempFactor: number;
  groupingFactor: number;
  totalDerating: number;
} {
  // 75°C column THW-2 / THHN
  let tempFactor = 1.0;
  if (ambientTempC <= 30) tempFactor = 1.00;
  else if (ambientTempC <= 35) tempFactor = 0.94;
  else if (ambientTempC <= 40) tempFactor = 0.88;
  else if (ambientTempC <= 45) tempFactor = 0.82;
  else tempFactor = 0.75;

  let groupingFactor = 1.0;
  if (currentCarryingConductorsCount <= 3) groupingFactor = 1.00;
  else if (currentCarryingConductorsCount <= 6) groupingFactor = 0.80;
  else if (currentCarryingConductorsCount <= 9) groupingFactor = 0.70;
  else groupingFactor = 0.50;

  return {
    tempFactor,
    groupingFactor,
    totalDerating: Number((tempFactor * groupingFactor).toFixed(3))
  };
}

/**
 * Demand calculation according to NOM-001-SEDE-2012 Art. 220
 * Total General Lighting (33 VA/m²) + Kitchen Small Appliances (2 circuits @ 1500 VA = 3000 VA) + Laundry (1500 VA)
 * Demand Factors (Tabla 220-42):
 * First 3,000 VA @ 100%
 * 3,001 to 120,000 VA @ 35%
 */
export function calculateResidentialDemand(params: {
  rooms: Room[];
  loads: LoadItem[];
  systemType: '2F-3H (120/240V)' | '1F-2H (120V)';
}): {
  floorAreaM2: number;
  generalLightingVa: number;
  smallApplianceVa: number;
  laundryVa: number;
  subtotalLightingApplianceVa: number;
  demandLightingApplianceVa: number;
  specialLoadsVa: number;
  totalConnectedWatts: number;
  totalConnectedVa: number;
  totalDemandVa: number;
  feederCurrentAmps: number;
  recommendedFeederBreaker: number;
  recommendedFeederWireAwg: number;
  recommendedNeutralWireAwg: number;
  recommendedGroundWireAwg: number;
  recommendedConduitInch: string;
} {
  const { rooms, loads, systemType } = params;
  
  // Exclude exterior facade from enclosed conditioned floor area
  const interiorRooms = rooms.filter(r => r.type !== 'exterior_facade');
  const floorAreaM2 = interiorRooms.reduce((acc, r) => acc + (r.width * r.height), 0);
  
  // NOM Art. 220-12: 33 VA/m² for dwelling units
  const generalLightingVa = Math.max(1200, Math.round(floorAreaM2 * 33));
  
  // NOM Art. 220-52: 2 circuits for small kitchen appliances @ 1500 VA each = 3000 VA
  const smallApplianceVa = 3000;
  // 1 laundry circuit @ 1500 VA
  const laundryVa = 1500;
  
  const subtotalLightingApplianceVa = generalLightingVa + smallApplianceVa + laundryVa;
  
  // Tabla 220-42 Demand factor
  let demandLightingApplianceVa = 0;
  if (subtotalLightingApplianceVa <= 3000) {
    demandLightingApplianceVa = subtotalLightingApplianceVa;
  } else {
    demandLightingApplianceVa = 3000 + (subtotalLightingApplianceVa - 3000) * 0.35;
  }
  
  // Special loads from load table
  const specialLoads = loads.filter(l => l.category === 'special' || l.category === 'appliance');
  const specialLoadsVa = specialLoads.reduce((acc, l) => acc + (l.va * l.quantity), 0);
  
  const totalConnectedWatts = loads.reduce((acc, l) => acc + (l.watts * l.quantity), 0);
  const totalConnectedVa = loads.reduce((acc, l) => acc + (l.va * l.quantity), 0) + generalLightingVa;
  
  const totalDemandVa = Math.round(demandLightingApplianceVa + specialLoadsVa);
  
  // Feeder current calculation
  let feederCurrentAmps = 0;
  let recommendedFeederBreaker = 30;
  let recommendedFeederWireAwg = 10;
  let recommendedNeutralWireAwg = 10;
  let recommendedGroundWireAwg = 10;
  let recommendedConduitInch = '3/4"';
  
  if (systemType === '2F-3H (120/240V)') {
    // 2 phases, 240V line-to-line
    feederCurrentAmps = totalDemandVa / (240 * 0.90);
    // Apply 125% continuous safety factor for service entrance sizing (NOM Art. 215-2)
    const designAmps = feederCurrentAmps * 1.25;
    
    if (designAmps <= 30) {
      recommendedFeederBreaker = 40; // 2x40A main breaker
      recommendedFeederWireAwg = 8;  // 8 AWG Cu THHN (50A rating @ 75C)
      recommendedNeutralWireAwg = 8;
      recommendedGroundWireAwg = 8;  // NOM Tabla 250-122
      recommendedConduitInch = '1"'; // for 2#8 + 1#8N + 1#8T
    } else {
      recommendedFeederBreaker = 50; // 2x50A
      recommendedFeederWireAwg = 6;  // 6 AWG Cu THHN (65A rating @ 75C)
      recommendedNeutralWireAwg = 6;
      recommendedGroundWireAwg = 8;
      recommendedConduitInch = '1 1/4"';
    }
  } else {
    // 1 phase, 120V
    feederCurrentAmps = totalDemandVa / (120 * 0.90);
    const designAmps = feederCurrentAmps * 1.25;
    
    if (designAmps <= 40) {
      recommendedFeederBreaker = 50; // 1x50A
      recommendedFeederWireAwg = 6;  // 6 AWG Cu THHN
      recommendedNeutralWireAwg = 6;
      recommendedGroundWireAwg = 8;
      recommendedConduitInch = '1"';
    } else {
      recommendedFeederBreaker = 60; // 1x60A
      recommendedFeederWireAwg = 4;  // 4 AWG Cu THHN
      recommendedNeutralWireAwg = 4;
      recommendedGroundWireAwg = 8;
      recommendedConduitInch = '1 1/4"';
    }
  }
  
  return {
    floorAreaM2: Number(floorAreaM2.toFixed(1)),
    generalLightingVa,
    smallApplianceVa,
    laundryVa,
    subtotalLightingApplianceVa,
    demandLightingApplianceVa: Math.round(demandLightingApplianceVa),
    specialLoadsVa,
    totalConnectedWatts,
    totalConnectedVa,
    totalDemandVa,
    feederCurrentAmps: Number(feederCurrentAmps.toFixed(1)),
    recommendedFeederBreaker,
    recommendedFeederWireAwg,
    recommendedNeutralWireAwg,
    recommendedGroundWireAwg,
    recommendedConduitInch
  };
}
