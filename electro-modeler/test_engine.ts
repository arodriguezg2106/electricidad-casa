// Automated Test Suite for Electrical Formulas, Demand Calculations, and Material Quantification
// Verification under NOM-001-SEDE-2012 and CFE Standards

import { calculateVoltageDrop, getDeratingFactors, calculateResidentialDemand, COPPER_WIRE_DATA } from './src/utils/calcEngine.ts';
import { quantifyProjectMaterials } from './src/utils/quantEngine.ts';
import { initialProject } from './src/data/initialProject.ts';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    failedTests++;
  }
}

console.log('=====================================================');
console.log('PRUEBAS AUTOMATIZADAS: MOTOR DE CÁLCULO VOLTHOME CDMX');
console.log('Normativas: NOM-001-SEDE-2012 / NMX-J-ANCE / CFE BT');
console.log('=====================================================\n');

// TEST 1: Caída de tensión en circuito de 120V (12 AWG, 20m, 12A)
const dropResult = calculateVoltageDrop({
  lengthMeters: 20,
  currentAmps: 12,
  wireGaugeAwg: 12,
  voltage: 120,
  powerFactor: 0.90
});
// R = 6.4 ohm/km = 0.0064 ohm/m; z = 0.0064 * 0.90 + 0.00015 * 0.4358 = 0.005825 ohm/m
// 2 * 20 * 12 * 0.005825 = 2.796 V; % = 2.796 / 120 * 100 = 2.33%
assert(dropResult.dropPercent > 2.0 && dropResult.dropPercent < 2.6, 
  'Cálculo de Caída de Tensión 120V 12 AWG', 
  `Calculado: ${dropResult.dropPercent}%, esperado ~2.33%`);
assert(dropResult.isCompliant === true, 
  'Validación de cumplimiento normativo NOM (<= 3.0% en circuito derivado)');

// TEST 2: Caída de tensión excesiva (> 3%)
const highDrop = calculateVoltageDrop({
  lengthMeters: 45,
  currentAmps: 16,
  wireGaugeAwg: 14,
  voltage: 120
});
assert(highDrop.isCompliant === false, 
  'Detección de sobrepaso de límite normativo de caída de tensión (> 3%)',
  `Caída calculada: ${highDrop.dropPercent}%`);

// TEST 3: Factores de corrección por temperatura y agrupamiento (NOM Tabla 310-15)
const deratingNormal = getDeratingFactors(30, 3);
assert(deratingNormal.tempFactor === 1.00 && deratingNormal.groupingFactor === 1.00, 
  'Factores base a 30°C y hasta 3 conductores (Factores = 1.00)');

const deratingHarsh = getDeratingFactors(40, 6);
// Temp factor @ 40C = 0.88, Grouping 4-6 conductors = 0.80 -> 0.88 * 0.80 = 0.704
assert(deratingHarsh.tempFactor === 0.88 && deratingHarsh.groupingFactor === 0.80, 
  'Factores de corrección a 40°C y 6 conductores agrupados (NOM Art. 310-15)');
assert(Math.abs(deratingHarsh.totalDerating - 0.704) < 0.01, 
  'Factor total de derrateo térmico/agrupamiento = 0.704');

// TEST 4: Cálculo de Demanda Residencial (NOM Art. 220)
const demand2F = calculateResidentialDemand({
  rooms: initialProject.rooms,
  loads: initialProject.loads,
  systemType: '2F-3H (120/240V)'
});

assert(demand2F.floorAreaM2 > 50 && demand2F.floorAreaM2 < 120, 
  `Cálculo de superficie construida interior (${demand2F.floorAreaM2} m²)`);
assert(demand2F.smallApplianceVa === 3000, 
  'Carga obligatoria para 2 circuitos de cocina (3,000 VA según Art. 220-52)');
assert(demand2F.laundryVa === 1500, 
  'Carga obligatoria para circuito de lavado (1,500 VA según Art. 220-52)');

// Demanda total debe ser menor que la carga total conectada debido al factor de diversificación
assert(demand2F.totalDemandVa < demand2F.totalConnectedVa, 
  `Factor de demanda diversificado (Demanda: ${demand2F.totalDemandVa} VA < Conectada: ${demand2F.totalConnectedVa} VA)`);
assert(demand2F.recommendedFeederBreaker >= 40, 
  `Interruptor de acometida dimensionado adecuadamente (>= 40A para 2F-3H, actual: ${demand2F.recommendedFeederBreaker}A)`);
assert(demand2F.recommendedFeederWireAwg <= 8, 
  `Calibre del alimentador reglamentario (Calibre ${demand2F.recommendedFeederWireAwg} AWG)`);

// TEST 5: Cuantificación automática de materiales
const bom = quantifyProjectMaterials({
  elements: initialProject.elements,
  conduits: initialProject.conduits,
  reusableWires: initialProject.reusableWires,
  feederLengthMeters: 16,
  systemType: '2F-3H (120/240V)'
});

assert(bom.items.length >= 15, 
  `Catálogo completo de materiales generado (${bom.items.length} partidas)`);
assert(bom.totalCostEco < bom.totalCostMid && bom.totalCostMid < bom.totalCostHigh, 
  `Jerarquía coherente de escenarios presupuestarios (Eco: $${bom.totalCostEco} < Medio: $${bom.totalCostMid} < Alto: $${bom.totalCostHigh} MXN)`);

// TEST 6: Deducción estricta de cable reutilizable
// Los cables en initialProject tienen continuityTested=false, meggerTested=false, isApprovedByElectrician=false
// Por lo tanto, la deducción aprobada DEBE ser 0 hasta que el electricista lo apruebe formalmente!
const unapprovedDeduction = Object.values(bom.wireDeductedMeters).reduce((a, b) => a + b, 0);
assert(unapprovedDeduction === 0, 
  'Seguridad: Cable no probado NO se descuenta de compras (Deducción no aprobada = 0 m)');

// TEST 7: Descuento tras aprobación de electricista
const approvedWireProject = [
  {
    ...initialProject.reusableWires[0],
    continuityTested: true,
    meggerTested: true,
    isApprovedByElectrician: true,
    lengthMeters: 30
  }
];
const bomApproved = quantifyProjectMaterials({
  elements: initialProject.elements,
  conduits: initialProject.conduits,
  reusableWires: approvedWireProject,
  feederLengthMeters: 16,
  systemType: '2F-3H (120/240V)'
});
const approvedDeduction = bomApproved.wireDeductedMeters['12_negro'] || 0;
assert(approvedDeduction > 0, 
  `Descuento efectivo tras aprobación formal con megóhmetro (${approvedDeduction} m descontados)`);

console.log('\n=====================================================');
console.log(`RESUMEN DE PRUEBAS: ${passedTests} PASADAS, ${failedTests} FALLIDAS`);
console.log('=====================================================');

if (failedTests > 0) {
  process.exit(1);
}
