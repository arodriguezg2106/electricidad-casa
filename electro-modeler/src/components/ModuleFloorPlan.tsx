import React, { useState, useRef, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Ruler, 
  Download, 
  Edit3, 
  Check, 
  AlertTriangle,
  Move,
  Camera,
  Layers,
  Layers as LayersIcon,
  Eye,
  Info,
  ShieldCheck,
  DoorOpen,
  Maximize2,
  X
} from 'lucide-react';
import type { Room, ElectricalElement, ConduitPath, SurveyElement, PhotoData } from '../types.ts';
import photosJson from '../data/photosData.json';
import { exportToDxf } from '../utils/dxfExporter.ts';

interface ModuleFloorPlanProps {
  rooms: Room[];
  elements: ElectricalElement[];
  conduits: ConduitPath[];
  surveyElements: SurveyElement[];
  onUpdateRooms: (rooms: Room[]) => void;
  onUpdateElements: (elements: ElectricalElement[]) => void;
  onUpdateConduits: (conduits: ConduitPath[]) => void;
  onUpdateSurveyElements: (surveyElements: SurveyElement[]) => void;
}

export const ModuleFloorPlan: React.FC<ModuleFloorPlanProps> = ({
  rooms,
  elements,
  conduits,
  surveyElements,
  onUpdateRooms,
  onUpdateElements,
  onUpdateConduits,
  onUpdateSurveyElements
}) => {
  const photos = photosJson as PhotoData[];

  // Viewport transformation: scale (pixels per meter), pan offset (px)
  const [scale, setScale] = useState<number>(65); // 65 px = 1 meter
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 260, y: 120 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // View Mode: 'hybrid' | 'survey' | 'proposed'
  const [viewMode, setViewMode] = useState<'hybrid' | 'survey' | 'proposed'>('hybrid');

  // Level Filter: 'all' | 'nivel_1' | 'arriba'
  const [levelFilter, setLevelFilter] = useState<'all' | 'nivel_1' | 'arriba'>('all');

  // Layers visibility toggles
  const [layers, setLayers] = useState<{ [key: string]: boolean }>({
    layer_arch: true,
    layer_doors: true,
    layer_windows: true,
    layer_closets: true,
    layer_switches: true,
    layer_outlets: true,
    layer_box: true,
    layer_lighting_proposed: true,
    layer_outlets_proposed: true,
    layer_feeder: true,
    layer_conduits: true,
  });

  // Selected item for properties inspector
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElectricalElement | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyElement | null>(null);

  // Photo viewer modal
  const [activePhotoModal, setActivePhotoModal] = useState<PhotoData | null>(null);

  // Measurement tool
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePointA, setMeasurePointA] = useState<{ x: number; y: number } | null>(null);
  const [measurePointB, setMeasurePointB] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const toggleLayer = (layerKey: string) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Convert SVG client coords to world meters
  const clientToWorld = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const px = clientX - rect.left - pan.x;
    const py = clientY - rect.top - pan.y;
    return {
      x: Number((px / scale).toFixed(2)),
      y: Number((py / scale).toFixed(2))
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isMeasuring) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (isMeasuring) {
      const world = clientToWorld(e.clientX, e.clientY);
      if (!measurePointA) {
        setMeasurePointA(world);
      } else if (!measurePointB) {
        setMeasurePointB(world);
      } else {
        setMeasurePointA(world);
        setMeasurePointB(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Measured distance in meters
  const measuredDistance = useMemo(() => {
    if (measurePointA && measurePointB) {
      const dx = measurePointB.x - measurePointA.x;
      const dy = measurePointB.y - measurePointA.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    return null;
  }, [measurePointA, measurePointB]);

  // Update Room Dimension
  const handleRoomUpdate = (updatedRoom: Room) => {
    onUpdateRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom);
  };

  // Update Survey Element Properties
  const handleSurveyUpdate = (updated: SurveyElement) => {
    onUpdateSurveyElements(surveyElements.map(s => s.id === updated.id ? updated : s));
    setSelectedSurvey(updated);
  };

  // Update Electrical Element Properties
  const handleElementUpdate = (updatedEl: ElectricalElement) => {
    onUpdateElements(elements.map(e => e.id === updatedEl.id ? updatedEl : e));
    setSelectedElement(updatedEl);
  };

  // Export SVG directly (Levantamiento or Propuesta)
  const handleExportSvg = (mode: 'survey' | 'proposed' | 'all') => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'survey' ? 'Plano_Levantamiento_Croquis_VoltHome.svg' :
                 mode === 'proposed' ? 'Plano_Propuesta_Electrica_VoltHome.svg' : 'Plano_Hibrido_VoltHome.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export DXF
  const handleExportDxf = (mode: 'all' | 'survey_only' | 'proposed_only') => {
    const dxfString = exportToDxf(rooms, elements, conduits, surveyElements, mode);
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'survey_only' ? 'Plano_Levantamiento_Croquis.dxf' :
                 mode === 'proposed_only' ? 'Plano_Propuesta_Electrica.dxf' : 'Plano_Completo_VoltHome.dxf';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Circuit Colors
  const getCircuitColor = (circuitId?: string) => {
    switch (circuitId) {
      case 'C1': return '#eab308'; // Amarillo Alumbrado
      case 'C2': return '#3b82f6'; // Azul Contactos Generales
      case 'C3': return '#ec4899'; // Rosa Cocina 1
      case 'C4': return '#8b5cf6'; // Morado Cocina 2 / Refri
      case 'C5': return '#06b6d4'; // Cyan Baños GFCI
      case 'C6': return '#10b981'; // Verde Lavado
      case 'FEER_2F3H': return '#dc2626'; // Rojo Alimentador
      default: return '#64748b';
    }
  };

  // Filtered Survey Items
  const displayedSurveyItems = useMemo(() => {
    if (viewMode === 'proposed') return [];
    return surveyElements.filter(s => {
      if (s.type === 'switch' && !layers.layer_switches) return false;
      if (s.type === 'outlet' && !layers.layer_outlets) return false;
      if (s.type === 'door' && !layers.layer_doors) return false;
      if (s.type === 'window' && !layers.layer_windows) return false;
      if (s.type === 'closet' && !layers.layer_closets) return false;
      if (s.type === 'box' && !layers.layer_box) return false;

      // Filter by level
      if (levelFilter === 'nivel_1' && s.sketchSource === 'Arriba') return false;
      if (levelFilter === 'arriba' && s.sketchSource !== 'Arriba') return false;

      return true;
    });
  }, [surveyElements, viewMode, layers, levelFilter]);

  // Filtered Rooms
  const displayedRooms = useMemo(() => {
    return rooms.filter(r => {
      if (levelFilter === 'nivel_1' && r.level === 'arriba') return false;
      if (levelFilter === 'arriba' && r.level !== 'arriba') return false;
      return true;
    });
  }, [rooms, levelFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: 'calc(100vh - 165px)' }}>
      {/* CAD Toolbar */}
      <div className="card" style={{ padding: '0.65rem 1rem', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Navigation & Zoom Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setScale(s => Math.min(120, s + 10))} title="Acercar zoom">
            <ZoomIn size={15} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setScale(s => Math.max(30, s - 10))} title="Alejar zoom">
            <ZoomOut size={15} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setScale(65); setPan({ x: 260, y: 120 }); }} title="Centrar plano">
            <RotateCcw size={15} />
          </button>

          <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 0.2rem' }} />

          {/* Level Switcher */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '6px', gap: '2px' }}>
            <button
              className={`btn btn-sm ${levelFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              onClick={() => setLevelFilter('all')}
            >
              Todos los Niveles
            </button>
            <button
              className={`btn btn-sm ${levelFilter === 'nivel_1' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              onClick={() => setLevelFilter('nivel_1')}
            >
              Nivel 1 (Principal)
            </button>
            <button
              className={`btn btn-sm ${levelFilter === 'arriba' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              onClick={() => setLevelFilter('arriba')}
            >
              Nivel "Arriba" (Azotea)
            </button>
          </div>

          <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 0.2rem' }} />

          {/* Mode Switcher: Hybrid vs Survey vs Proposed */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '6px', gap: '2px' }}>
            <button
              className={`btn btn-sm ${viewMode === 'hybrid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              onClick={() => setViewMode('hybrid')}
              title="Superposición de levantamiento en sitio y propuesta eléctrica nueva"
            >
              Modo Híbrido
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'survey' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              onClick={() => setViewMode('survey')}
              title="Sólo datos reales del levantamiento físico: A1-A15, C1-C18, P1-P7, V1-V2, Clósets"
            >
              Plano Levantamiento (Croquis)
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'proposed' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              onClick={() => setViewMode('proposed')}
              title="Instalación nueva calculada bajo NOM-001-SEDE-2012"
            >
              Plano Propuesta Eléctrica
            </button>
          </div>

          <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 0.2rem' }} />

          {/* Measurement Tool */}
          <button 
            className={`btn btn-sm ${isMeasuring ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setIsMeasuring(!isMeasuring);
              setMeasurePointA(null);
              setMeasurePointB(null);
            }}
          >
            <Ruler size={15} /> {isMeasuring ? 'Midiendo (A → B)' : 'Regla CAD'}
          </button>

          {measuredDistance !== null && (
            <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
              Distancia: {measuredDistance.toFixed(2)} m
            </span>
          )}
        </div>

        {/* Quick Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleExportSvg(viewMode === 'survey' ? 'survey' : viewMode === 'proposed' ? 'proposed' : 'all')} 
            title="Descargar plano en formato vectorial SVG"
          >
            <Download size={14} /> Exportar SVG
          </button>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleExportDxf(viewMode === 'survey' ? 'survey_only' : viewMode === 'proposed' ? 'proposed_only' : 'all')} 
            title="Descargar archivo DXF para AutoCAD"
          >
            <Download size={14} /> Exportar DXF
          </button>
        </div>
      </div>

      {/* Secondary Layer Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', padding: '0 0.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LayersIcon size={14} /> Capas:
        </span>
        {[
          { id: 'layer_arch', label: 'Arquitectura / Muros', color: '#475569' },
          { id: 'layer_doors', label: 'Puertas (P1-P7)', color: '#2563eb' },
          { id: 'layer_windows', label: 'Ventanas (V1-V2)', color: '#0284c7' },
          { id: 'layer_closets', label: 'Clósets (1-3)', color: '#d97706' },
          { id: 'layer_switches', label: 'Apagadores (A1-A15)', color: '#ea580c' },
          { id: 'layer_outlets', label: 'Contactos (C1-C18)', color: '#0369a1' },
          { id: 'layer_box', label: 'Caja Registro', color: '#6366f1' },
          { id: 'layer_lighting_proposed', label: 'Alumbrado Nuevo', color: '#eab308' },
          { id: 'layer_feeder', label: 'Alimentador CFE', color: '#dc2626' },
          { id: 'layer_conduits', label: 'Tuberías y Trazos', color: '#64748b' },
        ].map(l => (
          <button
            key={l.id}
            onClick={() => toggleLayer(l.id)}
            style={{
              fontSize: '0.70rem',
              fontWeight: 600,
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: layers[l.id] ? l.color : '#cbd5e1',
              backgroundColor: layers[l.id] ? `${l.color}18` : '#ffffff',
              color: layers[l.id] ? l.color : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: layers[l.id] ? l.color : '#cbd5e1' }} />
            {l.label}
          </button>
        ))}
      </div>

      {/* Main CAD Canvas & Inspector Panel */}
      <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minHeight: 0 }}>
        {/* Interactive SVG Canvas */}
        <div 
          style={{ 
            flex: 1, 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid var(--border)', 
            overflow: 'hidden', 
            position: 'relative',
            cursor: isMeasuring ? 'crosshair' : (isPanning ? 'grabbing' : 'grab')
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            {/* Grid Pattern in Background */}
            <defs>
              <pattern id="cadGridSmall" width={scale * 0.5} height={scale * 0.5} patternUnits="userSpaceOnUse">
                <path d={`M ${scale * 0.5} 0 L 0 0 0 ${scale * 0.5}`} fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
              <pattern id="cadGridMajor" width={scale * 1.0} height={scale * 1.0} patternUnits="userSpaceOnUse">
                <rect width={scale * 1.0} height={scale * 1.0} fill="url(#cadGridSmall)" />
                <path d={`M ${scale * 1.0} 0 L 0 0 0 ${scale * 1.0}`} fill="none" stroke="#e2e8f0" strokeWidth="1.2" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#cadGridMajor)" />

            {/* Transform Group for Pan & Zoom */}
            <g transform={`translate(${pan.x}, ${pan.y})`}>
              
              {/* ==================================================== */}
              {/* CAPA A: ARQUITECTURA (Habitaciones, Muros, Escalera) */}
              {/* ==================================================== */}
              {layers.layer_arch && (
                <g id="layer_arquitectura">
                  {displayedRooms.map(room => {
                    const rx = room.x * scale;
                    const ry = room.y * scale;
                    const rw = room.width * scale;
                    const rh = room.height * scale;
                    const isSelected = selectedRoom?.id === room.id;

                    return (
                      <g 
                        key={room.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(room);
                          setSelectedElement(null);
                          setSelectedSurvey(null);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Room Area Fill */}
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rh}
                          fill={room.color || '#f8fafc'}
                          fillOpacity={isSelected ? 0.75 : 0.45}
                          stroke={isSelected ? '#0284c7' : '#334155'}
                          strokeWidth={isSelected ? 3.5 : 2.5}
                          strokeDasharray={room.isProvisional ? '6,4' : 'none'}
                        />

                        {/* Room Info Labels */}
                        <text
                          x={rx + 10}
                          y={ry + 22}
                          fontSize={13}
                          fontWeight="700"
                          fill="#0f172a"
                          fontFamily="var(--font-sans)"
                        >
                          {room.name}
                        </text>
                        <text
                          x={rx + 10}
                          y={ry + 38}
                          fontSize={11}
                          fontWeight="500"
                          fill="#64748b"
                          fontFamily="var(--font-mono)"
                        >
                          {room.width.toFixed(2)}m × {room.height.toFixed(2)}m ({(room.width * room.height).toFixed(1)} m²)
                        </text>

                        {/* Level Tag */}
                        {room.level === 'arriba' && (
                          <g transform={`translate(${rx + 10}, ${ry + 52})`}>
                            <rect width="64" height="16" rx="3" fill="#e0e7ff" />
                            <text x="32" y="11" fontSize={8} fontWeight="700" fill="#4338ca" textAnchor="middle">
                              NIVEL ARRIBA
                            </text>
                          </g>
                        )}

                        {room.isProvisional && (
                          <g transform={`translate(${rx + rw - 95}, ${ry + 8})`}>
                            <rect width="88" height="18" rx="4" fill="#fef3c7" stroke="#fde68a" />
                            <text x="44" y="13" fontSize={9} fontWeight="700" fill="#92400e" textAnchor="middle">
                              PROVISIONAL
                            </text>
                          </g>
                        )}

                        {/* Staircase Graphic Details */}
                        {room.type === 'stairs' && (
                          <g stroke="#94a3b8" strokeWidth="1">
                            {[0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((step, idx) => (
                              <line
                                key={idx}
                                x1={rx + 15}
                                y1={ry + step * scale}
                                x2={rx + rw - 15}
                                y2={ry + step * scale}
                              />
                            ))}
                            {/* Arrow indicating ascending path */}
                            <line x1={rx + rw/2} y1={ry + rh - 20} x2={rx + rw/2} y2={ry + 25} stroke="#475569" strokeWidth="1.5" />
                            <polygon points={`${rx + rw/2},${ry + 15} ${rx + rw/2 - 5},${ry + 25} ${rx + rw/2 + 5},${ry + 25}`} fill="#475569" />
                            <text x={rx + rw/2} y={ry + rh/2} fontSize={9} fill="#475569" fontWeight="700" textAnchor="middle" stroke="#ffffff" strokeWidth={2} paintOrder="stroke">
                              SUBE
                            </text>
                          </g>
                        )}

                        {/* Kitchen Pass-Through Bar */}
                        {room.id === 'room_cocina' && (
                          <g>
                            <rect
                              x={rx - 8}
                              y={ry + 10}
                              width={16}
                              height={scale * 2.0}
                              fill="#fed7aa"
                              stroke="#ea580c"
                              strokeWidth={1.5}
                            />
                            <text 
                              x={rx} 
                              y={ry + scale * 1.0} 
                              fontSize={9} 
                              fill="#c2410c" 
                              fontWeight="700" 
                              textAnchor="middle" 
                              transform={`rotate(-90, ${rx}, ${ry + scale * 1.0})`}
                            >
                              BARRA DESAYUNADORA (2.0 m)
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ==================================================== */}
              {/* CAPA: ELEMENTOS DEL LEVANTAMIENTO FÍSICO (CROQUIS)  */}
              {/* ==================================================== */}
              {viewMode !== 'proposed' && (
                <g id="layer_levantamiento_croquis">
                  {displayedSurveyItems.map(item => {
                    const sx = item.x * scale;
                    const sy = item.y * scale;
                    const isSelected = selectedSurvey?.id === item.id;

                    return (
                      <g
                        key={item.id}
                        transform={`translate(${sx}, ${sy})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSurvey(item);
                          setSelectedRoom(null);
                          setSelectedElement(null);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Selection Aura */}
                        {isSelected && (
                          <circle r={item.type === 'door' || item.type === 'closet' ? 32 : 18} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeDasharray="3,2" />
                        )}

                        {/* 1. PUERTAS (P1 a P7) */}
                        {item.type === 'door' && (
                          <g>
                            {/* Door Opening & Swing Arc */}
                            <circle r={item.width ? item.width * scale : 45} fill="none" stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="3,3" />
                            {/* Door leaf line */}
                            <line 
                              x1={0} 
                              y1={0} 
                              x2={item.width ? item.width * scale : 45} 
                              y2={0} 
                              stroke="#1d4ed8" 
                              strokeWidth={3} 
                            />
                            {/* Door Code Badge */}
                            <rect x={-14} y={-10} width={28} height={20} rx={4} fill="#2563eb" stroke="#ffffff" strokeWidth={1.5} />
                            <text x={0} y={4} fontSize={10} fontWeight="800" fill="#ffffff" textAnchor="middle">
                              {item.code}
                            </text>
                            <text x={0} y={22} fontSize={9} fontWeight="700" fill="#1e40af" textAnchor="middle" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              {item.dimensionsText}
                            </text>
                          </g>
                        )}

                        {/* 2. VENTANAS (V1, V2) */}
                        {item.type === 'window' && (
                          <g>
                            <rect 
                              x={-8} 
                              y={-(item.height ? item.height * scale : 40) / 2} 
                              width={16} 
                              height={item.height ? item.height * scale : 40} 
                              fill="#e0f2fe" 
                              stroke="#0284c7" 
                              strokeWidth={2} 
                            />
                            <line 
                              x1={0} 
                              y1={-(item.height ? item.height * scale : 40) / 2} 
                              x2={0} 
                              y2={(item.height ? item.height * scale : 40) / 2} 
                              stroke="#0284c7" 
                              strokeWidth={1.5} 
                            />
                            <rect x={-12} y={-9} width={24} height={18} rx={3} fill="#0284c7" stroke="#ffffff" strokeWidth={1} />
                            <text x={0} y={3} fontSize={9} fontWeight="800" fill="#ffffff" textAnchor="middle">
                              {item.code}
                            </text>
                            <text x={26} y={3} fontSize={8} fontWeight="700" fill="#0369a1" textAnchor="start" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              {item.dimensionsText}
                            </text>
                          </g>
                        )}

                        {/* 3. CLÓSETS (Closet 1, 2, 3) */}
                        {item.type === 'closet' && (
                          <g>
                            <rect
                              x={0}
                              y={0}
                              width={item.width ? item.width * scale : 100}
                              height={item.depth ? item.depth * scale : 35}
                              fill="#fef3c7"
                              stroke="#d97706"
                              strokeWidth={2}
                              strokeDasharray="4,2"
                            />
                            {/* Sliding door dividing lines */}
                            <line 
                              x1={(item.width ? item.width * scale : 100) / 2} 
                              y1={0} 
                              x2={(item.width ? item.width * scale : 100) / 2} 
                              y2={item.depth ? item.depth * scale : 35} 
                              stroke="#d97706" 
                              strokeWidth={1.5} 
                            />
                            {/* Badge */}
                            <rect x={10} y={8} width={50} height={18} rx={4} fill="#d97706" />
                            <text x={35} y={20} fontSize={9} fontWeight="800" fill="#ffffff" textAnchor="middle">
                              {item.code}
                            </text>
                            <text x={(item.width ? item.width * scale : 100) / 2} y={-6} fontSize={9} fontWeight="700" fill="#92400e" textAnchor="middle" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              {item.dimensionsText}
                            </text>
                          </g>
                        )}

                        {/* 4. APAGADORES (A1 a A15) */}
                        {item.type === 'switch' && (
                          <g>
                            {/* Directional Triangle matching the sketch */}
                            <polygon 
                              points={
                                item.wallSide === 'bottom' ? '0,8 -5,-2 5,-2' :
                                item.wallSide === 'top' ? '0,-8 -5,2 5,2' :
                                item.wallSide === 'left' ? '-8,0 2,-5 2,5' :
                                '8,0 -2,-5 -2,5'
                              }
                              fill="#ea580c" 
                            />
                            {/* Circular badge */}
                            <circle r={11} fill="#ea580c" stroke="#ffffff" strokeWidth={1.8} />
                            <text x={0} y={4} fontSize={10} fontWeight="800" fill="#ffffff" textAnchor="middle">
                              {item.code}
                            </text>
                          </g>
                        )}

                        {/* 5. CONTACTOS (C1 a C18) */}
                        {item.type === 'outlet' && (
                          <g>
                            {/* Circular receptacle symbol */}
                            <circle r={11} fill="#0284c7" stroke="#ffffff" strokeWidth={1.8} />
                            <text x={0} y={4} fontSize={9} fontWeight="800" fill="#ffffff" textAnchor="middle">
                              {item.code}
                            </text>
                            {/* GFCI Tag for mandatory GFCI outlets */}
                            {(item.code === 'C7' || item.code === 'C18') && (
                              <g transform="translate(0, -18)">
                                <rect x={-14} y={-7} width={28} height={14} rx={3} fill="#dc2626" />
                                <text x={0} y={3} fontSize={8} fontWeight="800" fill="#ffffff" textAnchor="middle">
                                  GFCI
                                </text>
                              </g>
                            )}
                          </g>
                        )}

                        {/* 6. REGISTRO CAJA */}
                        {item.type === 'box' && (
                          <g>
                            <rect x={-12} y={-12} width={24} height={24} rx={3} fill="#475569" stroke="#38bdf8" strokeWidth={2} />
                            <line x1={-12} y1={-12} x2={12} y2={12} stroke="#38bdf8" strokeWidth={1.5} />
                            <text x={0} y={22} fontSize={9} fontWeight="800" fill="#0f172a" textAnchor="middle" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              CAJA (REGISTRO)
                            </text>
                          </g>
                        )}

                      </g>
                    );
                  })}
                </g>
              )}

              {/* ==================================================== */}
              {/* CAPA: PROPUESTA ELÉCTRICA NUEVA (NOM-001 / CIRCUITOS)*/}
              {/* ==================================================== */}
              {viewMode !== 'survey' && (
                <g id="layer_propuesta_electrica">
                  {/* Conduits & Feeder */}
                  {layers.layer_conduits && conduits.map(cnd => {
                    const fromEl = elements.find(e => e.id === cnd.fromId);
                    const toEl = elements.find(e => e.id === cnd.toId);
                    if (!fromEl || !toEl) return null;

                    const x1 = fromEl.x * scale;
                    const y1 = fromEl.y * scale;
                    const x2 = toEl.x * scale;
                    const y2 = toEl.y * scale;

                    const isFeeder = cnd.circuitIds.includes('FEER_2F3H');
                    if (isFeeder && !layers.layer_feeder) return null;

                    const strokeColor = isFeeder ? '#dc2626' : (cnd.isExisting ? '#f97316' : '#64748b');
                    const strokeWidth = isFeeder ? 3.5 : 2.0;

                    return (
                      <g key={cnd.id}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={cnd.type === 'poliducto_naranja_existente' ? '4,3' : 'none'}
                        />
                        <text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 - 4}
                          fontSize={9}
                          fontWeight="600"
                          fill={strokeColor}
                          fontFamily="var(--font-mono)"
                          textAnchor="middle"
                          stroke="#ffffff"
                          strokeWidth={3}
                          paintOrder="stroke"
                        >
                          {cnd.diameter} ({cnd.lengthMeters}m)
                        </text>
                      </g>
                    );
                  })}

                  {/* Proposed Electrical Fixtures */}
                  {elements.map(el => {
                    const ex = el.x * scale;
                    const ey = el.y * scale;
                    const isSelected = selectedElement?.id === el.id;

                    if (el.type.startsWith('light') && !layers.layer_lighting_proposed) return null;
                    if (el.type.startsWith('outlet') && !layers.layer_outlets_proposed) return null;
                    if (el.type === 'meter_cfe' && !layers.layer_feeder) return null;

                    const circuitColor = getCircuitColor(el.circuitId);

                    return (
                      <g
                        key={el.id}
                        transform={`translate(${ex}, ${ey})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement(el);
                          setSelectedRoom(null);
                          setSelectedSurvey(null);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {isSelected && (
                          <circle r={20} fill="none" stroke="#0284c7" strokeWidth={2.5} strokeDasharray="3,2" />
                        )}

                        {/* Ceiling Lighting Outlet */}
                        {el.type === 'light_ceiling' && (
                          <g>
                            <circle r={11} fill="#ffffff" stroke={circuitColor} strokeWidth={2.2} />
                            <line x1={-8} y1={-8} x2={8} y2={8} stroke={circuitColor} strokeWidth={2} />
                            <line x1={-8} y1={8} x2={8} y2={-8} stroke={circuitColor} strokeWidth={2} />
                            <text x={0} y={22} fontSize={8} fontWeight="700" fill={circuitColor} textAnchor="middle" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              {el.label}
                            </text>
                          </g>
                        )}

                        {/* Load Center (Centro de Carga QO-8) */}
                        {el.type === 'load_center' && (
                          <g>
                            <rect x={-14} y={-14} width={28} height={28} fill="#0f172a" stroke="#38bdf8" strokeWidth={2} rx={3} />
                            <line x1={-14} y1={-14} x2={14} y2={14} stroke="#ffffff" strokeWidth={1.5} />
                            <text x={0} y={24} fontSize={9} fontWeight="700" fill="#0f172a" textAnchor="middle" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              TC-PA (QO-8)
                            </text>
                          </g>
                        )}

                        {/* CFE 2nd Meter */}
                        {el.type === 'meter_cfe' && (
                          <g>
                            <circle r={15} fill="#fee2e2" stroke="#dc2626" strokeWidth={2.5} />
                            <text x={0} y={4} fontSize={10} fontWeight="800" fill="#dc2626" textAnchor="middle">
                              M₂
                            </text>
                            <text x={0} y={25} fontSize={9} fontWeight="700" fill="#dc2626" textAnchor="middle" stroke="#ffffff" strokeWidth={3} paintOrder="stroke">
                              CFE MEDIDOR 2
                            </text>
                          </g>
                        )}

                        {/* Service Drop Mufa */}
                        {el.type === 'service_drop' && (
                          <g>
                            <polygon points="0,-12 10,6 -10,6" fill="#f59e0b" stroke="#78350f" strokeWidth={1.5} />
                            <text x={0} y={18} fontSize={8} fontWeight="700" fill="#b45309" textAnchor="middle">
                              MUFA 1 1/4"
                            </text>
                          </g>
                        )}

                        {/* Ground Rod */}
                        {el.type === 'ground_rod' && (
                          <g>
                            <circle r={6} fill="#16a34a" stroke="#14532d" strokeWidth={1.5} />
                            <line x1={0} y1={6} x2={0} y2={16} stroke="#16a34a" strokeWidth={2} />
                            <line x1={-6} y1={12} x2={6} y2={12} stroke="#16a34a" strokeWidth={1.5} />
                            <line x1={-4} y1={15} x2={4} y2={15} stroke="#16a34a" strokeWidth={1.2} />
                            <text x={0} y={28} fontSize={8} fontWeight="700" fill="#15803d" textAnchor="middle">
                              VARILLA 5/8"
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Measurement Line */}
              {measurePointA && (
                <g>
                  <circle cx={measurePointA.x * scale} cy={measurePointA.y * scale} r={5} fill="#ef4444" />
                  {measurePointB && (
                    <g>
                      <circle cx={measurePointB.x * scale} cy={measurePointB.y * scale} r={5} fill="#ef4444" />
                      <line
                        x1={measurePointA.x * scale}
                        y1={measurePointA.y * scale}
                        x2={measurePointB.x * scale}
                        y2={measurePointB.y * scale}
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="4,4"
                      />
                      <rect
                        x={(measurePointA.x + measurePointB.x) / 2 * scale - 30}
                        y={(measurePointA.y + measurePointB.y) / 2 * scale - 12}
                        width={60}
                        height={20}
                        rx={4}
                        fill="#ef4444"
                      />
                      <text
                        x={(measurePointA.x + measurePointB.x) / 2 * scale}
                        y={(measurePointA.y + measurePointB.y) / 2 * scale + 2}
                        fontSize={11}
                        fontWeight="700"
                        fill="white"
                        textAnchor="middle"
                      >
                        {measuredDistance?.toFixed(2)} m
                      </text>
                    </g>
                  )}
                </g>
              )}

            </g>
          </svg>

          {/* Metric Scale Legend at bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: `${scale}px`, height: '4px', background: '#0f172a', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: '-4px', width: '1px', height: '12px', background: '#0f172a' }} />
                <div style={{ position: 'absolute', right: 0, top: '-4px', width: '1px', height: '12px', background: '#0f172a' }} />
              </div>
              <span style={{ fontWeight: 700 }}>1.00 METRO ({scale} px)</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '9px' }}>Cuadrícula mayor = 1.0 m | Menor = 0.5 m</span>
          </div>
        </div>

        {/* Right Inspector & Property Editor Panel */}
        <div style={{ width: '330px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          
          {/* INSPECTOR 1: Selected Survey Element (A1-A15, C1-C18, P1-P7, V1-V2, Closets) */}
          {selectedSurvey ? (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${selectedSurvey.type === 'switch' ? 'badge-warning' : selectedSurvey.type === 'outlet' ? 'badge-info' : 'badge-primary'}`} style={{ fontSize: '0.85rem' }}>
                    {selectedSurvey.code}
                  </span>
                  <h4 className="card-title" style={{ fontSize: '0.9rem', margin: 0 }}>
                    Elemento de Levantamiento
                  </h4>
                </div>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSelectedSurvey(null)}
                  style={{ padding: '0.2rem 0.4rem' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem', fontSize: '0.82rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedSurvey.label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Origen: <strong>{selectedSurvey.sketchSource}</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Espacio: <strong>{selectedSurvey.roomName}</strong>
                  </div>
                </div>

                {/* Editable Coordinates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Coord X (m):</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedSurvey.x}
                      onChange={(e) => handleSurveyUpdate({ ...selectedSurvey, x: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Coord Y (m):</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedSurvey.y}
                      onChange={(e) => handleSurveyUpdate({ ...selectedSurvey, y: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Dimensions if door, window, closet */}
                {selectedSurvey.dimensionsText && (
                  <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.78rem' }}>Medidas Documentadas en Libreta:</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#78350f', fontSize: '0.88rem' }}>
                      {selectedSurvey.dimensionsText}
                    </div>
                  </div>
                )}

                {/* Proposed Circuit Mapping */}
                {selectedSurvey.proposedCircuitId && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', padding: '0.45rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Circuito Propuesto:</span>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                      Circuito {selectedSurvey.proposedCircuitId}
                    </span>
                  </div>
                )}

                {/* NOM-001 Regulatory Evaluation */}
                {selectedSurvey.nomComplianceNote && (
                  <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} color="#1d4ed8" /> Evaluación NOM-001-SEDE:
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#1e3a8a', lineHeight: 1.4 }}>
                      {selectedSurvey.nomComplianceNote}
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Observaciones de Obra:</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    style={{ fontSize: '0.75rem' }}
                    value={selectedSurvey.notes || ''}
                    onChange={(e) => handleSurveyUpdate({ ...selectedSurvey, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : selectedRoom ? (
            /* INSPECTOR 2: Selected Room Editor */
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <h4 className="card-title" style={{ fontSize: '0.9rem', margin: 0 }}>
                  <Edit3 size={15} color="#0284c7" /> {selectedRoom.name}
                </h4>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSelectedRoom(null)}
                  style={{ padding: '0.2rem 0.4rem' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem', fontSize: '0.82rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Nombre del Espacio:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedRoom.name}
                    onChange={(e) => handleRoomUpdate({ ...selectedRoom, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Ancho (m):</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedRoom.width}
                      onChange={(e) => handleRoomUpdate({ ...selectedRoom, width: parseFloat(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Largo (m):</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedRoom.height}
                      onChange={(e) => handleRoomUpdate({ ...selectedRoom, height: parseFloat(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.45rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <strong>Superficie Calculada:</strong> {(selectedRoom.width * selectedRoom.height).toFixed(2)} m²
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedRoom.isProvisional}
                      onChange={(e) => handleRoomUpdate({ ...selectedRoom, isProvisional: e.target.checked })}
                    />
                    Medida Provisional (Falta Flexómetro)
                  </label>
                </div>

                {/* Associated Photographs Section */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.65rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.4rem' }}>
                    <Camera size={14} color="#0284c7" /> Fotografías de Inspección Asociadas:
                  </div>
                  
                  {selectedRoom.associatedPhotos && selectedRoom.associatedPhotos.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
                      {selectedRoom.associatedPhotos.map(photoId => {
                        const pData = photos.find(p => p.id === photoId);
                        if (!pData) return null;
                        return (
                          <div 
                            key={photoId} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '0.35rem 0.5rem', 
                              background: '#f8fafc', 
                              borderRadius: '4px', 
                              border: '1px solid #e2e8f0',
                              cursor: 'pointer'
                            }}
                            onClick={() => setActivePhotoModal(pData)}
                          >
                            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#0f172a' }}>
                              Foto #{pData.id}: {pData.space.substring(0, 24)}...
                            </span>
                            <Eye size={13} color="#0284c7" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                      Sin fotos directamente vinculadas.
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Notas de Acabados:</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    style={{ fontSize: '0.75rem' }}
                    value={selectedRoom.notes}
                    onChange={(e) => handleRoomUpdate({ ...selectedRoom, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : selectedElement ? (
            /* INSPECTOR 3: Selected Proposed Electrical Element Editor */
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <h4 className="card-title" style={{ fontSize: '0.9rem', margin: 0 }}>
                  Propuesta Eléctrica Nueva
                </h4>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSelectedElement(null)}
                  style={{ padding: '0.2rem 0.4rem' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem', fontSize: '0.82rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700 }}>{selectedElement.label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Tipo: {selectedElement.type}</div>
                  {selectedElement.circuitId && (
                    <div style={{ marginTop: '0.3rem' }}>
                      <span className="badge badge-info">Circuito {selectedElement.circuitId}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Coord X (m):</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedElement.x}
                      onChange={(e) => handleElementUpdate({ ...selectedElement, x: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Coord Y (m):</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedElement.y}
                      onChange={(e) => handleElementUpdate({ ...selectedElement, y: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Altura s/ NPT (m):</label>
                  <input
                    type="number"
                    step="0.05"
                    className="form-control"
                    value={selectedElement.heightOverFloor}
                    onChange={(e) => handleElementUpdate({ ...selectedElement, heightOverFloor: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Empty Inspector State */
            <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '1.5rem 1rem' }}>
              <Info size={28} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                Inspector de Propiedades
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Haz clic sobre cualquier elemento del plano:
              </p>
              <ul style={{ textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', paddingLeft: '1.2rem', lineHeight: 1.5 }}>
                <li><strong>Apagador A1-A15:</strong> Ver datos de croquis y circuito</li>
                <li><strong>Contacto C1-C18:</strong> Ver ubicación y requisitos GFCI</li>
                <li><strong>Puerta P1-P7:</strong> Ver medidas reales de vano</li>
                <li><strong>Habitación:</strong> Modificar medidas y ver fotos</li>
              </ul>
            </div>
          )}

          {/* Quick Survey Summary Stats */}
          <div className="card" style={{ marginBottom: 0, padding: '0.85rem' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} color="#16a34a" /> Inventario de Levantamiento (Croquis)
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Apagadores:</span> <strong>15 (A1-A15)</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contactos:</span> <strong>18 (C1-C18)</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Puertas:</span> <strong>7 (5 norm, 2 baño)</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ventanas:</span> <strong>2 (V1, V2)</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Clósets:</span> <strong>3 (con medidas)</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.35rem', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Caja Muro:</span> <strong>1 (Vertebral)</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Photo Preview Modal */}
      {activePhotoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.3rem' }}>
                  FOTOGRAFÍA #{activePhotoModal.id} • {activePhotoModal.categoryName}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>
                  {activePhotoModal.space}
                </h3>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setActivePhotoModal(null)}
                style={{ padding: '0.3rem 0.5rem' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Archivo:</strong> <code>{activePhotoModal.filename}</code>
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Elementos Eléctricos Visibles:</strong>
                <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)' }}>{activePhotoModal.visibleElements}</p>
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Canalizaciones y Trayectorias:</strong>
                <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)' }}>{activePhotoModal.conduitTrajectories}</p>
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Riesgos Eléctricos Detectados:</strong>
                <p style={{ margin: '0.2rem 0', color: '#dc2626' }}>{activePhotoModal.risks}</p>
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Información Pendiente de Inspección:</strong>
                <p style={{ margin: '0.2rem 0', color: '#b45309' }}>{activePhotoModal.pendingVerification}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setActivePhotoModal(null)}>
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
