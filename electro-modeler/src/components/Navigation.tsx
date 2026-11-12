import React from 'react';
import { 
  Building2, 
  Camera, 
  PenTool, 
  Zap, 
  Package, 
  DollarSign, 
  FileText 
} from 'lucide-react';

export type TabId = 
  | 'project'
  | 'photos'
  | 'floorplan'
  | 'loads'
  | 'materials'
  | 'budget'
  | 'reports';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  photoCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  photoCount
}) => {
  const tabs = [
    { id: 'project', label: '1. Proyecto y Estado', icon: Building2 },
    { id: 'photos', label: `2. Fotografías (${photoCount})`, icon: Camera },
    { id: 'floorplan', label: '3. Plano Eléctrico 2D', icon: PenTool },
    { id: 'loads', label: '4. Cargas y Unifilar', icon: Zap },
    { id: 'materials', label: '5. Materiales e Inventario', icon: Package },
    { id: 'budget', label: '6. Presupuesto y Proveedores', icon: DollarSign },
    { id: 'reports', label: '7. Memoria y Reportes', icon: FileText },
  ];

  return (
    <nav className="nav-bar no-print">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id as TabId)}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
