import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { ElectricalElement, ConduitPath, ReusableWire, MaterialItem } from '../types.ts';
import { quantifyProjectMaterials } from '../utils/quantEngine.ts';

interface ModuleMaterialsProps {
  elements: ElectricalElement[];
  conduits: ConduitPath[];
  reusableWires: ReusableWire[];
  systemType: '2F-3H (120/240V)' | '1F-2H (120V)';
  onUpdateReusableWires: (wires: ReusableWire[]) => void;
  onExportCsv: () => void;
}

export const ModuleMaterials: React.FC<ModuleMaterialsProps> = ({
  elements,
  conduits,
  reusableWires,
  systemType,
  onUpdateReusableWires,
  onExportCsv
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Compute quantified materials
  const bom = quantifyProjectMaterials({
    elements,
    conduits,
    reusableWires,
    feederLengthMeters: 16,
    systemType
  });

  const categories = ['ALL', 'Conductores', 'Canalizaciones', 'Cajas y Accesorios', 'Protecciones y Tableros', 'Dispositivos', 'Acometida y Puesta a Tierra'];

  const filteredItems = selectedCategory === 'ALL' 
    ? bom.items 
    : bom.items.filter(it => it.category === selectedCategory);

  // Reusable wire management
  const handleToggleApproved = (id: string) => {
    onUpdateReusableWires(reusableWires.map(rw => {
      if (rw.id === id) {
        const nextApproved = !rw.isApprovedByElectrician;
        return {
          ...rw,
          isApprovedByElectrician: nextApproved,
          continuityTested: nextApproved ? true : rw.continuityTested,
          meggerTested: nextApproved ? true : rw.meggerTested,
        };
      }
      return rw;
    }));
  };

  const handleAddReusable = () => {
    const newSpool: ReusableWire = {
      id: `rw_${Date.now()}`,
      label: 'Rollo adicional disponible',
      wireGauge: 12,
      lengthMeters: 20,
      insulationType: 'THW 75°C',
      color: 'Negro',
      metalType: 'Cobre',
      visualCondition: 'Aceptable',
      continuityTested: false,
      meggerTested: false,
      isApprovedByElectrician: false,
      notes: 'Pendiente de prueba de aislamiento con megóhmetro.'
    };
    onUpdateReusableWires([...reusableWires, newSpool]);
  };

  const handleRemoveReusable = (id: string) => {
    onUpdateReusableWires(reusableWires.filter(rw => rw.id !== id));
  };

  return (
    <div>
      {/* Top Banner: Reusable Wire Strategy */}
      <div className="card" style={{ borderLeft: '4px solid #16a34a' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ShieldCheck size={20} color="#16a34a" /> Control de Materiales Existentes y Descuento Seguro de Cable
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Regla de seguridad: Únicamente se descuenta del presupuesto el cable que cuente con aprobación formal de continuidad y resistencia de aislamiento.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleAddReusable}>
            <Plus size={14} /> Registrar Rollo de Cable
          </button>
        </div>

        {/* Reusable Wires Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Identificador del Material</th>
                <th>Calibre</th>
                <th>Longitud</th>
                <th>Metal</th>
                <th>Aislamiento</th>
                <th>Continuidad</th>
                <th>Megóhmetro (&gt;50 MΩ)</th>
                <th>Validación de Electricista</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reusableWires.map(rw => (
                <tr key={rw.id}>
                  <td>
                    <strong>{rw.label}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rw.notes}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{rw.wireGauge} AWG</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{rw.lengthMeters} m</td>
                  <td>
                    <span className={`badge ${rw.metalType === 'Cobre' ? 'badge-success' : 'badge-danger'}`}>
                      {rw.metalType}
                    </span>
                  </td>
                  <td>{rw.insulationType} ({rw.color})</td>
                  <td>
                    {rw.continuityTested ? (
                      <span className="badge badge-success"><CheckCircle2 size={12} /> Probada</span>
                    ) : (
                      <span className="badge badge-warning">Sin probar</span>
                    )}
                  </td>
                  <td>
                    {rw.meggerTested ? (
                      <span className="badge badge-success"><CheckCircle2 size={12} /> Aprobado</span>
                    ) : (
                      <span className="badge badge-danger">Falta Megger</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${rw.isApprovedByElectrician ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      onClick={() => handleToggleApproved(rw.id)}
                    >
                      {rw.isApprovedByElectrician ? '✓ Aprobado para Uso' : 'Pendiente Aprobación'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      onClick={() => handleRemoveReusable(rw.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Material Catalogue */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Package size={20} color="#0284c7" /> Catálogo Cuantificado de Materiales del Proyecto ({bom.items.length} Partidas)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cantidades calculadas automáticamente a partir de los metros de canalización del plano 2D con reservas técnicas.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Todas las Categorías' : cat}
                </option>
              ))}
            </select>

            <button className="btn btn-secondary btn-sm" onClick={onExportCsv}>
              <FileSpreadsheet size={15} /> Exportar Catálogo a CSV
            </button>
          </div>
        </div>

        {/* Material Items Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Clave</th>
                <th>Categoría</th>
                <th>Descripción y Especificación Técnica</th>
                <th>Unidad</th>
                <th>Cantidad Estimada</th>
                <th>Método de Cuantificación</th>
                <th>P.U. Medio (MXN)</th>
                <th>Importe Medio</th>
                <th>Proveedor Referencia</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const totalRowMid = item.quantityEstimated * item.unitPriceMid;
                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem' }}>
                      {item.code}
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.85rem' }}>{item.description}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {item.technicalSpec}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{item.unit}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: '#0284c7' }}>
                      {item.quantityEstimated}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.quantificationMethod}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ${item.unitPriceMid.toFixed(2)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      ${totalRowMid.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {item.supplierMid}
                    </td>
                    <td>
                      <span className={`badge ${
                        item.validationStatus === 'CONFIRMADO' ? 'badge-success' :
                        item.validationStatus === 'PENDIENTE_VALIDACION_CFE' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {item.validationStatus === 'PENDIENTE_VALIDACION_CFE' ? 'Sujeto a CFE' : item.validationStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
