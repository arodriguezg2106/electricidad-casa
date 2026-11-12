import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Wrench, 
  Clock, 
  FileCheck,
  Building,
  Zap
} from 'lucide-react';
import type { ProjectData } from '../types.ts';

interface ModuleProjectProps {
  project: ProjectData;
  onUpdateProject: (updater: (prev: ProjectData) => ProjectData) => void;
  totalDemandVa: number;
  totalConnectedWatts: number;
  totalFloorArea: number;
}

export const ModuleProject: React.FC<ModuleProjectProps> = ({
  project,
  onUpdateProject,
  totalDemandVa,
  totalConnectedWatts,
  totalFloorArea
}) => {
  const [checklist, setChecklist] = React.useState<{ [key: string]: boolean }>({
    chk_cfe_factibilidad: false,
    chk_visita_electricista: false,
    chk_sondeo_poliducto: false,
    chk_levantamiento_cinta: false,
    chk_distancia_poste: false,
    chk_prueba_cable_reutilizable: false,
  });

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSystemTypeChange = (newType: '2F-3H (120/240V)' | '1F-2H (120V)') => {
    onUpdateProject(prev => ({
      ...prev,
      systemType: newType,
      lastUpdated: new Date().toISOString()
    }));
  };

  return (
    <div>
      {/* Banner de Aviso de Seguridad y Regla de Calidad */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <div style={{ color: '#2563eb', marginTop: '2px' }}>
          <Info size={26} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.25rem' }}>
            Criterio Rector del Proyecto: Trazabilidad, Seguridad y Cero Suposiciones No Validadas
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.5 }}>
            Este sistema modela la instalación eléctrica completamente nueva para el piso de Planta Alta en Ciudad de México.
            Por normativa <strong>NOM-001-SEDE-2012</strong> y especificaciones de <strong>CFE</strong>, todo dato de obra 
            sin referencia métrica física se clasifica como <strong>PROVISIONAL</strong>. Los calibres definitivos y 
            la preparación de acometida están sujetos a la autorización formal de CFE y la responsiva de un electricista calificado.
          </p>
        </div>
      </div>

      {/* Grid de Estado General y Parámetros */}
      <div className="grid-3">
        {/* Tarjeta 1: Datos de la Obra */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Building size={20} color="#0284c7" /> Ficha del Inmueble
            </h3>
            <span className="badge badge-info">CDMX Residencial</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>UBICACIÓN</span>
              <strong>{project.location}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>OCUPACIÓN</span>
              <strong>{project.occupants} personas permanentes</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>NIVEL EN INMUEBLE</span>
              <strong>Planta Alta (Nivel +2.70 m) con acceso independiente</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>ESTADO DE LA OBRA</span>
              <span className="badge badge-warning">Obra gris avanzada / Acabados en proceso</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Configuración del Suministro CFE */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Zap size={20} color="#eab308" /> Suministro Eléctrico CFE
            </h3>
            <span className="badge badge-warning">En Trámite</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div>
              <label className="form-label">TIPO DE SERVICIO SOLICITADO A CFE:</label>
              <select 
                className="form-control"
                value={project.systemType}
                onChange={(e) => handleSystemTypeChange(e.target.value as any)}
                style={{ fontWeight: 600 }}
              >
                <option value="2F-3H (120/240V)">2 Fases - 3 Hilos (120/240V) [RECOMENDADO]</option>
                <option value="1F-2H (120V)">1 Fase - 2 Hilos (120V Monofásico)</option>
              </select>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {project.systemType === '2F-3H (120/240V)' ? (
                <>
                  <strong style={{ color: '#16a34a' }}>Ventaja técnica:</strong> Permite balancear cargas entre L1 y L2, 
                  reduce la caída de tensión a menos de la mitad en el alimentador de 16 m y previene sobrecalentamiento.
                </>
              ) : (
                <>
                  <strong style={{ color: '#d97706' }}>Limitación:</strong> Al ser 120V monofásico, 5 kW representa 41.6 Amperes, 
                  obligando a un conductor calibre 6 o 4 AWG y saturando la capacidad permitida de CFE para un solo hilo.
                </>
              )}
            </p>
            <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
              <strong>Base de Medición:</strong> {project.systemType === '2F-3H (120/240V)' ? '5 Terminales cuadrada 100A' : '4 Terminales redonda 100A'}
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Semáforo de Certeza Técnica */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileCheck size={20} color="#16a34a" /> Semáforo de Certeza
            </h3>
            <span className="badge badge-secondary">Trazabilidad</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: '#f0fdf4', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>CONFIRMADAS</span>
              </div>
              <span className="badge badge-success">38 fotos / 9 áreas</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: '#fffbeb', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#d97706" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>INFERIDAS</span>
              </div>
              <span className="badge badge-warning">Dimensiones y losas</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: '#fef2f2', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={16} color="#dc2626" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PENDIENTES CFE</span>
              </div>
              <span className="badge badge-danger">Mufa / Poste / Acometida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hallazgos Críticos de Seguridad Detectados en las Fotos */}
      <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ color: '#991b1b' }}>
            <ShieldAlert size={22} color="#dc2626" /> Hallazgos Críticos de Normativa Detectados en la Inspección Fotográfica
          </h3>
          <span className="badge badge-danger">Atención Requerida</span>
        </div>
        
        <div className="grid-3">
          <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.4rem' }}>
              1. Poliducto Naranja en Losa de Concreto
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.45 }}>
              En la foto <strong>32</strong> se identificaron tramos de poliducto corrugado naranja llegando a cajas octagonales de techo. 
              La <strong>NOM-001-SEDE-2012 Artículo 362</strong> y especificaciones de protección civil restringen el poliducto naranja 
              común no autoextinguible. Es obligatorio realizar <strong>sondeo previo con guía de acero</strong> para descartar estrangulamiento 
              o colapso por el colado de concreto antes de tender conductores.
            </p>
          </div>

          <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fef3c7' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400e', marginBottom: '0.4rem' }}>
              2. Zonas Húmedas sin GFCI Instalado
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.45 }}>
              En fotos <strong>24, 39 y 43</strong> hay chalupas metálicas abiertas sobre lavabos y bajo el espejo LED a menos de 30 cm de grifos de agua. 
              Por <strong>NOM Art. 210-8(a)(1)</strong> todos los receptáculos de cuartos de baño DEBEN ser con protección de falla a tierra (GFCI clase A 5mA). 
              Queda estrictamente prohibido colocar contactos convencionales sin GFCI.
            </p>
          </div>

          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #dcfce7' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: '0.4rem' }}>
              3. Independencia Total de Neutros y Tierras
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#14532d', lineHeight: 1.45 }}>
              Al ser un segundo medidor independiente en un inmueble existente, <strong>jamás se debe compartir el neutro existente de la casa de abajo</strong>. 
              En el centro de carga de Planta Alta, la barra de neutros y la barra de puesta a tierra DEBEN permanecer separadas y aisladas entre sí (sistema derivado de 3 o 4 hilos).
            </p>
          </div>
        </div>
      </div>

      {/* Checklist de Validación y Acciones Previas a Compras */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Wrench size={20} color="#0284c7" /> Lista Priorizada de Validaciones Previas a Adquisición de Materiales
          </h3>
          <span className="badge badge-secondary">Fase 1: Preparatoria</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            {
              id: 'chk_cfe_factibilidad',
              title: '1. Factibilidad formal ante ventanilla de CFE',
              desc: 'Confirmar si CFE autoriza acometida bifásica 120/240V o únicamente monofásica 120V para el segundo servicio.',
              norm: 'CFE-EM-BT101 / BT102'
            },
            {
              id: 'chk_distancia_poste',
              title: '2. Medición de distancia de fachada a poste de CFE',
              desc: 'Medir distancia horizontal al poste en calle. Si supera 30 metros, CFE exige colocación de poste intermedio.',
              norm: 'NOM Art. 230-24'
            },
            {
              id: 'chk_sondeo_poliducto',
              title: '3. Sondeo con guía plástica/acero en losas existentes',
              desc: 'Pasar guía por cada tramo de poliducto naranja en techos para verificar que no esté estrangulado por concreto.',
              norm: 'NOM Art. 362'
            },
            {
              id: 'chk_levantamiento_cinta',
              title: '4. Levantamiento métrico con flexómetro de precisión',
              desc: 'Calibrar las dimensiones provisionales del plano 2D midiendo las paredes de cada recámara y sala.',
              norm: 'Planimetría Real'
            },
            {
              id: 'chk_prueba_cable_reutilizable',
              title: '5. Prueba de resistencia de aislamiento en cable existente',
              desc: 'Probar rollos de la cubeta con megóhmetro (mínimo 50 MΩ a 500V DC) y comprobar que no sea aluminio CCA.',
              norm: 'NMX-J-010-ANCE'
            },
            {
              id: 'chk_visita_electricista',
              title: '6. Inspección en sitio por electricista calificado',
              desc: 'Validar la ruta de subida del alimentador por el cubo de escaleras sin perforar elementos estructurales.',
              norm: 'NOM-001-SEDE-2012'
            }
          ].map(item => (
            <div 
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.85rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: checklist[item.id] ? '#f0fdf4' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <input 
                type="checkbox" 
                checked={checklist[item.id]} 
                onChange={() => {}}
                style={{ width: '18px', height: '18px', marginTop: '3px', cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem', color: checklist[item.id] ? '#166534' : 'var(--secondary)' }}>
                    {item.title}
                  </strong>
                  <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>{item.norm}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
