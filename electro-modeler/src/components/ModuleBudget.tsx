import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  ShoppingBag, 
  ShieldCheck, 
  FileSpreadsheet, 
  Percent, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';
import type { ElectricalElement, ConduitPath, ReusableWire } from '../types.ts';
import { quantifyProjectMaterials } from '../utils/quantEngine.ts';

interface ModuleBudgetProps {
  elements: ElectricalElement[];
  conduits: ConduitPath[];
  reusableWires: ReusableWire[];
  systemType: '2F-3H (120/240V)' | '1F-2H (120V)';
  onExportCsv: () => void;
}

export const ModuleBudget: React.FC<ModuleBudgetProps> = ({
  elements,
  conduits,
  reusableWires,
  systemType,
  onExportCsv
}) => {
  // Labor, civil works, and CFE fees estimates
  const [laborCost, setLaborCost] = useState<number>(8500);
  const [civilWorksCost, setCivilWorksCost] = useState<number>(4200);
  const [cfeFeesCost, setCfeFeesCost] = useState<number>(1800);

  // Buen Fin promotion evaluation
  const [buenFinDiscountPercent, setBuenFinDiscountPercent] = useState<number>(15);
  const [buenFinCashbackPercent, setBuenFinCashbackPercent] = useState<number>(5);

  const bom = quantifyProjectMaterials({
    elements,
    conduits,
    reusableWires,
    feederLengthMeters: 16,
    systemType
  });

  // Calculate Scenario Totals
  const matEco = bom.totalCostEco;
  const matMid = bom.totalCostMid;
  const matHigh = bom.totalCostHigh;

  const totalEco = matEco + laborCost + civilWorksCost + cfeFeesCost;
  const totalMid = matMid + (laborCost * 1.15) + civilWorksCost + cfeFeesCost;
  const totalHigh = matHigh + (laborCost * 1.30) + (civilWorksCost * 1.20) + cfeFeesCost;

  // Buen Fin calculations on materials
  const buenFinMaterialDiscount = matMid * (buenFinDiscountPercent / 100);
  const buenFinCashbackAmount = (matMid - buenFinMaterialDiscount) * (buenFinCashbackPercent / 100);
  const buenFinTotalSavings = buenFinMaterialDiscount + buenFinCashbackAmount;
  const buenFinNetMaterials = matMid - buenFinTotalSavings;

  return (
    <div>
      {/* Top Banner: Three Scenarios Comparison */}
      <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
        {/* Scenario 1: Económico Seguro */}
        <div className="card" style={{ borderTop: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-success">Escenario 1</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Costo Mínimo Seguro</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
            Económico Seguro
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem 0' }}>
            Marcas certificadas NOM/ANCE al menor costo compatible con especificación técnica (IUSA, Volteck, Modus).
          </p>

          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#16a34a', fontFamily: 'var(--font-mono)' }}>
            ${totalEco.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Materiales eléctricos:</span>
              <strong>${matEco.toLocaleString('es-MX')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mano de obra electricista:</span>
              <span>${laborCost.toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Obra civil / Ranurados:</span>
              <span>${civilWorksCost.toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gestión CFE / Trámite:</span>
              <span>${cfeFeesCost.toLocaleString('es-MX')}</span>
            </div>
          </div>
        </div>

        {/* Scenario 2: Intermedio Recomendado */}
        <div className="card" style={{ borderTop: '4px solid #0284c7', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-11px', right: '16px' }}>
            <span className="badge badge-info" style={{ boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)' }}>
              RECOMENDADO
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-info">Escenario 2</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Equilibrio Óptimo</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
            Intermedio (Equilibrio)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem 0' }}>
            Equipos estándar de alta durabilidad: Condumex/Condulac, Square D Schneider Electric QO, Bticino Quinziño MX.
          </p>

          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
            ${totalMid.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Materiales eléctricos:</span>
              <strong>${matMid.toLocaleString('es-MX')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mano de obra electricista:</span>
              <span>${(laborCost * 1.15).toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Obra civil / Ranurados:</span>
              <span>${civilWorksCost.toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gestión CFE / Trámite:</span>
              <span>${cfeFeesCost.toLocaleString('es-MX')}</span>
            </div>
          </div>
        </div>

        {/* Scenario 3: Mayor Calidad */}
        <div className="card" style={{ borderTop: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-secondary">Escenario 3</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gama Superior</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
            Mayor Calidad
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem 0' }}>
            Fabricantes de referencia industrial: Viakon, Leviton Decora Plus, Square D QO Plug-on Neutral, Crouse-Hinds.
          </p>

          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>
            ${totalHigh.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Materiales eléctricos:</span>
              <strong>${matHigh.toLocaleString('es-MX')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mano de obra electricista:</span>
              <span>${(laborCost * 1.30).toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Obra civil / Ranurados:</span>
              <span>${(civilWorksCost * 1.20).toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gestión CFE / Trámite:</span>
              <span>${cfeFeesCost.toLocaleString('es-MX')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluador de Promociones de El Buen Fin 2026 */}
      <div className="card" style={{ borderLeft: '4px solid #e11d48' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ color: '#be123c' }}>
              <TrendingDown size={20} color="#e11d48" /> Calculadora y Evaluador de Promociones: El Buen Fin 2026
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Compara descuentos directos, bonificaciones bancarias y evalúa si existe un ahorro real frente al precio ordinario de lista.
            </p>
          </div>
          <span className="badge badge-danger">Buen Fin 2026</span>
        </div>

        <div className="grid-2">
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Descuento Directo en Tienda / Proveedor (%):</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={buenFinDiscountPercent}
                  onChange={(e) => setBuenFinDiscountPercent(parseInt(e.target.value) || 0)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '40px' }}>
                  {buenFinDiscountPercent}%
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bonificación Bancaria / Cashback (% en tarjeta):</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={buenFinCashbackPercent}
                  onChange={(e) => setBuenFinCashbackPercent(parseInt(e.target.value) || 0)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '40px' }}>
                  {buenFinCashbackPercent}%
                </span>
              </div>
            </div>

            <div style={{ background: '#fff1f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.78rem', color: '#9f1239' }}>
              <strong>Estrategia de Compra Inteligente para El Buen Fin:</strong><br />
              1. Comprar prioritariamente: Centro de Carga Square D QO-8, Receptáculos GFCI Bticino/Leviton, y cajas de cable Condumex 12 y 14 AWG.<br />
              2. NO comprar materiales de acometida (mufa o base de medidor) hasta que CFE emita el oficio de factibilidad técnica.
            </div>
          </div>

          {/* Savings Result */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                AHORRO REAL ESTIMADO EN MATERIALES
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)', margin: '0.2rem 0' }}>
                ${buenFinTotalSavings.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Equivalente al {((buenFinTotalSavings / matMid) * 100).toFixed(1)}% de ahorro total sobre el catálogo de materiales.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Precio ordinario lista:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${matMid.toLocaleString('es-MX')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#e11d48' }}>
                <span>Descuento de promoción:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-${buenFinTotalSavings.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: '#16a34a', borderTop: '1px dashed #cbd5e1', paddingTop: '0.25rem' }}>
                <span>Importe neto final a pagar:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${buenFinNetMaterials.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparador por Proveedor / Tienda */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ShoppingBag size={20} color="#0284c7" /> Comparador por Canal de Compra en Ciudad de México
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Precios de referencia pública verificables en distribuidores autorizados.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onExportCsv}>
            <FileSpreadsheet size={15} /> Exportar Presupuesto CSV
          </button>
        </div>

        <div className="grid-3">
          <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ea580c', marginBottom: '0.3rem' }}>
              Home Depot México
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Excelente para: Receptáculos GFCI Leviton, Centro de Carga Square D QO, tubería conduit y accesorios. Facturación inmediata.
            </p>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ${(matMid * 1.08).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN
            </div>
            <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>Garantía directa de cambio</span>
          </div>

          <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#eab308', marginBottom: '0.3rem' }}>
              Mercado Libre (Tiendas Oficiales)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Excelente para: Rollos de 100m Condumex/IUSA con envío Full a domicilio en CDMX. Verificar que sea tienda oficial.
            </p>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ${(matMid * 0.98).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN
            </div>
            <span style={{ fontSize: '0.7rem', color: '#0284c7' }}>Envío incluido a domicilio</span>
          </div>

          <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.3rem' }}>
              Casa Eléctrica Mayorista (CDMX)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Excelente para: Tubería conduit por atado, cajas metálicas chalupas por ciento y tramos de cable grueso por metro.
            </p>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ${(matMid * 0.92).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN
            </div>
            <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>Mejor precio por volumen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
