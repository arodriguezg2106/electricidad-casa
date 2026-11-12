// DXF Exporter: Generates ASCII DXF (AutoCAD compatible) from floor plan rooms and electrical elements
// Compatible with AutoCAD, LibreCAD, QCad and all standard CAD viewers

import type { Room, ElectricalElement, ConduitPath, SurveyElement } from '../types.ts';

export function exportToDxf(
  rooms: Room[], 
  elements: ElectricalElement[], 
  conduits: ConduitPath[],
  surveyElements?: SurveyElement[],
  mode: 'all' | 'survey_only' | 'proposed_only' = 'all'
): string {
  let dxf = '';

  // HEADER SECTION
  dxf += '0\nSECTION\n2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1009\n'; // AutoCAD R12 DXF format (universally compatible)
  dxf += '9\n$INSUNITS\n70\n6\n'; // Units: Meters
  dxf += '0\nENDSEC\n';

  // TABLES SECTION (Layers)
  dxf += '0\nSECTION\n2\nTABLES\n';
  dxf += '0\nTABLE\n2\nLAYER\n70\n10\n';

  const layers = [
    { name: 'ARQUITECTURA_MUROS', color: 7 }, // White
    { name: 'ARQUITECTURA_TEXTO', color: 3 }, // Green
    { name: 'SURVEY_PUERTAS', color: 5 },     // Blue
    { name: 'SURVEY_VENTANAS', color: 4 },    // Cyan
    { name: 'SURVEY_CLOSETS', color: 6 },     // Magenta
    { name: 'SURVEY_APAGADORES', color: 2 },  // Yellow
    { name: 'SURVEY_CONTACTOS', color: 1 },   // Red
    { name: 'ELEC_ALUMBRADO', color: 2 },     // Yellow
    { name: 'ELEC_CONTACTOS', color: 4 },     // Cyan
    { name: 'ELEC_CANALIZACIONES', color: 1 },// Red
    { name: 'ELEC_TABLEROS', color: 6 },      // Magenta
  ];

  layers.forEach(l => {
    dxf += '0\nLAYER\n2\n' + l.name + '\n70\n0\n62\n' + l.color + '\n6\nCONTINUOUS\n';
  });

  dxf += '0\nENDTAB\n';
  dxf += '0\nENDSEC\n';

  // ENTITIES SECTION
  dxf += '0\nSECTION\n2\nENTITIES\n';

  // Draw Room Rectangles as 4 Lines each
  rooms.forEach(r => {
    const x1 = r.x;
    const y1 = -r.y; // Invert Y for standard CAD Cartesian orientation
    const x2 = r.x + r.width;
    const y2 = -(r.y + r.height);

    // 4 Muro lines
    const corners = [
      [x1, y1, x2, y1],
      [x2, y1, x2, y2],
      [x2, y2, x1, y2],
      [x1, y2, x1, y1]
    ];

    corners.forEach(([sx, sy, ex, ey]) => {
      dxf += '0\nLINE\n8\nARQUITECTURA_MUROS\n';
      dxf += `10\n${sx.toFixed(3)}\n20\n${sy.toFixed(3)}\n30\n0.0\n`;
      dxf += `11\n${ex.toFixed(3)}\n21\n${ey.toFixed(3)}\n31\n0.0\n`;
    });

    // Room Label Text
    dxf += '0\nTEXT\n8\nARQUITECTURA_TEXTO\n';
    dxf += `10\n${(x1 + 0.3).toFixed(3)}\n20\n${(y1 - 0.5).toFixed(3)}\n30\n0.0\n`;
    dxf += `40\n0.25\n`; // Text height 25cm
    dxf += `1\n${r.name} (${r.width.toFixed(1)}x${r.height.toFixed(1)}m)${r.isProvisional ? ' [PROVISIONAL]' : ''}\n`;
  });

  // Draw Survey Elements if present and mode includes survey
  if (surveyElements && mode !== 'proposed_only') {
    surveyElements.forEach(s => {
      const cx = s.x;
      const cy = -s.y;
      const layer = s.type === 'switch' ? 'SURVEY_APAGADORES' :
                    s.type === 'outlet' ? 'SURVEY_CONTACTOS' :
                    s.type === 'door' ? 'SURVEY_PUERTAS' :
                    s.type === 'window' ? 'SURVEY_VENTANAS' :
                    s.type === 'closet' ? 'SURVEY_CLOSETS' : 'ARQUITECTURA_TEXTO';

      dxf += '0\nPOINT\n8\n' + layer + '\n';
      dxf += `10\n${cx.toFixed(3)}\n20\n${cy.toFixed(3)}\n30\n0.0\n`;

      dxf += '0\nTEXT\n8\n' + layer + '\n';
      dxf += `10\n${(cx + 0.15).toFixed(3)}\n20\n${cy.toFixed(3)}\n30\n0.0\n`;
      dxf += `40\n0.18\n`;
      dxf += `1\n[${s.code}] ${s.dimensionsText || s.label}\n`;
    });
  }

  // Draw Proposed Electrical Elements
  if (mode !== 'survey_only') {
    elements.forEach(el => {
      const layer = el.type.startsWith('light') ? 'ELEC_ALUMBRADO' :
                    el.type.startsWith('outlet') ? 'ELEC_CONTACTOS' :
                    el.type.includes('center') || el.type.includes('meter') ? 'ELEC_TABLEROS' : 'ELEC_ALUMBRADO';
      
      const cx = el.x;
      const cy = -el.y;

      dxf += '0\nCIRCLE\n8\n' + layer + '\n';
      dxf += `10\n${cx.toFixed(3)}\n20\n${cy.toFixed(3)}\n30\n0.0\n`;
      dxf += `40\n0.15\n`;

      dxf += '0\nTEXT\n8\n' + layer + '\n';
      dxf += `10\n${(cx + 0.2).toFixed(3)}\n20\n${cy.toFixed(3)}\n30\n0.0\n`;
      dxf += `40\n0.15\n`;
      dxf += `1\n${el.label} [${el.circuitId || 'CFE'}]\n`;
    });

    // Draw Conduits as Lines connecting elements
    conduits.forEach(c => {
      const fromEl = elements.find(e => e.id === c.fromId);
      const toEl = elements.find(e => e.id === c.toId);
      if (fromEl && toEl) {
        dxf += '0\nLINE\n8\nELEC_CANALIZACIONES\n';
        dxf += `10\n${fromEl.x.toFixed(3)}\n20\n${(-fromEl.y).toFixed(3)}\n30\n0.0\n`;
        dxf += `11\n${toEl.x.toFixed(3)}\n21\n${(-toEl.y).toFixed(3)}\n31\n0.0\n`;
      }
    });
  }

  dxf += '0\nENDSEC\n';
  dxf += '0\nEOF\n';

  return dxf;
}
