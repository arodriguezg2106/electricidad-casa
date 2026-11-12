import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Scale,
  Activity,
  Layers
} from 'lucide-react';
import type { Circuit, LoadItem, Room } from '../types.ts';
import { calculateResidentialDemand, calculateVoltageDrop } from '../utils/calcEngine.ts';

interface ModuleLoadsCircuitsProps {
  rooms: Room[];
  loads: LoadItem[];
  circuits: Circuit[];
  systemType: '2F-3H (120/240V)' | '1F-2H (120V)';
  onUpdateLoads: (loads: LoadItem[]) => void;
  onUpdateCircuits: (circuits: Circuit[]) => void;
}

export const ModuleLoadsCircuits: React.FC<ModuleLoadsCircuitsProps> = ({
  rooms,
  loads,
  circuits,
  systemType,
  onUpdateLoads,
  onUpdateCircuits
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'unifilar' | 'loads'>('schedule');

  // Compute demand metrics
  const demandData = calculateResidentialDemand({
    rooms,
    loads,
    systemType
  });

  // Calculate phase balance
  const phaseL1Watts = circuits.filter(c => c.phase === 'L1').reduce((sum, c) => sum + c.totalWatts, 0);
  const phaseL2Watts = circuits.filter(c => c.phase === 'L2').reduce((sum, c) => sum + c.totalWatts, 0);
  const maxPhase = Math.max(phaseL1Watts, phaseL2Watts) || 1;
  const phaseUnbalancePercent = Number((Math.abs(phaseL1Watts - phaseL2Watts) / maxPhase * 100).toFixed(1));

  // Add new load item
  const handleAddLoad = () => {
    const newLoad: LoadItem = {
      id: `load_${Date.now()}`,
      name: 'Nuevo Equipo / Contacto',
      roomId: rooms[0]?.id || 'room_sala_comedor',
      circuitId: 'C2',
      quantity: 1,
      watts: 150,
      va: 180,
      powerFactor: 0.85,
      duty: 'non_continuous',
      category: 'receptacle'
    };
    onUpdateLoads([...loads, newLoad]);
  };

  const handleRemoveLoad = (id: string) => {
    onUpdateLoads(loads.filter(l => l.id !== id));
  };

  const handleUpdateLoad = (id: string, updates: Partial<LoadItem>) => {
    onUpdateLoads(loads.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return (
    <div>
      {/* Sub-tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          className={`btn ${activeSubTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('schedule')}
        >
          <Activity size={16} /> Cuadro de Cargas y Circuitos
        </button>
        <button
          className={`btn ${activeSubTab === 'unifilar' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('unifilar')}
        >
          <Zap size={16} /> Diagrama Unifilar Interactivo
        </button>
        <button
          className={`btn ${activeSubTab === 'loads' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('loads')}
        >
          <Layers size={16} /> Inventario Detallado de Equipos ({loads.length})
        </button>
      </div>

      {/* Top Engineering Metrics Cards */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <div className="card" style={{ marginBottom: 0, padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CARGA INSTALADA TOTAL</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
            {(demandData.totalConnectedWatts / 1000).toFixed(2)} kW
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {demandData.totalConnectedVa.toLocaleString()} VA conectados
          </span>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '1rem', borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>DEMANDA DIVERSIFICADA (NOM ART. 220)</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
            {(demandData.totalDemandVa / 1000).toFixed(2)} kVA
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Factor diversificado: {(demandData.totalDemandVa / demandData.totalConnectedVa * 100).toFixed(0)}%
          </span>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CORRIENTE DE DISEÑO ALIMENTADOR</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
            {demandData.feederCurrentAmps} A
          </div>
          <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
            Interruptor sugerido: 2x{demandData.recommendedFeederBreaker} A
          </span>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>BALANCE DE FASES (L1 vs L2)</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: phaseUnbalancePercent <= 10 ? '#16a34a' : '#d97706', fontFamily: 'var(--font-mono)' }}>
            {phaseUnbalancePercent}% Desbalance
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            L1: {phaseL1Watts} W | L2: {phaseL2Watts} W
          </span>
        </div>
      </div>

      {/* VIEW 1: CUADRO DE CARGAS Y CIRCUITOS */}
      {activeSubTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Activity size={20} color="#0284c7" /> Cuadro de Cargas y Especificación de Circuitos Derivados
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Dimensionamiento de interruptores termomagnéticos, conductores de cobre THW-2-LS 90°C y caída de tensión según NOM-001-SEDE-2012.
              </p>
            </div>
            <span className="badge badge-success">Centro de Carga: Square D QO-8</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cto</th>
                  <th>Descripción del Circuito</th>
                  <th>Fase</th>
                  <th>Tensión</th>
                  <th>Carga (W)</th>
                  <th>Corriente (A)</th>
                  <th>Interruptor</th>
                  <th>Conductor F+N</th>
                  <th>Tierra EGC</th>
                  <th>Tubería</th>
                  <th>Long. (m)</th>
                  <th>Caída % e</th>
                  <th>GFCI</th>
                </tr>
              </thead>
              <tbody>
                {circuits.map(c => {
                  const drop = calculateVoltageDrop({
                    lengthMeters: c.lengthMeters,
                    currentAmps: c.currentAmps,
                    wireGaugeAwg: c.wireGaugeAwg,
                    voltage: c.voltage,
                  });

                  return (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ 
                          display: 'inline-block',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          background: c.id === 'C1' ? '#fef9c3' : c.id === 'C2' ? '#dbeafe' : c.id === 'C3' ? '#fce7f3' : c.id === 'C4' ? '#ede9fe' : '#cffafe',
                          color: '#0f172a',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {c.code}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>{c.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.description}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.phase}</td>
                      <td>{c.voltage} V</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{c.totalWatts} W</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.currentAmps} A</td>
                      <td>
                        <span className="badge badge-info">{c.breakerPoles}P {c.breakerAmps}A</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        {c.wireGaugeAwg} AWG Cu
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#16a34a' }}>
                        {c.wireGaugeAwg === 14 ? '14' : '12'} AWG Cu
                      </td>
                      <td>{c.conduitDiameter}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{c.lengthMeters} m</td>
                      <td>
                        <span className={`badge ${drop.isCompliant ? 'badge-success' : 'badge-danger'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                          {drop.dropPercent}%
                        </span>
                      </td>
                      <td>
                        {c.isGfci ? (
                          <span className="badge badge-danger">OBLIGATORIO GFCI</span>
                        ) : (
                          <span className="badge badge-secondary">Estándar</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong>Criterios normativos aplicados:</strong><br />
            • NOM-001-SEDE-2012 Art. 210-19(a) Nota 4: Caída máxima de tensión permitida en circuitos derivados es 3.0%. Todos los circuitos cumplen holgadamente (&lt; 2.2%).<br />
            • NOM-001-SEDE-2012 Art. 210-8(a)(1) y 210-8(a)(6): Protección GFCI Clase A (5 mA) obligatoria en cuartos de baño y sobre cubiertas de cocina.<br />
            • NOM-001-SEDE-2012 Art. 250-122: Conductor de puesta a tierra de equipos de cobre calibre 14 AWG para 15A y calibre 12 AWG para 20A.
          </div>
        </div>
      )}

      {/* VIEW 2: DIAGRAMA UNIFILAR INTERACTIVO SVG */}
      {activeSubTab === 'unifilar' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Zap size={20} color="#eab308" /> Diagrama Unifilar Preliminar (Acometida, Alimentador y Centro de Carga)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Representación esquemática normalizada bajo especificaciones CFE-EM-BT102 y NOM-001-SEDE-2012.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              Imprimir Unifilar
            </button>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', overflowX: 'auto' }}>
            <svg width="980" height="540" viewBox="0 0 980 540" style={{ display: 'block', margin: '0 auto' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a" />
                </marker>
              </defs>

              {/* Red de Distribución CFE */}
              <g transform="translate(60, 40)">
                <text x="0" y="0" fontSize="11" fontWeight="700" fill="#dc2626">RED AÉREA DE CFE (POSTE EN CALLE)</text>
                <text x="0" y="15" fontSize="10" fill="#64748b">120/240V, 3 HILOS, 60 Hz</text>
                <line x1="0" y1="25" x2="180" y2="25" stroke="#dc2626" strokeWidth="2.5" />
              </g>

              {/* Mufa de Entrada */}
              <g transform="translate(100, 90)">
                <polygon points="0,-10 12,8 -12,8" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                <text x="20" y="4" fontSize="10" fontWeight="700" fill="#0f172a">MUFA AÉREA 1 1/4" (4.80 m)</text>
                <line x1="0" y1="8" x2="0" y2="40" stroke="#0f172a" strokeWidth="2" />
              </g>

              {/* Medidor CFE 2 */}
              <g transform="translate(100, 160)">
                <circle r="22" fill="#ffffff" stroke="#dc2626" strokeWidth="2.5" />
                <text x="0" y="5" fontSize="12" fontWeight="800" fill="#dc2626" textAnchor="middle">M₂</text>
                <text x="35" y="0" fontSize="10" fontWeight="700" fill="#0f172a">SEGUNDO MEDIDOR CFE</text>
                <text x="35" y="14" fontSize="9" fill="#64748b">Base 5 Terminales 100A (En Límite de Propiedad)</text>

                {/* Conexión a Tierra en Medidor */}
                <line x1="0" y1="22" x2="0" y2="70" stroke="#16a34a" strokeWidth="2" />
                <line x1="-12" y1="70" x2="12" y2="70" stroke="#16a34a" strokeWidth="2" />
                <line x1="-8" y1="75" x2="8" y2="75" stroke="#16a34a" strokeWidth="1.5" />
                <line x1="-4" y1="80" x2="4" y2="80" stroke="#16a34a" strokeWidth="1" />
                <text x="20" y="75" fontSize="9" fontWeight="700" fill="#16a34a">ELECTRODO COPPERWELD 5/8" x 3.0 m (R &lt; 25 Ω)</text>
              </g>

              {/* Desconectador Principal */}
              <g transform="translate(240, 160)">
                <rect x="-18" y="-18" width="36" height="36" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" rx="4" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="#dc2626" strokeWidth="2" />
                <text x="0" y="-24" fontSize="10" fontWeight="700" fill="#0f172a" textAnchor="middle">INTERRUPTOR PRINCIPAL</text>
                <text x="0" y="32" fontSize="9" fontWeight="700" fill="#dc2626" textAnchor="middle">2 × 40A QO</text>
                <text x="0" y="44" fontSize="8" fill="#64748b" textAnchor="middle">Distancia al medidor &lt; 5 m</text>
              </g>

              {/* Línea de enlace Medidor a Interruptor */}
              <line x1="122" y1="160" x2="222" y2="160" stroke="#0f172a" strokeWidth="2" />

              {/* Tramo del Alimentador Principal por Cubo de Escalera */}
              <g transform="translate(276, 160)">
                <line x1="0" y1="0" x2="180" y2="0" stroke="#dc2626" strokeWidth="3" />
                <rect x="25" y="-24" width="130" height="20" fill="#fee2e2" stroke="#f87171" rx="4" />
                <text x="90" y="-10" fontSize="9" fontWeight="700" fill="#991b1b" textAnchor="middle">
                  ALIMENTADOR (L = 16.0 m)
                </text>
                <text x="90" y="16" fontSize="8.5" fontFamily="var(--font-mono)" fill="#0f172a" textAnchor="middle">
                  2#8 Fases + 1#8 Neutro + 1#8 Tierra
                </text>
                <text x="90" y="28" fontSize="8" fill="#64748b" textAnchor="middle">
                  en Tubo Conduit Metálico 1" (Por Escalera)
                </text>
              </g>

              {/* Centro de Carga Planta Alta */}
              <g transform="translate(490, 80)">
                {/* Gabinete Tablero */}
                <rect x="0" y="0" width="450" height="420" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" rx="8" />
                <rect x="0" y="0" width="450" height="32" fill="#0284c7" rx="6" />
                <text x="225" y="21" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">
                  CENTRO DE CARGA PLANTA ALTA: SQUARE D QO-8 (8 POLOS, 100A, NEMA 1)
                </text>

                {/* Barras de Distribución */}
                {/* Barra L1 */}
                <line x1="50" y1="60" x2="50" y2="390" stroke="#dc2626" strokeWidth="5" />
                <text x="50" y="52" fontSize="10" fontWeight="700" fill="#dc2626" textAnchor="middle">FASE L1</text>

                {/* Barra L2 */}
                <line x1="90" y1="60" x2="90" y2="390" stroke="#3b82f6" strokeWidth="5" />
                <text x="90" y="52" fontSize="10" fontWeight="700" fill="#3b82f6" textAnchor="middle">FASE L2</text>

                {/* Barra de Neutro Aislada */}
                <line x1="400" y1="60" x2="400" y2="390" stroke="#94a3b8" strokeWidth="4" />
                <text x="400" y="52" fontSize="10" fontWeight="700" fill="#475569" textAnchor="middle">NEUTRO (N)</text>
                <text x="400" y="405" fontSize="8" fill="#64748b" textAnchor="middle">Barra Aislada</text>

                {/* Barra de Tierra Aislada de Neutro */}
                <line x1="430" y1="60" x2="430" y2="390" stroke="#16a34a" strokeWidth="4" />
                <text x="430" y="52" fontSize="10" fontWeight="700" fill="#16a34a" textAnchor="middle">TIERRA (T)</text>
                <text x="430" y="405" fontSize="8" fill="#16a34a" textAnchor="middle">Chasis Puesta Tierra</text>

                {/* Circuitos Derivados 1 al 6 */}
                {[
                  { id: 'C1', name: 'Alumbrado General y Espejo LED', amps: '15A', phase: 'L1', y: 85, color: '#eab308', gfci: false },
                  { id: 'C2', name: 'Contactos Generales Sala y Recámaras', amps: '20A', phase: 'L2', y: 135, color: '#3b82f6', gfci: false },
                  { id: 'C3', name: 'Cocina - Barra y Tarja (Enseres)', amps: '20A', phase: 'L1', y: 185, color: '#ec4899', gfci: true },
                  { id: 'C4', name: 'Cocina - Refrigerador y Microondas', amps: '20A', phase: 'L2', y: 235, color: '#8b5cf6', gfci: true },
                  { id: 'C5', name: 'Baños 1 y 2 - Contactos GFCI', amps: '20A', phase: 'L1', y: 285, color: '#06b6d4', gfci: true },
                  { id: 'C6', name: 'Reserva - Futuro Lavado / Secadora', amps: '20A', phase: 'L2', y: 335, color: '#10b981', gfci: true },
                ].map((item, idx) => {
                  const busX = item.phase === 'L1' ? 50 : 90;
                  return (
                    <g key={item.id} transform={`translate(0, ${item.y})`}>
                      {/* Enlace desde la barra correspondiente */}
                      <line x1={busX} y1="0" x2="130" y2="0" stroke={item.phase === 'L1' ? '#dc2626' : '#3b82f6'} strokeWidth="2" />
                      
                      {/* Interruptor Termomagnético QO */}
                      <rect x="130" y="-12" width="45" height="24" fill="#0f172a" stroke="#ffffff" strokeWidth="1" rx="3" />
                      <text x="152" y="4" fontSize="10" fontWeight="700" fill="white" textAnchor="middle">{item.amps}</text>
                      
                      {/* Salida del circuito hacia la carga */}
                      <line x1="175" y1="0" x2="220" y2="0" stroke="#0f172a" strokeWidth="2" />
                      <circle cx="220" cy="0" r="3" fill="#0f172a" />

                      {/* Etiqueta del circuito */}
                      <text x="230" y="-3" fontSize="10" fontWeight="700" fill="#0f172a">
                        {item.id}: {item.name}
                      </text>
                      <text x="230" y="9" fontSize="8.5" fill="#64748b">
                        Fase {item.phase} | {item.gfci ? 'Requiere Receptáculo GFCI' : 'Uso General'}
                      </text>

                      {item.gfci && (
                        <rect x="345" y="-10" width="38" height="15" fill="#fee2e2" stroke="#ef4444" rx="2" />
                      )}
                      {item.gfci && (
                        <text x="364" y="1" fontSize="7.5" fontWeight="800" fill="#b91c1c" textAnchor="middle">GFCI</text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* VIEW 3: INVENTARIO DE CARGAS DETALLADO */}
      {activeSubTab === 'loads' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Layers size={20} color="#0284c7" /> Inventario de Cargas y Equipos Eléctricos
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Registro de consumos, potencias y asignación de circuitos por habitación.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddLoad}>
              <Plus size={15} /> Añadir Equipo
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Equipo / Carga</th>
                  <th>Habitación</th>
                  <th>Circuito</th>
                  <th>Cantidad</th>
                  <th>Watts c/u</th>
                  <th>VA c/u</th>
                  <th>F.P.</th>
                  <th>Total W</th>
                  <th>Categoría</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {loads.map(load => (
                  <tr key={load.id}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={load.name}
                        onChange={(e) => handleUpdateLoad(load.id, { name: e.target.value })}
                        style={{ minWidth: '200px', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                      />
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={load.roomId}
                        onChange={(e) => handleUpdateLoad(load.id, { roomId: e.target.value })}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {rooms.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={load.circuitId}
                        onChange={(e) => handleUpdateLoad(load.id, { circuitId: e.target.value })}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <option value="C1">C1 - Alumbrado</option>
                        <option value="C2">C2 - Contactos</option>
                        <option value="C3">C3 - Cocina 1</option>
                        <option value="C4">C4 - Cocina 2</option>
                        <option value="C5">C5 - Baños GFCI</option>
                        <option value="C6">C6 - Lavado</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={load.quantity}
                        onChange={(e) => handleUpdateLoad(load.id, { quantity: parseInt(e.target.value) || 1 })}
                        style={{ width: '60px', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={load.watts}
                        onChange={(e) => handleUpdateLoad(load.id, { 
                          watts: parseInt(e.target.value) || 0,
                          va: Math.round((parseInt(e.target.value) || 0) / (load.powerFactor || 0.9))
                        })}
                        style={{ width: '80px', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                      />
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{load.va} VA</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{load.powerFactor}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{load.watts * load.quantity} W</td>
                    <td>
                      <span className="badge badge-secondary">{load.category}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => handleRemoveLoad(load.id)}
                        title="Eliminar equipo"
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
      )}
    </div>
  );
};
