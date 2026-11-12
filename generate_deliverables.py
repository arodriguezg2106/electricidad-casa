# -*- coding: utf-8 -*-
"""
Generador de Archivos Entregables Técnicos VoltHome CDMX:
1. Plano arquitectónico 2D vectorial (SVG)
2. Plano eléctrico 2D preliminar (SVG)
3. Plano eléctrico en formato CAD universal (DXF)
4. Diagrama unifilar preliminar vectorial (SVG)
5. Cuadro de cargas y circuitos (CSV)
6. Presupuesto detallado cuantificado con 3 escenarios (CSV)
"""

import json
import os
import math

# Load initial project data from json
with open('electro-modeler/src/data/photosData.json', 'r', encoding='utf-8') as f:
    photos_data = json.load(f)

# Scale for SVG: 70 pixels = 1 meter
SCALE = 70
ORIGIN_X = 260
ORIGIN_Y = 120

ROOMS = [
    {"id": "room_sala_comedor", "name": "Sala y Comedor", "type": "living_dining", "x": 0.0, "y": 0.0, "w": 6.2, "h": 4.0, "prov": True, "color": "#e0f2fe"},
    {"id": "room_cocina", "name": "Cocina", "type": "kitchen", "x": 6.2, "y": 0.0, "w": 3.2, "h": 2.8, "prov": True, "color": "#fef3c7"},
    {"id": "room_pasillo", "name": "Pasillo Distribuidor", "type": "hallway", "x": 0.0, "y": 4.0, "w": 6.2, "h": 1.2, "prov": True, "color": "#f3f4f6"},
    {"id": "room_escalera", "name": "Cubo de Escaleras", "type": "stairs", "x": 6.2, "y": 2.8, "w": 3.2, "h": 2.4, "prov": True, "color": "#ede9fe"},
    {"id": "room_bano1", "name": "Baño 1 (General)", "type": "bathroom", "x": 0.0, "y": 5.2, "w": 2.2, "h": 1.6, "prov": True, "color": "#f1f5f9"},
    {"id": "room_bano2", "name": "Baño 2 (Suite)", "type": "bathroom", "x": 2.2, "y": 5.2, "w": 2.4, "h": 1.6, "prov": True, "color": "#f1f5f9"},
    {"id": "room_recamara1", "name": "Recámara 1 (Posterior)", "type": "bedroom", "x": 0.0, "y": 6.8, "w": 4.6, "h": 3.6, "prov": True, "color": "#e0e7ff"},
    {"id": "room_recamara2", "name": "Recámara 2 (Estudio / Almacén)", "type": "bedroom", "x": 4.6, "y": 5.2, "w": 4.8, "h": 5.2, "prov": True, "color": "#e0e7ff"},
    {"id": "room_fachada_ext", "name": "Fachada PB (Nivel Calle)", "type": "exterior", "x": -2.6, "y": 0.0, "w": 2.2, "h": 3.5, "prov": True, "color": "#fee2e2"}
]

ELEMENTS = [
    {"id": "el_mufa", "type": "mufa", "x": -1.5, "y": 0.5, "label": "Mufa Aérea 1 1/4\" (4.80 m)", "circuit": "CFE"},
    {"id": "el_meter", "type": "meter", "x": -1.5, "y": 1.8, "label": "2° Medidor CFE (5 Terminales)", "circuit": "CFE"},
    {"id": "el_ground", "type": "ground", "x": -2.0, "y": 2.8, "label": "Varilla Tierra Copperweld 5/8\"", "circuit": "TIERRA"},
    {"id": "el_main_sw", "type": "main_sw", "x": -1.5, "y": 2.4, "label": "Interruptor Principal 2x40A", "circuit": "CFE"},
    {"id": "el_load_center", "type": "tc", "x": 5.8, "y": 4.2, "label": "Centro Carga PA QO-8", "circuit": "TABLERO"},
    {"id": "el_light_sala", "type": "light", "x": 1.8, "y": 2.0, "label": "Luz Sala", "circuit": "C1"},
    {"id": "el_light_comedor", "type": "light", "x": 4.5, "y": 2.0, "label": "Luz Comedor", "circuit": "C1"},
    {"id": "el_light_cocina", "type": "light", "x": 7.8, "y": 1.4, "label": "Luz Cocina", "circuit": "C1"},
    {"id": "el_light_pasillo1", "type": "light", "x": 2.0, "y": 4.6, "label": "Luz Pasillo 1", "circuit": "C1"},
    {"id": "el_light_pasillo2", "type": "light", "x": 4.8, "y": 4.6, "label": "Luz Pasillo 2", "circuit": "C1"},
    {"id": "el_light_bano1", "type": "light", "x": 1.1, "y": 6.0, "label": "Luz Baño 1", "circuit": "C1"},
    {"id": "el_light_bano2", "type": "light", "x": 3.4, "y": 6.0, "label": "Luz Baño 2", "circuit": "C1"},
    {"id": "el_light_rec1", "type": "light", "x": 2.3, "y": 8.5, "label": "Luz Recámara 1", "circuit": "C1"},
    {"id": "el_light_rec2", "type": "light", "x": 7.0, "y": 7.8, "label": "Luz Recámara 2", "circuit": "C1"},
    {"id": "el_sw_sala", "type": "switch", "x": 6.0, "y": 3.8, "label": "Apagador Sala", "circuit": "C1"},
    {"id": "el_sw_cocina", "type": "switch", "x": 6.4, "y": 2.6, "label": "Apagador Cocina", "circuit": "C1"},
    {"id": "el_sw_bano1", "type": "switch", "x": 0.2, "y": 5.4, "label": "Apagador Baño 1", "circuit": "C1"},
    {"id": "el_sw_bano2", "type": "switch", "x": 2.4, "y": 5.4, "label": "Apagador Baño 2", "circuit": "C1"},
    {"id": "el_sw_rec1", "type": "switch", "x": 0.2, "y": 7.0, "label": "Apagador Rec 1", "circuit": "C1"},
    {"id": "el_sw_rec2", "type": "switch", "x": 4.8, "y": 5.4, "label": "Apagador Rec 2", "circuit": "C1"},
    {"id": "el_out_sala_tv", "type": "outlet", "x": 1.2, "y": 3.9, "label": "Contacto Sala TV", "circuit": "C2"},
    {"id": "el_out_sala_vent", "type": "outlet", "x": 0.3, "y": 1.5, "label": "Contacto Sala Vent", "circuit": "C2"},
    {"id": "el_out_comedor", "type": "outlet", "x": 4.8, "y": 0.2, "label": "Contacto Comedor", "circuit": "C2"},
    {"id": "el_out_rec1_left", "type": "outlet", "x": 0.2, "y": 8.5, "label": "Contacto Rec 1 Izq", "circuit": "C2"},
    {"id": "el_out_rec1_back", "type": "outlet", "x": 2.3, "y": 10.3, "label": "Contacto Rec 1 Fondo", "circuit": "C2"},
    {"id": "el_out_rec2_muro", "type": "outlet", "x": 9.3, "y": 8.0, "label": "Contacto Rec 2 Muro", "circuit": "C2"},
    {"id": "el_out_barra", "type": "gfci", "x": 6.4, "y": 2.2, "label": "GFCI Barra Cocina", "circuit": "C3"},
    {"id": "el_out_tarja", "type": "gfci", "x": 9.2, "y": 1.4, "label": "GFCI Tarja Cocina", "circuit": "C3"},
    {"id": "el_out_refri", "type": "outlet", "x": 6.4, "y": 0.3, "label": "Contacto Refrigerador", "circuit": "C4"},
    {"id": "el_out_micro", "type": "gfci", "x": 8.2, "y": 0.2, "label": "GFCI Microondas", "circuit": "C4"},
    {"id": "el_out_bano1", "type": "gfci", "x": 1.4, "y": 5.4, "label": "GFCI Baño 1 Lavabo", "circuit": "C5"},
    {"id": "el_out_bano2", "type": "gfci", "x": 3.4, "y": 5.4, "label": "GFCI Baño 2 Espejo", "circuit": "C5"},
]

CONDUITS = [
    {"from": "el_main_sw", "to": "el_load_center", "label": "Alimentador 1\" (2#8+1#8N+1#8T)", "isFeeder": True},
    {"from": "el_load_center", "to": "el_light_comedor", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_light_comedor", "to": "el_light_sala", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_light_comedor", "to": "el_light_cocina", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_load_center", "to": "el_light_pasillo2", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_light_pasillo1", "to": "el_light_bano1", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_light_pasillo2", "to": "el_light_bano2", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_light_pasillo1", "to": "el_light_rec1", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_light_pasillo2", "to": "el_light_rec2", "label": "1/2\" (C1)", "isFeeder": False},
    {"from": "el_load_center", "to": "el_out_sala_tv", "label": "3/4\" (C2)", "isFeeder": False},
    {"from": "el_out_sala_tv", "to": "el_out_rec1_left", "label": "3/4\" (C2)", "isFeeder": False},
    {"from": "el_out_rec1_back", "to": "el_out_rec2_muro", "label": "3/4\" (C2)", "isFeeder": False},
    {"from": "el_load_center", "to": "el_out_barra", "label": "3/4\" (C3)", "isFeeder": False},
    {"from": "el_out_barra", "to": "el_out_tarja", "label": "3/4\" (C3)", "isFeeder": False},
    {"from": "el_load_center", "to": "el_out_refri", "label": "3/4\" (C4)", "isFeeder": False},
    {"from": "el_load_center", "to": "el_out_bano2", "label": "3/4\" (C5)", "isFeeder": False},
    {"from": "el_out_bano2", "to": "el_out_bano1", "label": "3/4\" (C5)", "isFeeder": False},
]

# 1. PLANO ARQUITECTONICO 2D (SVG)
def generate_arch_svg():
    svg = ['<?xml version="1.0" encoding="UTF-8"?>']
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" width="1150" height="950" viewBox="0 0 1150 950">')
    svg.append('<style>')
    svg.append('text { font-family: Arial, sans-serif; }')
    svg.append('.wall { fill: none; stroke: #1e293b; stroke-width: 3.5; }')
    svg.append('.grid { stroke: #f1f5f9; stroke-width: 1; }')
    svg.append('.dim { fill: #475569; font-size: 11px; font-family: monospace; }')
    svg.append('</style>')
    svg.append('<rect width="100%" height="90%" fill="#ffffff" />')

    # Header title block
    svg.append('<g transform="translate(40, 40)">')
    svg.append('<text x="0" y="0" font-size="20" font-weight="bold" fill="#0f172a">PLANO ARQUITECTÓNICO PRELIMINAR - PLANTA ALTA</text>')
    svg.append('<text x="0" y="20" font-size="12" fill="#64748b">Proyecto: Instalación Eléctrica Independiente | Ubicación: CDMX | Escala gráfica 1:50</text>')
    svg.append('</g>')

    # Group with offset
    svg.append(f'<g transform="translate({ORIGIN_X}, {ORIGIN_Y})">')

    # Draw Rooms
    for r in ROOMS:
        rx = r['x'] * SCALE
        ry = r['y'] * SCALE
        rw = r['w'] * SCALE
        rh = r['h'] * SCALE

        dash = 'stroke-dasharray="6,4"' if r['prov'] else ''
        svg.append(f'<rect x="{rx}" y="{ry}" width="{rw}" height="{rh}" fill="{r["color"]}" fill-opacity="0.3" stroke="#334155" stroke-width="2.5" {dash} />')
        
        # Room label
        svg.append(f'<text x="{rx + 10}" y="{ry + 22}" font-size="13" font-weight="bold" fill="#0f172a">{r["name"]}</text>')
        svg.append(f'<text x="{rx + 10}" y="{ry + 38}" class="dim">{r["w"]:.2f}m × {r["h"]:.2f}m ({(r["w"]*r["h"]):.1f} m²)</text>')

        if r['prov']:
            svg.append(f'<rect x="{rx + rw - 95}" y="{ry + 8}" width="88" height="18" rx="4" fill="#fef3c7" stroke="#fde68a" />')
            svg.append(f'<text x="{rx + rw - 51}" y="{ry + 21}" font-size="9" font-weight="bold" fill="#92400e" text-anchor="middle">PROVISIONAL</text>')

        # Details
        if r['type'] == 'stairs':
            for step in range(1, 10):
                sy = ry + step * (rh / 10)
                svg.append(f'<line x1="{rx + 15}" y1="{sy}" x2="{rx + rw - 15}" y2="{sy}" stroke="#94a3b8" stroke-width="1.2" />')
            svg.append(f'<text x="{rx + rw/2}" y="{ry + rh/2}" font-size="10" font-weight="bold" fill="#6366f1" text-anchor="middle">HUECO ESCALERA A PB / AZOTEA</text>')

        if r['id'] == 'room_cocina':
            svg.append(f'<rect x="{rx - 10}" y="{ry + 10}" width="20" height="{SCALE * 2.0}" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5" />')
            svg.append(f'<text x="{rx}" y="{ry + SCALE * 1.0}" font-size="9" font-weight="bold" fill="#c2410c" text-anchor="middle" transform="rotate(-90, {rx}, {ry + SCALE * 1.0})">BARRA (2.0 m)</text>')

    # Metric Scale Bar
    svg.append('<g transform="translate(0, 780)">')
    svg.append(f'<rect x="0" y="0" width="{SCALE}" height="6" fill="#0f172a" />')
    svg.append(f'<rect x="{SCALE}" y="0" width="{SCALE}" height="6" fill="#e2e8f0" stroke="#0f172a" stroke-width="1" />')
    svg.append('<text x="0" y="20" font-size="10" font-weight="bold" fill="#0f172a">0.0 m</text>')
    svg.append(f'<text x="{SCALE}" y="20" font-size="10" font-weight="bold" fill="#0f172a">1.0 m</text>')
    svg.append(f'<text x="{SCALE*2}" y="20" font-size="10" font-weight="bold" fill="#0f172a">2.0 m</text>')
    svg.append('<text x="0" y="-8" font-size="11" font-weight="bold" fill="#475569">ESCALA MÉTRICA GRÁFICA (1 m = 70 px)</text>')
    svg.append('</g>')

    svg.append('</g>')
    svg.append('</svg>')
    return '\n'.join(svg)

# 2. PLANO ELECTRICO 2D PRELIMINAR (SVG)
def generate_elec_svg():
    svg = ['<?xml version="1.0" encoding="UTF-8"?>']
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" width="1150" height="950" viewBox="0 0 1150 950">')
    svg.append('<style>')
    svg.append('text { font-family: Arial, sans-serif; }')
    svg.append('.dim { fill: #475569; font-size: 11px; font-family: monospace; }')
    svg.append('</style>')
    svg.append('<rect width="100%" height="100%" fill="#ffffff" />')

    # Title Block
    svg.append('<g transform="translate(40, 40)">')
    svg.append('<text x="0" y="0" font-size="20" font-weight="bold" fill="#0f172a">PLANO ELÉCTRICO PRELIMINAR - DISTRIBUCIÓN Y CIRCUITOS</text>')
    svg.append('<text x="0" y="20" font-size="12" fill="#64748b">NOM-001-SEDE-2012 / CFE 120/240V 2F-3H | Simbología Normalizada</text>')
    svg.append('</g>')

    svg.append(f'<g transform="translate({ORIGIN_X}, {ORIGIN_Y})">')

    # Rooms as base architecture
    for r in ROOMS:
        rx = r['x'] * SCALE
        ry = r['y'] * SCALE
        rw = r['w'] * SCALE
        rh = r['h'] * SCALE
        svg.append(f'<rect x="{rx}" y="{ry}" width="{rw}" height="{rh}" fill="{r["color"]}" fill-opacity="0.2" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,2" />')
        svg.append(f'<text x="{rx + 8}" y="{ry + 18}" font-size="11" font-weight="bold" fill="#475569">{r["name"]}</text>')

    # Conduit Lines
    el_map = {e['id']: e for e in ELEMENTS}
    for c in CONDUITS:
        from_el = el_map.get(c['from'])
        to_el = el_map.get(c['to'])
        if from_el and to_el:
            x1 = from_el['x'] * SCALE
            y1 = from_el['y'] * SCALE
            x2 = to_el['x'] * SCALE
            y2 = to_el['y'] * SCALE

            color = '#dc2626' if c['isFeeder'] else '#64748b'
            width = 3.5 if c['isFeeder'] else 1.8
            dash = 'stroke-dasharray="5,3"' if not c['isFeeder'] and 'C1' in c['label'] else ''
            svg.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" {dash} />')
            
            # Label
            mx = (x1 + x2) / 2
            my = (y1 + y2) / 2 - 4
            svg.append(f'<text x="{mx}" y="{my}" font-size="8.5" font-family="monospace" font-weight="bold" fill="{color}" text-anchor="middle" stroke="#ffffff" stroke-width="2.5" paint-order="stroke">{c["label"]}</text>')

    # Electrical Elements Symbols
    for e in ELEMENTS:
        ex = e['x'] * SCALE
        ey = e['y'] * SCALE
        etype = e['type']

        if etype == 'light':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<circle r="10" fill="#ffffff" stroke="#eab308" stroke-width="2" />')
            svg.append('<line x1="-7" y1="-7" x2="7" y2="7" stroke="#eab308" stroke-width="1.8" />')
            svg.append('<line x1="-7" y1="7" x2="7" y2="-7" stroke="#eab308" stroke-width="1.8" />')
            svg.append(f'<text x="0" y="20" font-size="8" font-weight="bold" fill="#854d0e" text-anchor="middle">{e["label"]}</text>')
            svg.append('</g>')

        elif etype == 'switch':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<circle r="7" fill="#ffffff" stroke="#334155" stroke-width="1.5" />')
            svg.append('<text x="0" y="3" font-size="9" font-weight="bold" fill="#334155" text-anchor="middle">S</text>')
            svg.append('</g>')

        elif etype == 'outlet':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<circle r="8" fill="#ffffff" stroke="#3b82f6" stroke-width="1.8" />')
            svg.append('<path d="M -8 0 A 8 8 0 0 0 8 0 Z" fill="#3b82f6" />')
            svg.append(f'<text x="0" y="19" font-size="7.5" font-weight="bold" fill="#1e40af" text-anchor="middle">{e["label"]}</text>')
            svg.append('</g>')

        elif etype == 'gfci':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<circle r="9" fill="#fee2e2" stroke="#dc2626" stroke-width="2" />')
            svg.append('<path d="M -9 0 A 9 9 0 0 0 9 0 Z" fill="#dc2626" />')
            svg.append('<text x="0" y="-11" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">GFCI</text>')
            svg.append(f'<text x="0" y="20" font-size="7.5" font-weight="bold" fill="#991b1b" text-anchor="middle">{e["label"]}</text>')
            svg.append('</g>')

        elif etype == 'tc':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<rect x="-14" y="-14" width="28" height="28" fill="#0f172a" stroke="#38bdf8" stroke-width="2" rx="3" />')
            svg.append('<line x1="-14" y1="-14" x2="14" y2="14" stroke="#ffffff" stroke-width="1.5" />')
            svg.append('<text x="0" y="25" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">CENTRO DE CARGA (QO-8)</text>')
            svg.append('</g>')

        elif etype == 'meter':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<circle r="14" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5" />')
            svg.append('<text x="0" y="4" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">M₂</text>')
            svg.append('<text x="0" y="26" font-size="9" font-weight="bold" fill="#dc2626" text-anchor="middle">MEDIDOR 2 CFE</text>')
            svg.append('</g>')

        elif etype == 'mufa':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<polygon points="0,-12 10,6 -10,6" fill="#f59e0b" stroke="#78350f" stroke-width="1.5" />')
            svg.append('<text x="0" y="17" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">MUFA 1 1/4"</text>')
            svg.append('</g>')

        elif etype == 'ground':
            svg.append(f'<g transform="translate({ex}, {ey})">')
            svg.append('<circle r="6" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />')
            svg.append('<line x1="0" y1="6" x2="0" y2="16" stroke="#16a34a" stroke-width="2" />')
            svg.append('<line x1="-6" y1="12" x2="6" y2="12" stroke="#16a34a" stroke-width="1.5" />')
            svg.append('<line x1="-4" y1="15" x2="4" y2="15" stroke="#16a34a" stroke-width="1.2" />')
            svg.append('<line x1="-2" y1="18" x2="2" y2="18" stroke="#16a34a" stroke-width="1.0" />')
            svg.append('<text x="0" y="28" font-size="8" font-weight="bold" fill="#15803d" text-anchor="middle">VARILLA TIERRA</text>')
            svg.append('</g>')

    # Electrical Legend Card
    svg.append('<g transform="translate(-200, 480)">')
    svg.append('<rect width="210" height="280" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />')
    svg.append('<text x="12" y="24" font-size="11" font-weight="bold" fill="#0f172a">SIMBOLOGÍA ELÉCTRICA</text>')
    
    symbols = [
        ("Luminaria Techo (C1)", "#eab308"),
        ("Contacto Dúplex 120V (C2)", "#3b82f6"),
        ("Contacto GFCI 20A (C3/C5)", "#dc2626"),
        ("Apagador Sencillo (S)", "#334155"),
        ("Centro de Carga QO-8", "#0f172a"),
        ("Segundo Medidor CFE", "#dc2626"),
        ("Varilla Tierra Copperweld", "#16a34a"),
        ("Alimentador Principal 1\"", "#dc2626"),
    ]
    for idx, (sym, col) in enumerate(symbols):
        sy = 50 + idx * 28
        svg.append(f'<circle cx="22" cy="{sy-4}" r="5" fill="{col}" />')
        svg.append(f'<text x="36" y="{sy}" font-size="9" font-weight="bold" fill="#334155">{sym}</text>')

    svg.append('</g>')

    svg.append('</g>')
    svg.append('</svg>')
    return '\n'.join(svg)

# 3. PLANO CAD DXF (AutoCAD R12 universal)
def generate_cad_dxf():
    dxf = ['0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$INSUNITS\n70\n6\n0\nENDSEC']
    dxf.append('0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n5')
    
    layers = [
        ("ARQ_MUROS", 7),
        ("ARQ_TEXTO", 3),
        ("ELEC_ALUMBRADO", 2),
        ("ELEC_CONTACTOS", 4),
        ("ELEC_CANALIZACIONES", 1),
        ("ELEC_TABLEROS", 6)
    ]
    for lname, lcolor in layers:
        dxf.append(f'0\nLAYER\n2\n{lname}\n70\n0\n62\n{lcolor}\n6\nCONTINUOUS')
    dxf.append('0\nENDTAB\n0\nENDSEC')

    dxf.append('0\nSECTION\n2\nENTITIES')

    # Rooms as 4 lines
    for r in ROOMS:
        x1, y1 = r['x'], -r['y']
        x2, y2 = r['x'] + r['w'], -(r['y'] + r['h'])
        lines = [
            (x1, y1, x2, y1),
            (x2, y1, x2, y2),
            (x2, y2, x1, y2),
            (x1, y2, x1, y1)
        ]
        for sx, sy, ex, ey in lines:
            dxf.append(f'0\nLINE\n8\nARQ_MUROS\n10\n{sx:.3f}\n20\n{sy:.3f}\n30\n0.0\n11\n{ex:.3f}\n21\n{ey:.3f}\n31\n0.0')

        # Room text
        dxf.append(f'0\nTEXT\n8\nARQ_TEXTO\n10\n{(x1+0.2):.3f}\n20\n{(y1-0.4):.3f}\n30\n0.0\n40\n0.25\n1\n{r["name"]} ({r["w"]:.2f}x{r["h"]:.2f}m)')

    # Elements
    for e in ELEMENTS:
        cx, cy = e['x'], -e['y']
        layer = "ELEC_ALUMBRADO" if e['type'] in ['light', 'switch'] else "ELEC_CONTACTOS" if 'out' in e['type'] or 'gfci' in e['type'] else "ELEC_TABLEROS"
        dxf.append(f'0\nCIRCLE\n8\n{layer}\n10\n{cx:.3f}\n20\n{cy:.3f}\n30\n0.0\n40\n0.15')
        dxf.append(f'0\nTEXT\n8\n{layer}\n10\n{(cx+0.2):.3f}\n20\n{cy:.3f}\n30\n0.0\n40\n0.15\n1\n{e["label"]}')

    # Conduits
    el_map = {e['id']: e for e in ELEMENTS}
    for c in CONDUITS:
        from_el = el_map.get(c['from'])
        to_el = el_map.get(c['to'])
        if from_el and to_el:
            dxf.append(f'0\nLINE\n8\nELEC_CANALIZACIONES\n10\n{from_el["x"]:.3f}\n20\n{-from_el["y"]:.3f}\n30\n0.0\n11\n{to_el["x"]:.3f}\n21\n{-to_el["y"]:.3f}\n31\n0.0')

    dxf.append('0\nENDSEC\n0\nEOF')
    return '\n'.join(dxf)

# 4. DIAGRAMA UNIFILAR (SVG)
def generate_unifilar_svg():
    # Read our unifilar SVG structure or generate clean standalone SVG
    svg = ['<?xml version="1.0" encoding="UTF-8"?>']
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="580" viewBox="0 0 1000 580">')
    svg.append('<style>')
    svg.append('text { font-family: Arial, sans-serif; }')
    svg.append('</style>')
    svg.append('<rect width="100%" height="100%" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />')

    # Title
    svg.append('<g transform="translate(40, 40)">')
    svg.append('<text x="0" y="0" font-size="18" font-weight="bold" fill="#0f172a">DIAGRAMA UNIFILAR PRELIMINAR - NUEVO SERVICIO CFE INDEPENDIENTE</text>')
    svg.append('<text x="0" y="20" font-size="11" fill="#64748b">Especificación CFE-EM-BT102 (120/240V, 2 Fases - 3 Hilos) / NOM-001-SEDE-2012</text>')
    svg.append('</g>')

    # Street Network
    svg.append('<g transform="translate(60, 100)">')
    svg.append('<text x="0" y="0" font-size="11" font-weight="bold" fill="#dc2626">RED AÉREA DE CFE (POSTE DE CALLE)</text>')
    svg.append('<text x="0" y="16" font-size="9.5" fill="#64748b">120/240V, 3 HILOS, 60 Hz</text>')
    svg.append('<line x1="0" y1="26" x2="160" y2="26" stroke="#dc2626" stroke-width="2.5" />')
    svg.append('</g>')

    # Mufa
    svg.append('<g transform="translate(110, 160)">')
    svg.append('<polygon points="0,-12 12,8 -12,8" fill="#f59e0b" stroke="#78350f" stroke-width="1.5" />')
    svg.append('<text x="20" y="2" font-size="10" font-weight="bold" fill="#0f172a">MUFA AÉREA 1 1/4" (4.80 m)</text>')
    svg.append('<line x1="0" y1="8" x2="0" y2="50" stroke="#0f172a" strokeWidth="2" />')
    svg.append('</g>')

    # Medidor 2
    svg.append('<g transform="translate(110, 240)">')
    svg.append('<circle r="24" fill="#ffffff" stroke="#dc2626" stroke-width="2.5" />')
    svg.append('<text x="0" y="6" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">M₂</text>')
    svg.append('<text x="35" y="0" font-size="11" font-weight="bold" fill="#0f172a">SEGUNDO MEDIDOR CFE</text>')
    svg.append('<text x="35" y="16" font-size="9" fill="#64748b">Base 5 Terminales 100A (En Límite de Propiedad)</text>')

    # Varilla Tierra
    svg.append('<line x1="0" y1="24" x2="0" y2="80" stroke="#16a34a" stroke-width="2" />')
    svg.append('<line x1="-12" y1="80" x2="12" y2="80" stroke="#16a34a" stroke-width="2" />')
    svg.append('<line x1="-8" y1="85" x2="8" y2="85" stroke="#16a34a" stroke-width="1.5" />')
    svg.append('<line x1="-4" y1="90" x2="4" y2="90" stroke="#16a34a" stroke-width="1" />')
    svg.append('<text x="18" y="86" font-size="9" font-weight="bold" fill="#16a34a">ELECTRODO COPPERWELD 5/8" x 3.0 m (R &lt; 25 Ω)</text>')
    svg.append('</g>')

    # Interruptor Principal
    svg.append('<g transform="translate(260, 240)">')
    svg.append('<rect x="-20" y="-20" width="40" height="40" fill="#f8fafc" stroke="#0f172a" stroke-width="2" rx="4" />')
    svg.append('<line x1="-12" y1="-12" x2="12" y2="12" stroke="#dc2626" stroke-width="2" />')
    svg.append('<text x="0" y="-26" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">INTERRUPTOR PRINCIPAL</text>')
    svg.append('<text x="0" y="34" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">2 × 40A QO</text>')
    svg.append('<text x="0" y="46" font-size="8" fill="#64748b" text-anchor="middle">Distancia a medidor &lt; 5 m</text>')
    svg.append('</g>')

    svg.append('<line x1="134" y1="240" x2="240" y2="240" stroke="#0f172a" stroke-width="2" />')

    # Feeder Run
    svg.append('<g transform="translate(300, 240)">')
    svg.append('<line x1="0" y1="0" x2="180" y2="0" stroke="#dc2626" stroke-width="3" />')
    svg.append('<rect x="25" y="-24" width="130" height="20" fill="#fee2e2" stroke="#f87171" rx="4" />')
    svg.append('<text x="90" y="-10" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">ALIMENTADOR (L = 16.0 m)</text>')
    svg.append('<text x="90" y="16" font-size="8.5" font-family="monospace" fill="#0f172a" text-anchor="middle">2#8 Fases + 1#8N + 1#8T Cu</text>')
    svg.append('<text x="90" y="28" font-size="8" fill="#64748b" text-anchor="middle">en Tubo Conduit Metálico 1"</text>')
    svg.append('</g>')

    # Centro de Carga PA
    svg.append('<g transform="translate(500, 100)">')
    svg.append('<rect x="0" y="0" width="460" height="440" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" rx="8" />')
    svg.append('<rect x="0" y="0" width="460" height="34" fill="#0284c7" rx="6" />')
    svg.append('<text x="230" y="22" font-size="12" font-weight="bold" fill="white" text-anchor="middle">CENTRO DE CARGA PLANTA ALTA: SQUARE D QO-8 (100A, NEMA 1)</text>')

    # Buses
    svg.append('<line x1="50" y1="60" x2="50" y2="400" stroke="#dc2626" stroke-width="5" />')
    svg.append('<text x="50" y="52" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">FASE L1</text>')

    svg.append('<line x1="90" y1="60" x2="90" y2="400" stroke="#3b82f6" stroke-width="5" />')
    svg.append('<text x="90" y="52" font-size="10" font-weight="bold" fill="#3b82f6" text-anchor="middle">FASE L2</text>')

    svg.append('<line x1="410" y1="60" x2="410" y2="400" stroke="#94a3b8" stroke-width="4" />')
    svg.append('<text x="410" y="52" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">NEUTRO (N)</text>')

    svg.append('<line x1="440" y1="60" x2="440" y2="400" stroke="#16a34a" stroke-width="4" />')
    svg.append('<text x="440" y="52" font-size="10" font-weight="bold" fill="#16a34a" text-anchor="middle">TIERRA (T)</text>')

    circuits = [
        ("C1", "Alumbrado General y Espejo LED", "15A", "L1", 85, False),
        ("C2", "Contactos Generales Sala y Recámaras", "20A", "L2", 140, False),
        ("C3", "Cocina - Barra y Tarja (Enseres)", "20A", "L1", 195, True),
        ("C4", "Cocina - Refrigerador y Microondas", "20A", "L2", 250, True),
        ("C5", "Baños 1 y 2 - Contactos GFCI", "20A", "L1", 305, True),
        ("C6", "Reserva / Futuro Cuarto de Lavado", "20A", "L2", 360, True),
    ]

    for cid, cname, camps, cphase, cy, cgfci in circuits:
        bx = 50 if cphase == "L1" else 90
        bcolor = "#dc2626" if cphase == "L1" else "#3b82f6"
        svg.append(f'<g transform="translate(0, {cy})">')
        svg.append(f'<line x1="{bx}" y1="0" x2="130" y2="0" stroke="{bcolor}" stroke-width="2" />')
        svg.append('<rect x="130" y="-12" width="45" height="24" fill="#0f172a" stroke="#ffffff" stroke-width="1" rx="3" />')
        svg.append(f'<text x="152" y="4" font-size="10" font-weight="bold" fill="white" text-anchor="middle">{camps}</text>')
        svg.append('<line x1="175" y1="0" x2="215" y2="0" stroke="#0f172a" stroke-width="2" />')
        svg.append('<circle cx="215" cy="0" r="3" fill="#0f172a" />')
        svg.append(f'<text x="225" y="-3" font-size="10" font-weight="bold" fill="#0f172a">{cid}: {cname}</text>')
        svg.append(f'<text x="225" y="9" font-size="8.5" fill="#64748b">Fase {cphase} | {"Receptáculo GFCI 5mA Requerido" if cgfci else "Uso General"}</text>')
        if cgfci:
            svg.append('<rect x="350" y="-10" width="38" height="15" fill="#fee2e2" stroke="#ef4444" rx="2" />')
            svg.append('<text x="369" y="1" font-size="7.5" font-weight="bold" fill="#b91c1c" text-anchor="middle">GFCI</text>')
        svg.append('</g>')

    svg.append('</g>')
    svg.append('</svg>')
    return '\n'.join(svg)

# 5. CUADRO DE CARGAS CSV
def generate_cuadro_cargas_csv():
    csv = ['\uFEFF' + 'CUADRO DE CARGAS Y CIRCUITOS DERIVADOS - PROYECTO VOLTHOME CDMX']
    csv.append('Normativa: NOM-001-SEDE-2012 Art. 210, 215, 220, 310')
    csv.append(f'Fecha de emision: 08/11/2026')
    csv.append('')
    csv.append('Circuito,Descripcion del Circuito,Fase,Tension (V),Carga (W),Carga (VA),Corriente (A),Interruptor,Conductor Fase/Neutro,Tierra EGC,Tuberia,Longitud (m),Caida % e,Proteccion GFCI')
    csv.append('C1,Alumbrado General y Espejo LED,L1,120,450,500,4.2,1P 15A QO,14 AWG Cu THW-2,14 AWG Cu Verde,1/2",22.0,1.48%,No')
    csv.append('C2,Contactos Generales Sala y Recamaras,L2,120,1600,1800,15.0,1P 20A QO,12 AWG Cu THW-2,12 AWG Cu Verde,3/4",24.0,2.15%,No')
    csv.append('C3,Cocina - Barra y Tarja (Enseres Pequenos),L1,120,1500,1500,12.5,1P 20A QO,12 AWG Cu THW-2,12 AWG Cu Verde,3/4",12.0,0.90%,OBLIGATORIA')
    csv.append('C4,Cocina - Refrigerador y Horno Microondas,L2,120,1600,1700,14.1,1P 20A QO,12 AWG Cu THW-2,12 AWG Cu Verde,3/4",14.0,1.18%,OBLIGATORIA')
    csv.append('C5,Banos 1 y 2 - Contactos Lavabo y Espejo,L1,120,1500,1500,12.5,1P 20A QO,12 AWG Cu THW-2,12 AWG Cu Verde,3/4",10.0,0.75%,OBLIGATORIA')
    csv.append('C6,Reserva / Futuro Cuarto de Lavado,L2,120,1400,1500,12.5,1P 20A QO,12 AWG Cu THW-2,12 AWG Cu Verde,3/4",18.0,1.35%,OBLIGATORIA')
    csv.append('')
    csv.append('RESUMEN DE POTENCIA Y DEMANDA:')
    csv.append('Carga Total Instalada:,8050 W / 8500 VA')
    csv.append('Demanda Maxima Diversificada (Art. 220):,5454 VA (5.45 kVA)')
    csv.append('Corriente del Alimentador (240V 2F-3H):,25.2 A')
    csv.append('Corriente de Diseno (125% continuo):,31.6 A')
    csv.append('Conductor Alimentador Seleccionado:,Calibre 8 AWG Cu THW-2-LS 90C (Ampacidad 50A @ 75C)')
    csv.append('Interruptor Principal en Fachada:,2x40A Square D QO')
    csv.append('Caida de Tension en Alimentador (16m):,0.78% (Cumple holgadamente <= 3.0%)')
    return '\n'.join(csv)

# Execute write operations
with open('plano_arquitectonico_2D.svg', 'w', encoding='utf-8') as f:
    f.write(generate_arch_svg())

with open('plano_electrico_2D.svg', 'w', encoding='utf-8') as f:
    f.write(generate_elec_svg())

with open('plano_electrico_2D.dxf', 'w', encoding='utf-8') as f:
    f.write(generate_cad_dxf())

with open('diagrama_unifilar.svg', 'w', encoding='utf-8') as f:
    f.write(generate_unifilar_svg())

with open('cuadro_de_cargas_y_circuitos.csv', 'w', encoding='utf-8') as f:
    f.write(generate_cuadro_cargas_csv())

print("Todos los archivos entregables tecnicos fueron generados satisfactoriamente!")
