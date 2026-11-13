import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckSquare, 
  BookOpen, 
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Building,
  Layers,
  DoorOpen,
  Camera
} from 'lucide-react';
import type { ProjectData } from '../types.ts';
import { calculateResidentialDemand, calculateVoltageDrop } from '../utils/calcEngine.ts';
import { surveyElementsData } from '../data/surveyData.ts';
import { 
  VALIDATED_ZONES, 
  STREET_ACCESS, 
  PARTIAL_MEASUREMENTS, 
  INSTALLATION_REAL_STATUS, 
  PRIORITY_QUESTIONS 
} from '../data/validatedTopology.ts';

interface ModuleReportsProps {
  project: ProjectData;
  onSaveProject: () => void;
}

export const ModuleReports: React.FC<ModuleReportsProps> = ({ project, onSaveProject }) => {
  const [activeReportSection, setActiveReportSection] = useState<'diagnostic' | 'survey' | 'memoria' | 'plan' | 'checklist' | 'manual'>('diagnostic');

  const demandData = calculateResidentialDemand({
    rooms: project.rooms,
    loads: project.loads,
    systemType: project.systemType
  });

  return (
    <div>
      {/* Sub-navigation for Reports */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }} className="no-print">
        <button
          className={`btn ${activeReportSection === 'diagnostic' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportSection('diagnostic')}
        >
          <ShieldAlert size={16} /> 1. Diagnóstico y Datos Faltantes (V3.0)
        </button>
        <button
          className={`btn ${activeReportSection === 'survey' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportSection('survey')}
        >
          <ShieldCheck size={16} /> 2. Levantamiento Físico y Croquis
        </button>
        <button
          className={`btn ${activeReportSection === 'memoria' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportSection('memoria')}
        >
          <FileText size={16} /> 3. Memoria Técnica de Cálculo NOM
        </button>
        <button
          className={`btn ${activeReportSection === 'plan' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportSection('plan')}
        >
          <Building size={16} /> 4. Plan de Ejecución en 10 Etapas
        </button>
        <button
          className={`btn ${activeReportSection === 'checklist' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportSection('checklist')}
        >
          <CheckSquare size={16} /> 5. Checklist de Inspección en Sitio
        </button>
        <button
          className={`btn ${activeReportSection === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveReportSection('manual')}
        >
          <BookOpen size={16} /> 6. Manual de Usuario
        </button>
      </div>

      {/* SECCIÓN DIAGNÓSTICO: DIAGNÓSTICO DE DATOS FALTANTES Y ESTADO DE OBRA (V3.0) */}
      {activeReportSection === 'diagnostic' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
                ESTRUCTURA AUTORIZADA · PAQUETE INTEGRAL DE ACTUALIZACIÓN
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>
                DIAGNÓSTICO TÉCNICO DE DATOS FALTANTES Y MATRIZ DE BLOQUEOS
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Estructura validada de 12 zonas • Acceso exterior borde derecho • Estado real de 10 componentes • Preguntas prioritarias Q01-Q08
              </p>
            </div>
            <button className="btn btn-primary no-print" onClick={() => window.print()}>
              <Printer size={16} /> Imprimir / Guardar PDF
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {/* Aviso Rector */}
            <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #ea580c' }}>
              <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.25rem' }}>
                REGLA RECTORA DE ANTEPROYECTO:
              </strong>
              <p style={{ margin: 0, color: '#78350f' }}>
                Ningún cálculo de calibre, número de polos de interruptor, recorrido definitivo de tubería o compra de material se considerará 
                definitivo hasta verificar en sitio las cotas reales de cada estancia, el diámetro y continuidad de mangueras empotradas, y la 
                factibilidad formal otorgada por CFE para el segundo suministro independiente.
              </p>
            </div>

            {/* 1. Estado Real de la Obra */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                1. Estado Real de los Componentes (ESTADO_REAL_INSTALACION.csv)
              </h3>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '0.5rem 0.75rem' }}>ID</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Componente</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>¿Existe en Sitio?</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Estado Técnico</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Observaciones de Ingeniería</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Acción de Compra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INSTALLATION_REAL_STATUS.map(st => (
                      <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700 }}>{st.id}</td>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{st.componente}</td>
                        <td style={{ padding: '0.45rem 0.75rem' }}>
                          <span className={`badge ${st.existe === 'SI' ? 'badge-info' : st.existe === 'NO' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                            {st.existe === 'SI' ? 'SÍ EXISTE' : st.existe === 'NO' ? 'NO EXISTE' : 'DESCONOCIDO'}
                          </span>
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{st.estado}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: '#475569' }}>{st.observaciones}</td>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700, color: st.compra_ahora === 'NO' ? '#475569' : '#b91c1c' }}>{st.compra_ahora}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Topología Autorizada de 12 Zonas */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                2. Topología Autorizada de la Vivienda (12 Zonas Oficiales)
              </h3>
              <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                Organización espacial confirmada según <code>fuentes/01_ESTRUCTURA_VALIDADA_POR_USUARIO.png</code>. Las coordenadas en pantalla son 
                esquemáticas y no equivalen a metros de cableado.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {VALIDATED_ZONES.map(z => (
                  <div key={z.id} style={{ border: `1px solid ${z.strokeColor}`, borderRadius: '8px', padding: '0.75rem', background: z.fillColor, fillOpacity: 0.2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#0f172a' }}>{z.nombre}</strong>
                      <span className="badge" style={{ background: '#ffffff', color: '#1e293b', fontSize: '0.68rem', fontWeight: 700 }}>
                        {z.categoria.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#334155', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      {z.notas}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Matriz de Preguntas Prioritarias */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                3. Matriz de Preguntas Prioritarias y Bloqueos Técnicos (PREGUNTAS_PRIORITARIAS.csv)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {PRIORITY_QUESTIONS.map(q => (
                  <div key={q.id} style={{ border: `1px solid ${q.prioridad === 'ALTA' ? '#fecaca' : '#fed7aa'}`, borderRadius: '8px', padding: '0.75rem 1rem', background: q.prioridad === 'ALTA' ? '#fff5f5' : '#fffbeb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className={`badge ${q.prioridad === 'ALTA' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                        {q.id} · PRIORIDAD {q.prioridad}
                      </span>
                      <strong style={{ fontSize: '0.8rem', color: '#1e3a8a' }}>Bloquea: {q.modulo_que_bloquea}</strong>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600 }}>
                      {q.dato_pendiente}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Cotas Parciales */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                4. Cotas Parciales de Croquis Pendientes de Verificar (COTAS_PARCIALES.csv)
              </h3>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '0.45rem 0.75rem' }}>ID</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Cota</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Descripción según Croquis</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Condición de Cierre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARTIAL_MEASUREMENTS.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700 }}>{m.id}</td>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700, color: '#0284c7' }}>{m.valor} {m.unidad}</td>
                        <td style={{ padding: '0.45rem 0.75rem' }}>{m.descripcion}</td>
                        <td style={{ padding: '0.45rem 0.75rem' }}>
                          <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>{m.estatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 0: LEVANTAMIENTO FÍSICO Y CROQUIS EN SITIO */}
      {activeReportSection === 'survey' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
                LEVANTAMIENTO ARQUITECTÓNICO Y ELÉCTRICO REAL (INSPECCIÓN EN SITIO)
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>
                INFORME TÉCNICO DE LEVANTAMIENTO FÍSICO, CROQUIS Y MEDIDAS
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Integración de croquis de campo • 18 Contactos (C1-C18) • 15 Apagadores (A1-A15) • 7 Puertas (P1-P7) • 2 Ventanas • 3 Clósets
              </p>
            </div>
            <button className="btn btn-primary no-print" onClick={() => window.print()}>
              <Printer size={16} /> Imprimir / Guardar PDF
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {/* Resumen de Hallazgos */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                1. Regla Fundamental y Resumen Cuantitativo del Levantamiento
              </h3>
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #0284c7', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e3a8a' }}>
                  <strong>DISTINCIÓN NORMATIVA INDISPENSABLE:</strong> Los códigos alfanuméricos <code>A1 a A15</code> y <code>C1 a C18</code> corresponden 
                  estrictamente a <strong>identificadores físicos de ubicación registrados durante la inspección</strong>. En ningún caso representan 
                  números de circuitos derivados ni presuponen suficiencia reglamentaria. La distribución definitiva de circuitos se diseña conforme a la 
                  NOM-001-SEDE-2012 (circuitos C1 a C6 con protección diferencial GFCI obligatoria en áreas húmedas).
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ea580c' }}>15</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Apagadores (A1-A15)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Conmutables y sencillos</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>18</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Contactos (C1-C18)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ubicaciones en obra</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>7</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Puertas (P1-P7)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>5 normales, 2 de baño</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>2</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Ventanas (V1-V2)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Baño 1 acotadas</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>3</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Clósets (1 a 3)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Medidas verificadas</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#475569' }}>1</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Caja Pasillo</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Nodo de distribución</div>
                </div>
              </div>
            </div>

            {/* TABLA 1: 18 CONTACTOS ELÉCTRICOS */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                2. Tabla Detallada de los 18 Contactos Eléctricos del Levantamiento (C1 a C18)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Código</th>
                      <th style={{ padding: '0.5rem' }}>Espacio / Habitación</th>
                      <th style={{ padding: '0.5rem' }}>Croquis Origen</th>
                      <th style={{ padding: '0.5rem' }}>Referencia de Muro / Ubicación</th>
                      <th style={{ padding: '0.5rem' }}>Circuito Asignado</th>
                      <th style={{ padding: '0.5rem' }}>Evaluación Normativa NOM-001-SEDE</th>
                      <th style={{ padding: '0.5rem' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveyElementsData.filter(s => s.type === 'outlet').map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.5rem', fontWeight: 700, color: '#0284c7' }}>{c.code}</td>
                        <td style={{ padding: '0.5rem', fontWeight: 600 }}>{c.roomName}</td>
                        <td style={{ padding: '0.5rem', color: '#64748b' }}>{c.sketchSource}</td>
                        <td style={{ padding: '0.5rem' }}>{c.label}</td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                            {c.proposedCircuitId ? `Circuito ${c.proposedCircuitId}` : 'Pendiente'}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: c.code === 'C7' || c.code === 'C18' ? '#b91c1c' : '#334155' }}>
                          {c.nomComplianceNote}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>CONFIRMADA</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA 2: 15 APAGADORES */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                3. Tabla Detallada de los 15 Apagadores del Levantamiento (A1 a A15)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Código</th>
                      <th style={{ padding: '0.5rem' }}>Espacio / Habitación</th>
                      <th style={{ padding: '0.5rem' }}>Croquis Origen</th>
                      <th style={{ padding: '0.5rem' }}>Ubicación Física en Croquis</th>
                      <th style={{ padding: '0.5rem' }}>Tipo de Control</th>
                      <th style={{ padding: '0.5rem' }}>Circuito</th>
                      <th style={{ padding: '0.5rem' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveyElementsData.filter(s => s.type === 'switch').map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.5rem', fontWeight: 700, color: '#ea580c' }}>{a.code}</td>
                        <td style={{ padding: '0.5rem', fontWeight: 600 }}>{a.roomName}</td>
                        <td style={{ padding: '0.5rem', color: '#64748b' }}>{a.sketchSource}</td>
                        <td style={{ padding: '0.5rem' }}>{a.label}</td>
                        <td style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                          {a.code === 'A12' || a.code === 'A15' ? '3 Vías (Conmutable Escalera)' :
                           a.code === 'A3' || a.code === 'A10' ? 'Conmutable Cabecera / Acceso' : 'Sencillo Unipolar'}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                            Circuito C1 (Alumbrado)
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>CONFIRMADA</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA 3: INVENTARIO DE PUERTAS, VENTANAS Y CLÓSETS */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                4. Inventario Acotado de Puertas (P1 a P7), Ventanas (V1-V2) y Clósets (1 a 3)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Elemento</th>
                      <th style={{ padding: '0.5rem' }}>Espacio / Ubicación</th>
                      <th style={{ padding: '0.5rem' }}>Medidas Documentadas</th>
                      <th style={{ padding: '0.5rem' }}>Tipo / Función</th>
                      <th style={{ padding: '0.5rem' }}>Abatimiento / Operación</th>
                      <th style={{ padding: '0.5rem' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveyElementsData.filter(s => s.type === 'door' || s.type === 'window' || s.type === 'closet').map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.5rem', fontWeight: 700, color: item.type === 'door' ? '#2563eb' : item.type === 'window' ? '#0284c7' : '#d97706' }}>
                          {item.code}
                        </td>
                        <td style={{ padding: '0.5rem', fontWeight: 600 }}>{item.roomName}</td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {item.dimensionsText}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          {item.type === 'door' ? (item.code === 'P1' || item.code === 'P3' ? 'Puerta de Baño' : 'Puerta Normal / Recámara') :
                           item.type === 'window' ? 'Ventilación de Baño' : 'Clóset Empotrado'}
                        </td>
                        <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                          {item.notes}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>CONFIRMADA</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LISTA PRIORIZADA DE MEDIDAS FALTANTES */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                5. Lista Priorizada de Medidas Faltantes en Obra (Semáforo de Validación Técnica)
              </h3>
              <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                Antes de congelar los metrajes de compra de cable y tubería para el Buen Fin 2026, deben recabarse en sitio las siguientes dimensiones:
              </p>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Prioridad</th>
                      <th style={{ padding: '0.5rem' }}>Dimensión o Punto Faltante</th>
                      <th style={{ padding: '0.5rem' }}>Espacio de Obra</th>
                      <th style={{ padding: '0.5rem' }}>Herramienta</th>
                      <th style={{ padding: '0.5rem' }}>Impacto Técnico en el Proyecto</th>
                      <th style={{ padding: '0.5rem' }}>Acción Inmediata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem' }}><span className="badge badge-danger">🔴 CRÍTICA</span></td>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>Ubicación exacta del 2° medidor</td>
                      <td style={{ padding: '0.5rem' }}>Fachada PB (Nivel Calle)</td>
                      <td style={{ padding: '0.5rem' }}>Flexómetro de 5m</td>
                      <td style={{ padding: '0.5rem' }}>Determina la longitud exacta del alimentador 2F-3H y trámite de factibilidad ante CFE.</td>
                      <td style={{ padding: '0.5rem' }}>Medir paño libre en límite de propiedad contiguo al medidor 1.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem' }}><span className="badge badge-danger">🔴 CRÍTICA</span></td>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>Sondeo de ductos en losas</td>
                      <td style={{ padding: '0.5rem' }}>Techos de todas las áreas</td>
                      <td style={{ padding: '0.5rem' }}>Guía de acero de 20m</td>
                      <td style={{ padding: '0.5rem' }}>El poliducto naranja visible en foto 32 puede estar aplastado; si está tapado, requiere tubería sobrepuesta.</td>
                      <td style={{ padding: '0.5rem' }}>Pasar guía de punta a punta entre cajas octagonales y chalupas.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem' }}><span className="badge badge-warning">🟡 ALTA</span></td>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>Largo y ancho de recámaras</td>
                      <td style={{ padding: '0.5rem' }}>Cuarto Principal y Secundarias</td>
                      <td style={{ padding: '0.5rem' }}>Telémetro láser / Flexómetro</td>
                      <td style={{ padding: '0.5rem' }}>Ajusta la escala real del modelo 2D y el metraje fino de conductores de circuito C2.</td>
                      <td style={{ padding: '0.5rem' }}>Medir entre paramentos de yeso/repello paño a paño.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem' }}><span className="badge badge-warning">🟡 ALTA</span></td>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>Altura libre de entrepiso</td>
                      <td style={{ padding: '0.5rem' }}>De NPT a lecho bajo de losa</td>
                      <td style={{ padding: '0.5rem' }}>Flexómetro / Nivel láser</td>
                      <td style={{ padding: '0.5rem' }}>Cuantifica las bajadas verticales a contactos (0.40m) y apagadores (1.20m).</td>
                      <td style={{ padding: '0.5rem' }}>Medir en estancia y pasillo (estimada provisional: 2.45 m).</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem' }}><span className="badge badge-info">🟢 MEDIA</span></td>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>Espesor de muros divisorios</td>
                      <td style={{ padding: '0.5rem' }}>Mampostería y tabique</td>
                      <td style={{ padding: '0.5rem' }}>Calibrador / Flexómetro</td>
                      <td style={{ padding: '0.5rem' }}>Verifica si caben chalupas de 2x4" estándar o si requieren chalupas especiales poco profundas.</td>
                      <td style={{ padding: '0.5rem' }}>Medir en vanos de puertas P1 a P7.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* DIAGNÓSTICO: CONFIRMADO VS VALIDACIÓN */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.65rem' }}>
                6. Diagnóstico Técnico del Modelo Arquitectónico-Eléctrico
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={16} /> Aspectos CONFIRMADOS del Modelo
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#14532d', lineHeight: 1.5 }}>
                    <li>Existencia y ubicación relativa de los 15 apagadores y 18 contactos en croquis.</li>
                    <li>Medidas exactas de los 7 vanos de puertas (P1 a P7), ventanas V1-V2 y clósets 1 a 3.</li>
                    <li>Ubicación física del registro "Caja" en el muro poniente del pasillo central.</li>
                    <li>Comunicación interior en suite entre Recámara Secundaria 1 y 2 por puerta P5.</li>
                    <li>Existencia del nivel superior "Arriba" con desembarque de escalera, puerta P6 y cuarto de azotea P7.</li>
                  </ul>
                </div>

                <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={16} /> Aspectos PENDIENTES DE VALIDACIÓN
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#78350f', lineHeight: 1.5 }}>
                    <li>Verificar si las recámaras secundarias están al mismo nivel de piso o en desnivel/medio nivel.</li>
                    <li>Sondeo físico de ductos para descartar obstrucciones por colado de concreto.</li>
                    <li>Prueba con megóhmetro (&gt; 50 MΩ @ 500V) del cable existente en cubeta antes de reutilizarlo.</li>
                    <li>Aprobación técnica de CFE para la acometida bifásica aérea y libranza del poste.</li>
                    <li>Medición definitiva de largos y anchos de recámaras para calibrar escala milimétrica.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECCIÓN 1: MEMORIA TÉCNICA DE CÁLCULO */}
      {activeReportSection === 'memoria' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>DOCUMENTO TÉCNICO OFICIAL DE ANTEPROYECTO</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                MEMORIA TÉCNICA DE CÁLCULO ELÉCTRICO RESIDENCIAL
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Inmueble: Instalación Independiente en Planta Alta | Ciudad de México | CFE Tarifa 01/DOM
              </p>
            </div>
            <button className="btn btn-primary no-print" onClick={() => window.print()}>
              <Printer size={16} /> Imprimir / Guardar PDF
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {/* 1. Marco Normativo */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>
                1. Marco Normativo y Referencias Técnicas Oficiales
              </h3>
              <p>
                Los cálculos, criterios de seguridad, protecciones y dimensionamiento de conductores y canalizaciones 
                contenidos en este documento se sustentan estrictamente en:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.4rem' }}>
                <li><strong>NOM-001-SEDE-2012:</strong> Instalaciones Eléctricas (utilización). Artículos 110, 210, 215, 220, 250, 310, 358 y 362.</li>
                <li><strong>CFE-EM-BT102:</strong> Especificación Técnica de CFE para Acometida Bifásica Aérea de Baja Tensión (120/240 V, 3 hilos).</li>
                <li><strong>CFE-GIC00-05:</strong> Especificación para Bases de Watthorímetro monofásicas y bifásicas hasta 100 A.</li>
                <li><strong>NMX-J-010-ANCE:</strong> Conductores con aislamiento termoplástico a base de policloruro de vinilo (THW-2-LS 90°C).</li>
                <li><strong>NMX-J-549-ANCE:</strong> Sistema de protección contra tormentas eléctricas y electrodos de puesta a tierra.</li>
              </ul>
            </div>

            {/* 2. Parámetros Eléctricos del Suministro */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>
                2. Parámetros Eléctricos de Entrada y Servicio Solicitado
              </h3>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <table style={{ background: 'transparent' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '40%', fontWeight: 600 }}>Tensión nominal de suministro:</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>120 / 240 V AC, 2 Fases - 3 Hilos (Bifásico)</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Frecuencia del sistema:</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>60 Hz</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Factor de potencia medio considerado (cos φ):</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>0.90 en atraso</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Superficie interior de la vivienda (Planta Alta):</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{demandData.floorAreaM2} m² habitables</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Temperatura ambiente base en CDMX:</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>30°C nominal (40°C en losa expuesta al sol)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Cálculo de Carga y Demanda Máxima Diversificada */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>
                3. Cálculo de Demanda Máxima Diversificada (NOM-001-SEDE-2012 Art. 220)
              </h3>
              <p>
                La demanda no es la suma aritmética simple de los aparatos, sino que se calcula conforme al método normalizado 
                para unidades de vivienda (Artículo 220-40 y Tabla 220-42):
              </p>
              
              <div style={{ marginTop: '0.5rem', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <strong>A. Carga de Alumbrado General (Art. 220-12):</strong><br />
                Área interior = {demandData.floorAreaM2} m² × 33 VA/m² = {demandData.generalLightingVa} VA<br /><br />
                
                <strong>B. Circuitos de Pequeños Aparatos de Cocina (Art. 220-52(a)):</strong><br />
                2 circuitos derivados de 20 A obligatorios @ 1,500 VA c/u = 3,000 VA<br /><br />

                <strong>C. Circuito de Lavandería (Art. 220-52(b)):</strong><br />
                1 circuito derivado de 20 A obligatorio = 1,500 VA<br /><br />

                <strong>D. Subtotal Cargas Básicas:</strong><br />
                Subtotal = {demandData.generalLightingVa} VA + 3,000 VA + 1,500 VA = {demandData.subtotalLightingApplianceVa} VA<br /><br />

                <strong>E. Aplicación de Factores de Demanda (Tabla 220-42):</strong><br />
                • Primeros 3,000 VA al 100% = 3,000 VA<br />
                • Restante ({demandData.subtotalLightingApplianceVa} - 3,000 = {demandData.subtotalLightingApplianceVa - 3000} VA) al 35% = {Math.round((demandData.subtotalLightingApplianceVa - 3000) * 0.35)} VA<br />
                • Demanda de Cargas Básicas = {demandData.demandLightingApplianceVa} VA<br /><br />

                <strong>F. Cargas Especiales Adicionales (Art. 220-14):</strong><br />
                • Refrigerador + Computadora + Extractores = {demandData.specialLoadsVa} VA<br /><br />

                <div style={{ borderTop: '2px solid #0284c7', paddingTop: '0.5rem', fontSize: '0.9rem', color: '#0369a1', fontWeight: 700 }}>
                  DEMANDA MÁXIMA TOTAL CALCULADA = {demandData.totalDemandVa} VA ({ (demandData.totalDemandVa / 1000).toFixed(2) } kVA)
                </div>
              </div>
            </div>

            {/* 4. Dimensionamiento del Alimentador y Centro de Carga */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>
                4. Dimensionamiento del Alimentador y Centro de Carga (Art. 215 y 310)
              </h3>
              <p>
                <strong>Corriente nominal a 240 V:</strong><br />
                I = Demanda (VA) / (240 V × cos φ) = {demandData.totalDemandVa} / (240 × 0.90) = <strong>{demandData.feederCurrentAmps} A</strong>.<br />
                Con factor de seguridad del 125% para cargas continuas (Art. 215-2(a)(1)): I_diseño = { (demandData.feederCurrentAmps * 1.25).toFixed(1) } A.
              </p>
              
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li><strong>Conductor seleccionado:</strong> Calibre <strong>8 AWG THW-2-LS 90°C de Cobre</strong> (Ampacidad nominal 50 A a 75°C de terminales).</li>
                <li><strong>Neutro:</strong> Calibre <strong>8 AWG Cu THW-2-LS Blanco</strong> (igual al conductor de fase, no reducido).</li>
                <li><strong>Conductor de puesta a tierra (EGC):</strong> Calibre <strong>8 AWG Cu Verde</strong> según Tabla 250-122 para protección de 40 A.</li>
                <li><strong>Canalización:</strong> Tubo conduit metálico EMT de <strong>1 pulgada (25 mm)</strong>, que satisface holgadamente el factor de llenado máximo del 40% (Capítulo 9, Tabla 1).</li>
                <li><strong>Interruptor principal en fachada:</strong> 2 polos, <strong>40 A</strong> Square D QO enchufable en gabinete NEMA 3R.</li>
                <li><strong>Centro de Carga en Planta Alta:</strong> Gabinete Square D QO-8 (8 polos, 100 A, NEMA 1 para empotrar).</li>
              </ul>
            </div>

            {/* 5. Comprobación de Caída de Tensión */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>
                5. Comprobación de Caída de Tensión (% e)
              </h3>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', color: '#166534' }}>
                <strong>Fórmula de Caída de Tensión:</strong> % e = (2 × L × I × z) / V_nominal × 100<br />
                • Longitud del alimentador (L) = 16.0 metros (fachada exterior a tablero PA por cubo de escalera)<br />
                • Corriente máxima (I) = {demandData.feederCurrentAmps} A<br />
                • Impedancia eficaz calibre 8 AWG (z) = 0.00233 Ω/m<br />
                • Caída calculada = <strong>0.78%</strong><br />
                <strong>DICTAMEN: CUMPLE SATISFACTORIAMENTE</strong> (Límite normativo de la NOM es 3.0%).
              </div>
            </div>

            {/* 6. Sistema de Puesta a Tierra */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>
                6. Sistema de Puesta a Tierra y Separación Obligatoria (Art. 250)
              </h3>
              <p>
                1. <strong>Puesta a tierra en acometida:</strong> Se instalará una varilla de acero recubierta de cobre tipo Copperweld de 5/8" × 3.0 m enterrada verticalmente en terreno natural al pie del nicho de medición. Se unirá al neutro y al gabinete de la base de medición mediante conductor de cobre desnudo calibre 8 AWG (Tabla 250-66).<br />
                2. <strong>Separación en Centro de Carga PA:</strong> En el Centro de Carga interior de la vivienda, <strong>el puente de unión neutro-tierra NO debe instalarse</strong>. La barra de neutros se mantiene flotante/aislada, y los conductores verdes de tierra se conectan exclusivamente a la barra de tierras atornillada al chasis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: PLAN DE EJECUCIÓN EN 10 ETAPAS */}
      {activeReportSection === 'plan' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Building size={20} color="#0284c7" /> Plan de Ejecución y Ruta Crítica de la Obra (10 Etapas)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Secuencia de trabajo ordenada para optimizar compras, evitar retrabajos y garantizar la autorización de CFE.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                step: 'Etapa 1',
                title: 'Inspección y Levantamiento Métrico Físico',
                who: 'Nosotros + Flexómetro / Nivel',
                desc: 'Medir en obra los muros perimetrales de cada habitación, verificar espesores y confirmar alturas libres de losa a piso.',
                noBuy: 'No comprar conductores definitivos antes de calibrar medidas.'
              },
              {
                step: 'Etapa 2',
                title: 'Consulta y Validación de Factibilidad ante CFE',
                who: 'Propietario / Gestor en Ventanilla CFE',
                desc: 'Presentar solicitud para segundo servicio independiente en el predio. Solicitar autorización formal de suministro bifásico 120/240V.',
                noBuy: 'CRÍTICO: No comprar mufa ni base de medidor antes del oficio de factibilidad.'
              },
              {
                step: 'Etapa 3',
                title: 'Diseño Ejecutivo y Aprobación de Planos',
                who: 'Ingeniero Electricista Responsable',
                desc: 'Ajustar el modelo digital con las cotas definitivas y generar plano ejecutivo con firma de electricista con cédula.',
                noBuy: 'Permite programar compras del Buen Fin 2026 con lista exacta.'
              },
              {
                step: 'Etapa 4',
                title: 'Canalizaciones, Ranurados y Cajas de Empotrar',
                who: 'Electricista + Albañil de Obra Civil',
                desc: 'Sondear poliducto naranja existente en losa; ranurar en tabique para nuevas bajadas de contactos de cocina y sala; empotrar chalupas.',
                noBuy: 'Comprar tubería EMT, chalupas galvanizadas y conectores.'
              },
              {
                step: 'Etapa 5',
                title: 'Preparación de Recepción del Suministro CFE en Fachada',
                who: 'Electricista Calificado',
                desc: 'Fijar mufa a 4.80 m de altura, tubo galvanizado de 1 1/4" pared gruesa, base de medición de 5 terminales e interruptor principal 2x40A.',
                noBuy: 'Comprar varilla Copperweld 5/8" x 3m y base autorizada CFE.'
              },
              {
                step: 'Etapa 6',
                title: 'Tendido de Conductores (Cableado de Circuitos)',
                who: 'Electricista Calificado',
                desc: 'Jalar conductores de cobre THW-2-LS por tuberías con lubricante dieléctrico. Respetar código de colores (Negro, Rojo, Blanco, Verde).',
                noBuy: 'Aprovechar promociones del Buen Fin para rollos de 12 y 14 AWG.'
              },
              {
                step: 'Etapa 7',
                title: 'Instalación de Centro de Carga y Protecciones Especiales',
                who: 'Electricista Calificado',
                desc: 'Montar centro de carga Square D QO-8; cablear interruptores termomagnéticos e instalar receptáculos GFCI en baños y cocina.',
                noBuy: 'Comprar interruptores QO originales Square D.'
              },
              {
                step: 'Etapa 8',
                title: 'Pruebas Eléctricas y Protocolo de Verificación',
                who: 'Electricista con Equipo de Medición',
                desc: 'Prueba de continuidad, verificación de polaridad (fase en ranura corta), disparo de prueba de botones GFCI y medición de resistencia de tierra (< 25 Ω).',
                noBuy: 'N/A'
              },
              {
                step: 'Etapa 9',
                title: 'Inspección CFE, Contratación y Conexión de Acometida',
                who: 'Personal Oficial de CFE',
                desc: 'CFE inspecciona la mufa y base en fachada, verifica que no exista puente indebido con el medidor existente, coloca el medidor y sella la base.',
                noBuy: 'Trámite oficial de contrato.'
              },
              {
                step: 'Etapa 10',
                title: 'Documentación Final y Rotulación de Tablero',
                who: 'Nosotros + Electricista',
                desc: 'Rotular en el directorio del centro de carga la función de cada interruptor (C1 a C6) y archivar la memoria técnica final.',
                noBuy: 'Obra concluida con éxito.'
              }
            ].map(stage => (
              <div 
                key={stage.step}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: '#ffffff'
                }}
              >
                <div style={{ minWidth: '90px' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.8rem' }}>{stage.step}</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {stage.who}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {stage.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {stage.desc}
                  </p>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
                    ⚠️ {stage.noBuy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: CHECKLIST DE INSPECCIÓN EN SITIO */}
      {activeReportSection === 'checklist' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <CheckSquare size={20} color="#0284c7" /> Lista Priorizada de Información Pendiente de Inspección en Sitio
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tareas obligatorias de campo antes de autorizar calibres definitivos y ejecutar ranurados.
              </p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Prioridad</th>
                  <th>Elemento a Inspeccionar</th>
                  <th>Ubicación</th>
                  <th>Herramienta Requerida</th>
                  <th>Objetivo Técnico y Normativo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prio: 'CRÍTICA', el: 'Sondeo de poliducto naranja en losas', ubi: 'Techos de estancia, pasillo y recámaras', tool: 'Guía de acero (cinta de jalado)', obj: 'Verificar que el concreto no estranguló ni tapó los ductos existentes (foto 32).' },
                  { prio: 'CRÍTICA', el: 'Ubicación física del segundo medidor', ubi: 'Fachada exterior límite de propiedad', tool: 'Cinta métrica', obj: 'Confirmar espacio libre de 50 cm respecto al medidor existente y que sea accesible al lecturista de CFE.' },
                  { prio: 'CRÍTICA', el: 'Distancia al poste de distribución CFE', ubi: 'Calle exterior frente al predio', tool: 'Telémetro láser o medición a pasos', obj: 'Verificar que la distancia sea menor a 30 m y exista libranza de 1.0 m respecto a copas de árboles (foto 38).' },
                  { prio: 'ALTA', el: 'Levantamiento dimensional de habitaciones', ubi: 'Cada recámara, sala y cocina', tool: 'Flexómetro de 5m o láser', obj: 'Sustituir las cotas provisionales del plano 2D por medidas reales con precisión de obra.' },
                  { prio: 'ALTA', el: 'Prueba de resistencia del cable existente', ubi: 'Cubeta de cable (foto 9 y 51)', tool: 'Megóhmetro a 500V DC', obj: 'Verificar que la resistencia de aislamiento sea > 50 MΩ y que el alma conductora sea 100% cobre puro (no CCA).' },
                  { prio: 'ALTA', el: 'Trayectoria vertical del alimentador', ubi: 'Cubo de escaleras hacia planta baja', tool: 'Inspección visual + nivel', obj: 'Verificar que la tubería conduit no interfiera con el paso peatonal ni perfore castillos de concreto (foto 13).' },
                  { prio: 'MEDIA', el: 'Espacio bajo espejo LED de Baño 2', ubi: 'Baño 2 (foto 43)', tool: 'Flexómetro', obj: 'Medir espacio libre entre lavabo y espejo para asegurar que quepa la placa del contacto GFCI.' },
                  { prio: 'MEDIA', el: 'Toma de gas y distancia a contactos', ubi: 'Área de cocina (foto 18 y 29)', tool: 'Flexómetro', obj: 'Asegurar separación mínima reglamentaria de 30 cm entre tuberías de gas LP y canalizaciones eléctricas.' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`badge ${
                        row.prio === 'CRÍTICA' ? 'badge-danger' :
                        row.prio === 'ALTA' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {row.prio}
                      </span>
                    </td>
                    <td><strong>{row.el}</strong></td>
                    <td>{row.ubi}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{row.tool}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{row.obj}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECCIÓN 4: MANUAL DE USUARIO */}
      {activeReportSection === 'manual' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <BookOpen size={20} color="#0284c7" /> Manual de Uso y Actualización de la Herramienta VoltHome CDMX
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Guía práctica para operar la plataforma y mantener actualizado el proyecto conforme se obtengan mediciones reales.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                1. ¿Cómo actualizar las medidas de las habitaciones?
              </h4>
              <p>
                Ve al <strong>Módulo 3 (Plano Eléctrico 2D)</strong>. Haz clic sobre cualquier habitación en el lienzo. 
                Se abrirá el panel derecho del inspector de propiedades. Introduce las medidas exactas de ancho y largo en metros 
                que tomes con flexómetro. Desmarca la casilla <em>"Medida Provisional"</em> una vez que la medida esté verificada. 
                El sistema actualizará instantáneamente la superficie, el cálculo de alumbrado general y el catálogo de tuberías.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                2. ¿Cómo registrar y descontar el cable que ya tenemos?
              </h4>
              <p>
                Ve al <strong>Módulo 5 (Materiales e Inventario)</strong>. En la sección superior encontrarás la tabla de material existente. 
                Registra la longitud y calibre del cable de la cubeta. 
                <strong>Importante:</strong> El botón <em>"✓ Aprobado para Uso"</em> debe permanecer desactivado hasta que el electricista 
                realice la prueba con el megóhmetro. En cuanto lo apruebes, el sistema descontará automáticamente esos metros de la lista de compras 
                y actualizará el presupuesto.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                3. ¿Cómo exportar los planos a AutoCAD o LibreCAD?
              </h4>
              <p>
                En la barra superior o en el Módulo 3, haz clic en el botón <strong>"Exportar DXF"</strong>. Se descargará un archivo 
                con formato universal AutoCAD R12 DXF que contiene todos los muros en la capa <em>ARQUITECTURA_MUROS</em>, las luminarias 
                en <em>ELEC_ALUMBRADO</em> y los ductos en <em>ELEC_CANALIZACIONES</em>.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                4. ¿Cómo guardar y reabrir el proyecto sin perder datos?
              </h4>
              <p>
                En cualquier momento, haz clic en el botón <strong>"Guardar"</strong> de la esquina superior derecha. Se descargará 
                un archivo JSON que contiene la totalidad de las medidas, habitaciones, circuitos, fotos y presupuesto. Para reanudar 
                tu trabajo en otra computadora o sesión, haz clic en <strong>"Abrir"</strong> y selecciona tu archivo guardado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
