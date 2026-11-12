// CSV Budget Exporter compatible with Microsoft Excel (UTF-8 BOM)

import type { MaterialItem } from '../types.ts';

export function exportBudgetToCsv(
  items: MaterialItem[],
  totalEco: number,
  totalMid: number,
  totalHigh: number,
  laborCost: number = 8500,
  civilWorksCost: number = 4200,
  cfeFeesCost: number = 1800
): string {
  // UTF-8 BOM for clean display of Spanish accents and characters in Excel
  let csv = '\uFEFF';

  csv += 'SISTEMA DE MODELADO Y CÁLCULO ELÉCTRICO RESIDENCIAL - PRESUPUESTO VOLTHOME CDMX\n';
  csv += `Fecha de generación: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}\n`;
  csv += 'Normativa: NOM-001-SEDE-2012 / CFE Baja Tensión\n\n';

  csv += 'RESUMEN EJECUTIVO POR ESCENARIOS (MXN)\n';
  csv += 'Rubro,Escenario Económico Seguro,Escenario Intermedio (Recomendado),Escenario Mayor Calidad\n';
  csv += `Materiales Eléctricos Certificados,${totalEco.toFixed(2)},${totalMid.toFixed(2)},${totalHigh.toFixed(2)}\n`;
  csv += `Mano de Obra Calificada (Electricista NOM),${laborCost.toFixed(2)},${(laborCost * 1.15).toFixed(2)},${(laborCost * 1.30).toFixed(2)}\n`;
  csv += `Obra Civil (Ranurados / Resanes / Sellos),${civilWorksCost.toFixed(2)},${civilWorksCost.toFixed(2)},${(civilWorksCost * 1.20).toFixed(2)}\n`;
  csv += `Gestión y Preparación Acometida CFE,${cfeFeesCost.toFixed(2)},${cfeFeesCost.toFixed(2)},${cfeFeesCost.toFixed(2)}\n`;
  
  const grandTotalEco = totalEco + laborCost + civilWorksCost + cfeFeesCost;
  const grandTotalMid = totalMid + (laborCost * 1.15) + civilWorksCost + cfeFeesCost;
  const grandTotalHigh = totalHigh + (laborCost * 1.30) + (civilWorksCost * 1.20) + cfeFeesCost;
  
  csv += `TOTAL ESTIMADO DE OBRA,${grandTotalEco.toFixed(2)},${grandTotalMid.toFixed(2)},${grandTotalHigh.toFixed(2)}\n\n`;

  csv += 'CATÁLOGO DETALLADO Y CUANTIFICADO DE MATERIALES\n';
  csv += 'Clave,Categoría,Descripción Técnica,Unidad,Cantidad,P.U. Eco,Importe Eco,P.U. Medio,Importe Medio,P.U. Alto,Importe Alto,Proveedor Referencia,Estado Validación\n';

  items.forEach(it => {
    const impEco = (it.quantityEstimated * it.unitPriceEco).toFixed(2);
    const impMid = (it.quantityEstimated * it.unitPriceMid).toFixed(2);
    const impHigh = (it.quantityEstimated * it.unitPriceHigh).toFixed(2);

    const descClean = `"${it.description.replace(/"/g, '""')}"`;
    const provClean = `"${it.supplierMid.replace(/"/g, '""')}"`;

    csv += `${it.code},${it.category},${descClean},${it.unit},${it.quantityEstimated},${it.unitPriceEco.toFixed(2)},${impEco},${it.unitPriceMid.toFixed(2)},${impMid},${it.unitPriceHigh.toFixed(2)},${impHigh},${provClean},${it.validationStatus}\n`;
  });

  csv += '\nNOTAS Y SUPUESTOS TÉCNICOS:\n';
  csv += '1. Los precios corresponden a cotizaciones de mercado en distribuidores de CDMX (Home Depot, Casas de Material Eléctrico y Mercado Libre Oficial).\n';
  csv += '2. El presupuesto asume la ejecución de un nuevo servicio independiente con segundo medidor de CFE.\n';
  csv += '3. No se permite la supresión de dispositivos de seguridad (como interruptores GFCI o varilla de tierra) para reducir costos.\n';
  csv += '4. Los tramos de cable existente se descontarán formalmente solo tras la aprobación con megóhmetro por parte del electricista responsable.\n';

  return csv;
}
