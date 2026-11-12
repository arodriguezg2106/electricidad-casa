import React from 'react';
import { Zap, Download, Upload, Printer, FileSpreadsheet, ShieldAlert, Cpu } from 'lucide-react';
import type { ProjectData } from '../types.ts';
import { exportToDxf } from '../utils/dxfExporter.ts';

interface HeaderProps {
  project: ProjectData;
  totalDemandVa: number;
  totalFloorArea: number;
  onSaveProject: () => void;
  onLoadProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  totalDemandVa,
  totalFloorArea,
  onSaveProject,
  onLoadProject,
  onExportCsv,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportDxf = () => {
    const dxfString = exportToDxf(project.rooms, project.elements, project.conduits);
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Plano_Electrico_${project.name.replace(/\s+/g, '_')}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-icon">
          <Zap size={24} />
        </div>
        <div>
          <h1 className="brand-title">VoltHome CDMX</h1>
          <p className="brand-subtitle">
            Modelado, Cálculo y Presupuesto Eléctrico Residencial | NOM-001-SEDE-2012 / CFE
          </p>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat-chip">
          <span className="stat-label">Superficie Interior</span>
          <span className="stat-value">{totalFloorArea.toFixed(1)} m²</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">Demanda Diversificada</span>
          <span className="stat-value">{(totalDemandVa / 1000).toFixed(2)} kVA</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">Suministro CFE</span>
          <span className="stat-value" style={{ color: '#0284c7' }}>{project.systemType}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">Alimentador Sugerido</span>
          <span className="stat-value" style={{ color: '#16a34a' }}>2F#8 + 1N#8 + 1T#8</span>
        </div>
      </div>

      <div className="header-actions no-print">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onLoadProject} 
          accept=".json" 
          style={{ display: 'none' }} 
        />
        
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => fileInputRef.current?.click()}
          title="Cargar archivo JSON de proyecto"
        >
          <Upload size={15} /> Abrir
        </button>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onSaveProject}
          title="Guardar archivo JSON de proyecto"
        >
          <Download size={15} /> Guardar
        </button>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handleExportDxf}
          title="Exportar plano a archivo DXF para AutoCAD / LibreCAD"
        >
          <Cpu size={15} /> Exportar DXF
        </button>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onExportCsv}
          title="Exportar presupuesto cuantificado a CSV para Excel"
        >
          <FileSpreadsheet size={15} /> CSV Presupuesto
        </button>

        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => window.print()}
          title="Imprimir o guardar reporte PDF completo"
        >
          <Printer size={15} /> Reporte PDF
        </button>
      </div>
    </header>
  );
};
