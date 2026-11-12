import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Navigation, type TabId } from './components/Navigation.tsx';
import { ModuleProject } from './components/ModuleProject.tsx';
import { ModulePhotos } from './components/ModulePhotos.tsx';
import { ModuleFloorPlan } from './components/ModuleFloorPlan.tsx';
import { ModuleLoadsCircuits } from './components/ModuleLoadsCircuits.tsx';
import { ModuleMaterials } from './components/ModuleMaterials.tsx';
import { ModuleBudget } from './components/ModuleBudget.tsx';
import { ModuleReports } from './components/ModuleReports.tsx';
import { initialProject } from './data/initialProject.ts';
import photosJson from './data/photosData.json';
import { calculateResidentialDemand } from './utils/calcEngine.ts';
import { quantifyProjectMaterials } from './utils/quantEngine.ts';
import { exportBudgetToCsv } from './utils/csvExporter.ts';
import type { ProjectData } from './types.ts';

export const App: React.FC = () => {
  const [project, setProject] = useState<ProjectData>(initialProject);
  const [activeTab, setActiveTab] = useState<TabId>('project');

  // Compute key engineering metrics
  const demandData = calculateResidentialDemand({
    rooms: project.rooms,
    loads: project.loads,
    systemType: project.systemType
  });

  const bom = quantifyProjectMaterials({
    elements: project.elements,
    conduits: project.conduits,
    reusableWires: project.reusableWires,
    feederLengthMeters: 16,
    systemType: project.systemType
  });

  // Save Project as JSON file
  const handleSaveProject = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proyecto_VoltHome_${project.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load Project from JSON file
  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target?.result as string);
        if (loaded && loaded.rooms && loaded.elements && loaded.circuits) {
          setProject(loaded);
          alert('¡Proyecto cargado exitosamente!');
        } else {
          alert('El archivo no tiene la estructura válida de VoltHome.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  // Export CSV for Excel
  const handleExportCsv = () => {
    const csvContent = exportBudgetToCsv(
      bom.items,
      bom.totalCostEco,
      bom.totalCostMid,
      bom.totalCostHigh
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Presupuesto_VoltHome_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* Header bar */}
      <Header
        project={project}
        totalDemandVa={demandData.totalDemandVa}
        totalFloorArea={demandData.floorAreaM2}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        onExportCsv={handleExportCsv}
      />

      {/* Navigation tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        photoCount={photosJson.length}
      />

      {/* Main Module Content */}
      <main className="main-content">
        {activeTab === 'project' && (
          <ModuleProject
            project={project}
            onUpdateProject={setProject}
            totalDemandVa={demandData.totalDemandVa}
            totalConnectedWatts={demandData.totalConnectedWatts}
            totalFloorArea={demandData.floorAreaM2}
          />
        )}

        {activeTab === 'photos' && (
          <ModulePhotos />
        )}

        {activeTab === 'floorplan' && (
          <ModuleFloorPlan
            rooms={project.rooms}
            elements={project.elements}
            conduits={project.conduits}
            surveyElements={project.surveyElements || []}
            onUpdateRooms={(rooms) => setProject(p => ({ ...p, rooms, lastUpdated: new Date().toISOString() }))}
            onUpdateElements={(elements) => setProject(p => ({ ...p, elements, lastUpdated: new Date().toISOString() }))}
            onUpdateConduits={(conduits) => setProject(p => ({ ...p, conduits, lastUpdated: new Date().toISOString() }))}
            onUpdateSurveyElements={(surveyElements) => setProject(p => ({ ...p, surveyElements, lastUpdated: new Date().toISOString() }))}
          />
        )}

        {activeTab === 'loads' && (
          <ModuleLoadsCircuits
            rooms={project.rooms}
            loads={project.loads}
            circuits={project.circuits}
            systemType={project.systemType}
            onUpdateLoads={(loads) => setProject(p => ({ ...p, loads, lastUpdated: new Date().toISOString() }))}
            onUpdateCircuits={(circuits) => setProject(p => ({ ...p, circuits, lastUpdated: new Date().toISOString() }))}
          />
        )}

        {activeTab === 'materials' && (
          <ModuleMaterials
            elements={project.elements}
            conduits={project.conduits}
            reusableWires={project.reusableWires}
            systemType={project.systemType}
            onUpdateReusableWires={(reusableWires) => setProject(p => ({ ...p, reusableWires, lastUpdated: new Date().toISOString() }))}
            onExportCsv={handleExportCsv}
          />
        )}

        {activeTab === 'budget' && (
          <ModuleBudget
            elements={project.elements}
            conduits={project.conduits}
            reusableWires={project.reusableWires}
            systemType={project.systemType}
            onExportCsv={handleExportCsv}
          />
        )}

        {activeTab === 'reports' && (
          <ModuleReports
            project={project}
            onSaveProject={handleSaveProject}
          />
        )}
      </main>
    </div>
  );
};

export default App;
