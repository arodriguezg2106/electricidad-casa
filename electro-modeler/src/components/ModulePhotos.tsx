import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Search, 
  Filter, 
  Eye, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Ruler, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import type { PhotoData } from '../types.ts';
import photosJson from '../data/photosData.json';

const CATEGORIES = [
  { id: 0, name: 'Todas las Categorías' },
  { id: 1, name: '1. Fachada y medidor existente' },
  { id: 2, name: '2. Poste y acometida aérea' },
  { id: 3, name: '3. Escaleras y rutas alimentador' },
  { id: 4, name: '4. Sala y comedor' },
  { id: 5, name: '5. Cocina' },
  { id: 6, name: '6. Recámaras' },
  { id: 7, name: '7. Baños' },
  { id: 8, name: '8. Canalizaciones y cajas' },
  { id: 9, name: '9. Muros, techos y losas' },
  { id: 10, name: '10. Cable y materiales disponibles' },
  { id: 11, name: '11. Levantamiento y Croquis Físicos' },
];

export const ModulePhotos: React.FC = () => {
  const photos = photosJson as PhotoData[];

  const [selectedCat, setSelectedCat] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<PhotoData | null>(null);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchCat = selectedCat === 0 || p.categoryId === selectedCat;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        p.space.toLowerCase().includes(q) ||
        p.visibleElements.toLowerCase().includes(q) ||
        p.risks.toLowerCase().includes(q) ||
        p.filename.toLowerCase().includes(q);

      return matchCat && matchStatus && matchQuery;
    });
  }, [photos, selectedCat, selectedStatus, searchQuery]);

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setActivePhoto(photos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setActivePhoto(photos[prevIndex]);
  };

  return (
    <div>
      {/* Header Controls & Filters */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>
              Módulo de Diagnóstico Visual Fotográfico ({photos.length} Fotografías Reales)
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Inspección visual y clasificación técnica de cada elemento constructivo y eléctrico existente.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Search input */}
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                placeholder="Buscar espacio, riesgo, ducto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.2rem' }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(Number(e.target.value))}
              className="form-control"
              style={{ width: 'auto', minWidth: '200px' }}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-control"
              style={{ width: 'auto' }}
            >
              <option value="ALL">Todos los Estados</option>
              <option value="CONFIRMADA">CONFIRMADA</option>
              <option value="INFERIDA">INFERIDA</option>
              <option value="PENDIENTE DE VERIFICACIÓN">PENDIENTE VERIFICACIÓN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Photo Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            className="card"
            style={{ 
              padding: '0', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onClick={() => setActivePhoto(photo)}
          >
            {/* Thumbnail Image Container */}
            <div style={{ position: 'relative', width: '100%', height: '190px', backgroundColor: '#0f172a' }}>
              <img 
                src={`photos/${photo.filename}`} 
                alt={photo.space}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', gap: '0.35rem' }}>
                <span className="badge badge-secondary" style={{ background: 'rgba(15, 23, 42, 0.75)', color: 'white' }}>
                  #{photo.id}
                </span>
                <span className={`badge ${
                  photo.status === 'CONFIRMADA' ? 'badge-success' :
                  photo.status === 'INFERIDA' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {photo.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600, textTransform: 'uppercase' }}>
                  {photo.categoryName}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', margin: '0.2rem 0 0.4rem 0', lineHeight: 1.3 }}>
                  {photo.space}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {photo.visibleElements}
                </p>
              </div>

              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Ref: {photo.referenceScale.substring(0, 24)}...
                </span>
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>
                  <Eye size={13} /> Ficha Técnica
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Camera size={48} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <p>No se encontraron fotografías con los filtros seleccionados.</p>
        </div>
      )}

      {/* Modal Visor de Fotografía y Ficha Técnica Completa */}
      {activePhoto && (
        <div className="modal-overlay" onClick={() => setActivePhoto(null)}>
          <div 
            className="modal-card" 
            style={{ maxWidth: '1100px', width: '95vw', height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-secondary">Foto #{activePhoto.id} de {photos.length}</span>
                  <span className={`badge ${
                    activePhoto.status === 'CONFIRMADA' ? 'badge-success' :
                    activePhoto.status === 'INFERIDA' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {activePhoto.status}
                  </span>
                  <span className="badge badge-info">{activePhoto.categoryName}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.25rem' }}>
                  {activePhoto.space}
                </h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={handlePrevPhoto} title="Fotografía anterior">
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleNextPhoto} title="Siguiente fotografía">
                  Siguiente <ChevronRight size={16} />
                </button>
                <button 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                  onClick={() => setActivePhoto(null)}
                >
                  <X size={22} color="var(--text-muted)" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split view (Image + Technical Sheet) */}
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', padding: '1rem', overflow: 'hidden' }}>
              {/* Left Column: Big Image View */}
              <div style={{ 
                height: '100%', 
                backgroundColor: '#020617', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                <img 
                  src={`photos/${activePhoto.filename}`} 
                  alt={activePhoto.space}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  Archivo: {activePhoto.filename}
                </div>
              </div>

              {/* Right Column: Engineering Diagnostic Sheet */}
              <div style={{ overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Elementos Eléctricos Visibles */}
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Elementos Eléctricos Visibles
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                    {activePhoto.visibleElements}
                  </p>
                </div>

                {/* Trayectorias de Canalización */}
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Posibles Trayectorias de Canalización
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                    {activePhoto.conduitTrajectories}
                  </p>
                </div>

                {/* Materiales y Obstáculos Constructivos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
                      MATERIALES (MUROS/LOSAS)
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {activePhoto.wallMaterials}
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
                      OBSTÁCULOS CONSTRUCTIVOS
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {activePhoto.obstacles}
                    </p>
                  </div>
                </div>

                {/* Riesgos Eléctricos Visibles (ALERTA ROJA) */}
                <div style={{ 
                  background: '#fef2f2', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #fee2e2',
                  borderLeft: '4px solid #dc2626'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <ShieldAlert size={16} color="#dc2626" />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                      Riesgos Eléctricos y Normativa Aplicable
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.45 }}>
                    {activePhoto.risks}
                  </p>
                </div>

                {/* Escala de Referencia Métrica y Calibración */}
                <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <Ruler size={16} color="#16a34a" />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                      Referencia Métrica Identificada
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#14532d', lineHeight: 1.45 }}>
                    {activePhoto.referenceScale}
                  </p>
                </div>

                {/* Información Pendiente de Verificación en Sitio */}
                <div style={{ background: '#fffbeb', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <HelpCircle size={16} color="#d97706" />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                      Pendiente de Verificación en Sitio
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.45 }}>
                    {activePhoto.pendingVerification}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setActivePhoto(null)}>
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
