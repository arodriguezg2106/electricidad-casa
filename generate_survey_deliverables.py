# -*- coding: utf-8 -*-
"""
Generador de Entregables de Levantamiento Físico y Propuesta Eléctrica
Proyecto: Instalación Eléctrica Independiente CDMX
Basado en los Croquis del Levantamiento en Sitio (15 Apagadores, 18 Contactos, 7 Puertas, 2 Ventanas, 3 Clósets)
"""

import json
import os

# Cargar elementos del levantamiento desde surveyData
# Los definimos directamente aquí para asegurar ejecución autónoma sin dependencias externas
SURVEY_ITEMS = [
    # 15 Apagadores (A1 a A15)
    {"code": "A1", "type": "switch", "room": "Baño 1", "sketch": "Parte (1)", "x": 0.60, "y": 1.80, "side": "bottom", "label": "Apagador A1 (Baño 1 junto a P1)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A2", "type": "switch", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 1.20, "y": 1.80, "side": "bottom", "label": "Apagador A2 (Cuarto Principal junto a P1)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A3", "type": "switch", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 4.80, "y": 1.80, "side": "bottom", "label": "Apagador A3 (Entrada P2)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A4", "type": "switch", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 5.10, "y": 3.20, "side": "right", "label": "Apagador A4 (Pasillo Oriente)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A5", "type": "switch", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 4.20, "y": 3.60, "side": "bottom", "label": "Apagador A5 (Muro Intermedio)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A6", "type": "switch", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 2.10, "y": 3.80, "side": "left", "label": "Apagador A6 (Sobre Caja)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A7", "type": "switch", "room": "Baño 2", "sketch": "Parte (1)", "x": 1.80, "y": 5.80, "side": "right", "label": "Apagador A7 (Baño 2 junto a P3)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A8", "type": "switch", "room": "Recámara Sec 1", "sketch": "Cuartos secundarios", "x": 6.30, "y": 1.80, "side": "left", "label": "Apagador A8 (Entrada P4)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A9", "type": "switch", "room": "Recámara Sec 1", "sketch": "Cuartos secundarios", "x": 7.20, "y": 3.40, "side": "bottom", "label": "Apagador A9 (Junto a P5 / Closet 1)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A10", "type": "switch", "room": "Recámara Sec 1", "sketch": "Cuartos secundarios", "x": 8.80, "y": 2.40, "side": "right", "label": "Apagador A10 (Cabecera Rec 1)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A11", "type": "switch", "room": "Recámara Sec 2", "sketch": "Cuartos secundarios", "x": 6.80, "y": 3.80, "side": "top", "label": "Apagador A11 (Rec 2 junto a P5)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A12", "type": "switch", "room": "Escalera Arriba", "sketch": "Arriba", "x": 6.80, "y": 0.40, "side": "top", "label": "Apagador A12 (Desembarque Escalera)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A13", "type": "switch", "room": "Escalera Arriba", "sketch": "Arriba", "x": 7.60, "y": 0.60, "side": "right", "label": "Apagador A13 (Salida Azotea P6)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A14", "type": "switch", "room": "Cuarto Azotea", "sketch": "Arriba", "x": 8.80, "y": 0.50, "side": "left", "label": "Apagador A14 (Cuarto Azotea P7)", "circuit": "C1", "status": "CONFIRMADA"},
    {"code": "A15", "type": "switch", "room": "Cubo Escalera N1", "sketch": "Cuartos secundarios", "x": 6.80, "y": 0.40, "side": "right", "label": "Apagador A15 (Descanso Escalera)", "circuit": "C1", "status": "CONFIRMADA"},

    # 18 Contactos (C1 a C18)
    {"code": "C1", "type": "outlet", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 1.60, "y": 1.10, "label": "C1 (Cuarto Principal - Closet 3)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C2", "type": "outlet", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 2.80, "y": 0.15, "label": "C2 (Cuarto Principal - Muro Norte)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C3", "type": "outlet", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 4.40, "y": 0.15, "label": "C3 (Cuarto Principal - Muro Norte)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C4", "type": "outlet", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 3.40, "y": 2.15, "label": "C4 (Pasillo Norte)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C5", "type": "outlet", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 3.00, "y": 2.30, "label": "C5 (Pasillo Distribuidor)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C6", "type": "outlet", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 2.80, "y": 3.35, "label": "C6 (Muro Divisorio Central)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C7", "type": "outlet", "room": "Baño 2", "sketch": "Parte (1)", "x": 1.95, "y": 4.80, "label": "C7 (Baño 2 - Lavabo GFCI)", "circuit": "C5", "isGfci": True, "status": "CONFIRMADA"},
    {"code": "C8", "type": "outlet", "room": "Sala Estancia", "sketch": "Parte (1)", "x": 2.60, "y": 6.85, "label": "C8 (Sala Sur - Extremo Izq)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C9", "type": "outlet", "room": "Sala Estancia", "sketch": "Parte (1)", "x": 3.40, "y": 6.85, "label": "C9 (Sala Sur - Centro Multimedia)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C10", "type": "outlet", "room": "Sala Estancia", "sketch": "Parte (1)", "x": 4.60, "y": 6.85, "label": "C10 (Sala Sur - Extremo Der)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C11", "type": "outlet", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 1.85, "y": 4.40, "label": "C11 (Pasillo frente a Baño 2)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C12", "type": "outlet", "room": "Recámara Sec 1", "sketch": "Cuartos secundarios", "x": 7.60, "y": 1.15, "label": "C12 (Recámara 1 - Muro Norte)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C13", "type": "outlet", "room": "Recámara Sec 2", "sketch": "Cuartos secundarios", "x": 8.85, "y": 4.90, "label": "C13 (Recámara 2 - Muro Oriente)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C14", "type": "outlet", "room": "Recámara Sec 2", "sketch": "Cuartos secundarios", "x": 8.20, "y": 5.85, "label": "C14 (Recámara 2 - Sur Derecha)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C15", "type": "outlet", "room": "Recámara Sec 2", "sketch": "Cuartos secundarios", "x": 6.80, "y": 5.85, "label": "C15 (Recámara 2 - Sur Izquierda)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C16", "type": "outlet", "room": "Escalera Arriba", "sketch": "Arriba", "x": 6.90, "y": 1.85, "label": "C16 (Descansillo Superior)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C17", "type": "outlet", "room": "Escalera Arriba", "sketch": "Arriba", "x": 7.65, "y": 1.40, "label": "C17 (Junto a Puerta P6)", "circuit": "C2", "isGfci": False, "status": "CONFIRMADA"},
    {"code": "C18", "type": "outlet", "room": "Cuarto Azotea", "sketch": "Arriba", "x": 9.30, "y": 0.15, "label": "C18 (Cuarto Azotea - Lavado GFCI)", "circuit": "C6", "isGfci": True, "status": "CONFIRMADA"},

    # 7 Puertas (P1 a P7)
    {"code": "P1", "type": "door", "room": "Baño 1", "sketch": "Parte (1)", "x": 0.70, "y": 2.00, "w": 0.70, "h": 2.00, "dim": "0.70 × 2.00 m", "desc": "Puerta de baño (Suite Principal)", "status": "CONFIRMADA"},
    {"code": "P2", "type": "door", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 5.00, "y": 2.00, "w": 0.95, "h": 2.21, "dim": "0.95 × 2.21 m", "desc": "Puerta principal de suite", "status": "CONFIRMADA"},
    {"code": "P3", "type": "door", "room": "Baño 2", "sketch": "Parte (1)", "x": 2.10, "y": 5.10, "w": 0.70, "h": 1.93, "dim": "0.70 × 1.93 m", "desc": "Puerta de baño secundario (dintel bajo)", "status": "CONFIRMADA"},
    {"code": "P4", "type": "door", "room": "Recámara Sec 1", "sketch": "Cuartos secundarios", "x": 6.20, "y": 2.10, "w": 0.94, "h": 2.21, "dim": "0.94 × 2.21 m", "desc": "Acceso a recámaras desde descanso", "status": "CONFIRMADA"},
    {"code": "P5", "type": "door", "room": "Recámara Sec 2", "sketch": "Cuartos secundarios", "x": 7.60, "y": 3.60, "w": 0.90, "h": 2.21, "dim": "0.90 × 2.21 m", "desc": "Comunicación interior Rec 1 y Rec 2", "status": "CONFIRMADA"},
    {"code": "P6", "type": "door", "room": "Escalera Arriba", "sketch": "Arriba", "x": 7.70, "y": 0.90, "w": 0.865, "h": 2.15, "dim": "0.865 × 2.15 m", "desc": "Salida de escalera a azotea/terraza", "status": "CONFIRMADA"},
    {"code": "P7", "type": "door", "room": "Cuarto Azotea", "sketch": "Arriba", "x": 8.50, "y": 0.90, "w": 0.90, "h": 2.33, "dim": "0.90 × 2.33 m", "desc": "Puerta exterior alta de cuarto azotea", "status": "CONFIRMADA"},

    # 2 Ventanas (V1 y V2)
    {"code": "V1", "type": "window", "room": "Baño 1", "sketch": "Parte (1)", "x": 0.00, "y": 0.50, "w": 0.34, "h": 0.60, "dim": "0.60 × 0.34 m", "desc": "Ventana alta de ventilación Baño 1", "status": "CONFIRMADA"},
    {"code": "V2", "type": "window", "room": "Baño 1", "sketch": "Parte (1)", "x": 0.00, "y": 1.20, "w": 0.31, "h": 0.63, "dim": "0.63 × 0.31 m", "desc": "Ventana baja de ventilación Baño 1", "status": "CONFIRMADA"},

    # 3 Clósets (Closet 1 a 3)
    {"code": "Closet 1", "type": "closet", "room": "Recámara Sec 1", "sketch": "Cuartos secundarios", "x": 7.40, "y": 3.40, "w": 1.74, "h": 2.51, "depth": 0.60, "dim": "1.74 × 2.51 m", "desc": "Clóset empotrado divisorio Rec 1", "status": "CONFIRMADA"},
    {"code": "Closet 2", "type": "closet", "room": "Recámara Sec 2", "sketch": "Cuartos secundarios", "x": 7.40, "y": 3.80, "w": 1.73, "h": 2.50, "depth": 0.60, "dim": "1.73 × 2.50 m", "desc": "Clóset empotrado divisorio Rec 2", "status": "CONFIRMADA"},
    {"code": "Closet 3", "type": "closet", "room": "Cuarto Principal", "sketch": "Parte (1)", "x": 1.40, "y": 0.30, "w": 2.21, "h": 2.50, "depth": 0.60, "dim": "2.21 × 2.50 m", "desc": "Clóset amplio de suite principal", "status": "CONFIRMADA"},

    # 1 Registro en Muro "Caja"
    {"code": "Caja", "type": "box", "room": "Pasillo Central", "sketch": "Parte (1)", "x": 2.10, "y": 4.00, "label": "Caja (Registro Físico de Muro)", "status": "CONFIRMADA"}
]

ROOMS = [
    {"id": "room_cuarto_principal", "name": "Cuarto Principal", "x": 0.0, "y": 0.0, "w": 5.2, "h": 3.6, "color": "#e0e7ff", "level": "Nivel 1"},
    {"id": "room_bano1", "name": "Baño 1 (Suite)", "x": -2.2, "y": 0.0, "w": 2.2, "h": 2.0, "color": "#f1f5f9", "level": "Nivel 1"},
    {"id": "room_pasillo", "name": "Pasillo y Caja", "x": 0.0, "y": 3.6, "w": 5.2, "h": 1.8, "color": "#f8fafc", "level": "Nivel 1"},
    {"id": "room_bano2", "name": "Baño 2 (Secundario)", "x": -2.2, "y": 3.6, "w": 2.2, "h": 1.8, "color": "#f1f5f9", "level": "Nivel 1"},
    {"id": "room_sala_estancia", "name": "Sala y Estancia Sur", "x": 0.0, "y": 5.4, "w": 5.2, "h": 3.6, "color": "#e0f2fe", "level": "Nivel 1"},
    {"id": "room_cocina", "name": "Cocina", "x": 5.2, "y": 5.4, "w": 3.8, "h": 3.6, "color": "#fef3c7", "level": "Nivel 1"},
    {"id": "room_escalera", "name": "Cubo Escaleras", "x": 5.2, "y": 0.0, "w": 3.8, "h": 2.2, "color": "#ede9fe", "level": "Nivel 1"},
    {"id": "room_recamara_sec1", "name": "Recámara Sec 1", "x": 5.2, "y": 2.2, "w": 3.8, "h": 3.2, "color": "#e0e7ff", "level": "Nivel 1"},
    {"id": "room_recamara_sec2", "name": "Recámara Sec 2", "x": 9.0, "y": 2.2, "w": 3.6, "h": 3.2, "color": "#e0e7ff", "level": "Nivel 1"},
    {"id": "room_arriba_descanso", "name": "Llegada Escalera Arriba", "x": 5.2, "y": 10.0, "w": 3.8, "h": 2.2, "color": "#ede9fe", "level": "Arriba"},
    {"id": "room_arriba_cuarto", "name": "Cuarto Azotea", "x": 9.2, "y": 10.0, "w": 3.4, "h": 2.6, "color": "#e2e8f0", "level": "Arriba"},
]

SCALE = 65
ORIGIN_X = 220
ORIGIN_Y = 60

def generate_svg_survey():
    svg = ['<?xml version="1.0" encoding="UTF-8"?>']
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="980" viewBox="0 0 1280 980">')
    svg.append('<style>')
    svg.append('text { font-family: "Segoe UI", Arial, sans-serif; }')
    svg.append('.wall { fill: none; stroke: #1e293b; stroke-width: 3.5; }')
    svg.append('.grid { stroke: #f1f5f9; stroke-width: 1; }')
    svg.append('.dim { fill: #475569; font-size: 11px; font-family: monospace; }')
    svg.append('</style>')

    # Defs
    svg.append('<defs>')
    svg.append('<pattern id="gridMinor" width="32.5" height="32.5" patternUnits="userSpaceOnUse"><path d="M 32.5 0 L 0 0 0 32.5" fill="none" stroke="#f1f5f9" stroke-width="1"/></pattern>')
    svg.append('<pattern id="gridMajor" width="65" height="65" patternUnits="userSpaceOnUse"><rect width="65" height="65" fill="url(#gridMinor)"/><path d="M 65 0 L 0 0 0 65" fill="none" stroke="#e2e8f0" stroke-width="1.2"/></pattern>')
    svg.append('</defs>')

    svg.append('<rect width="100%" height="100%" fill="#ffffff"/>')
    svg.append('<rect width="100%" height="100%" fill="url(#gridMajor)"/>')

    # Titulo de Encabezado
    svg.append('<g transform="translate(40, 40)">')
    svg.append('<rect width="1200" height="65" rx="8" fill="#0f172a"/>')
    svg.append('<text x="25" y="28" fill="#38bdf8" font-size="13" font-weight="700">LEVANTAMIENTO ARQUITECTÓNICO Y ELÉCTRICO REAL (INSPECCIÓN EN SITIO)</text>')
    svg.append('<text x="25" y="50" fill="#ffffff" font-size="18" font-weight="800">PLANO DE CROQUIS DE OBRA: 18 CONTACTOS • 15 APAGADORES • 7 PUERTAS • 2 VENTANAS • 3 CLÓSETS</text>')
    svg.append('<text x="1175" y="40" fill="#94a3b8" font-size="12" text-anchor="end" font-weight="600">VoltHome CDMX • Planta Nivel 1 &amp; Nivel "Arriba"</text>')
    svg.append('</g>')

    # Main Drawing Group
    svg.append(f'<g transform="translate({ORIGIN_X}, {ORIGIN_Y + 70})">')

    # Draw Rooms
    for r in ROOMS:
        rx = r['x'] * SCALE
        ry = r['y'] * SCALE
        rw = r['w'] * SCALE
        rh = r['h'] * SCALE
        r_name = r['name']
        r_w = r['w']
        r_h = r['h']
        r_area = round(r_w * r_h, 1)
        r_color = r['color']
        r_level = r['level']

        # Fill
        svg.append(f'<rect x="{rx}" y="{ry}" width="{rw}" height="{rh}" fill="{r_color}" fill-opacity="0.45" stroke="#334155" stroke-width="2.5" stroke-dasharray="6,4"/>')
        # Labels
        svg.append(f'<text x="{rx + 10}" y="{ry + 20}" font-size="12" font-weight="700" fill="#0f172a">{r_name}</text>')
        svg.append(f'<text x="{rx + 10}" y="{ry + 35}" font-size="10" font-weight="500" fill="#64748b">{r_w}m × {r_h}m ({r_area} m²)</text>')

        if r_level == 'Arriba':
            svg.append(f'<rect x="{rx + rw - 85}" y="{ry + 8}" width="78" height="16" rx="3" fill="#e0e7ff"/>')
            svg.append(f'<text x="{rx + rw - 46}" y="{ry + 20}" font-size="8" font-weight="700" fill="#4338ca" text-anchor="middle">NIVEL ARRIBA</text>')

    # Draw Survey Items
    for item in SURVEY_ITEMS:
        ix = item['x'] * SCALE
        iy = item['y'] * SCALE
        code = item['code']
        itype = item['type']

        # Switch
        if itype == 'switch':
            # Directional triangle pointer
            side = item.get('side', 'right')
            if side == 'bottom': tri = "0,9 -5,-2 5,-2"
            elif side == 'top': tri = "0,-9 -5,2 5,2"
            elif side == 'left': tri = "-9,0 2,-5 2,5"
            else: tri = "9,0 -2,-5 -2,5"

            svg.append(f'<g transform="translate({ix}, {iy})">')
            svg.append(f'<polygon points="{tri}" fill="#ea580c"/>')
            svg.append('<circle r="11" fill="#ea580c" stroke="#ffffff" stroke-width="1.8"/>')
            svg.append(f'<text x="0" y="4" font-size="10" font-weight="800" fill="#ffffff" text-anchor="middle">{code}</text>')
            svg.append('</g>')

        # Outlet
        elif itype == 'outlet':
            svg.append(f'<g transform="translate({ix}, {iy})">')
            svg.append('<circle r="11" fill="#0284c7" stroke="#ffffff" stroke-width="1.8"/>')
            svg.append(f'<text x="0" y="4" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">{code}</text>')
            if item.get('isGfci'):
                svg.append('<rect x="-14" y="-19" width="28" height="13" rx="3" fill="#dc2626"/>')
                svg.append('<text x="0" y="-10" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle">GFCI</text>')
            svg.append('</g>')

        # Door
        elif itype == 'door':
            dw = item['w'] * SCALE
            dim = item['dim']
            svg.append(f'<g transform="translate({ix}, {iy})">')
            svg.append(f'<circle r="{dw}" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="3,3"/>')
            svg.append(f'<line x1="0" y1="0" x2="{dw}" y2="0" stroke="#1d4ed8" stroke-width="3"/>')
            svg.append('<rect x="-14" y="-10" width="28" height="20" rx="4" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>')
            svg.append(f'<text x="0" y="4" font-size="10" font-weight="800" fill="#ffffff" text-anchor="middle">{code}</text>')
            svg.append(f'<text x="0" y="22" font-size="9" font-weight="700" fill="#1e40af" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">{dim}</text>')
            svg.append('</g>')

        # Window
        elif itype == 'window':
            wh = item['h'] * SCALE
            dim = item['dim']
            svg.append(f'<g transform="translate({ix}, {iy})">')
            svg.append(f'<rect x="-8" y="{-wh/2}" width="16" height="{wh}" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>')
            svg.append(f'<line x1="0" y1="{-wh/2}" x2="0" y2="{wh/2}" stroke="#0284c7" stroke-width="1.5"/>')
            svg.append('<rect x="-12" y="-9" width="24" height="18" rx="3" fill="#0284c7" stroke="#ffffff" stroke-width="1"/>')
            svg.append(f'<text x="0" y="3" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">{code}</text>')
            svg.append(f'<text x="24" y="3" font-size="8" font-weight="700" fill="#0369a1" text-anchor="start" stroke="#ffffff" stroke-width="3" paint-order="stroke">{dim}</text>')
            svg.append('</g>')

        # Closet
        elif itype == 'closet':
            cw = item['w'] * SCALE
            cd = item.get('depth', 0.6) * SCALE
            dim = item['dim']
            svg.append(f'<g transform="translate({ix}, {iy})">')
            svg.append(f'<rect x="0" y="0" width="{cw}" height="{cd}" fill="#fef3c7" stroke="#d97706" stroke-width="2" stroke-dasharray="4,2"/>')
            svg.append(f'<line x1="{cw/2}" y1="0" x2="{cw/2}" y2="{cd}" stroke="#d97706" stroke-width="1.5"/>')
            svg.append('<rect x="10" y="8" width="55" height="18" rx="4" fill="#d97706"/>')
            svg.append(f'<text x="37" y="20" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">{code}</text>')
            svg.append(f'<text x="{cw/2}" y="-6" font-size="9" font-weight="700" fill="#92400e" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">{dim}</text>')
            svg.append('</g>')

        # Box
        elif itype == 'box':
            svg.append(f'<g transform="translate({ix}, {iy})">')
            svg.append('<rect x="-12" y="-12" width="24" height="24" rx="3" fill="#475569" stroke="#38bdf8" stroke-width="2"/>')
            svg.append('<line x1="-12" y1="-12" x2="12" y2="12" stroke="#38bdf8" stroke-width="1.5"/>')
            svg.append('<text x="0" y="22" font-size="9" font-weight="800" fill="#0f172a" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">CAJA REGISTRO</text>')
            svg.append('</g>')

    svg.append('</g>') # End transform

    # Bottom Cuadro de Simbologia y Datos
    svg.append('<g transform="translate(40, 840)">')
    svg.append('<rect width="1200" height="95" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>')
    
    # Simbologia
    svg.append('<g transform="translate(20, 20)">')
    svg.append('<circle cx="10" cy="10" r="9" fill="#ea580c"/>')
    svg.append('<text x="25" y="14" font-size="11" font-weight="700" fill="#0f172a">Apagador Físico (A1 a A15)</text>')
    svg.append('<circle cx="210" cy="10" r="9" fill="#0284c7"/>')
    svg.append('<text x="225" y="14" font-size="11" font-weight="700" fill="#0f172a">Contacto Físico (C1 a C18)</text>')
    svg.append('<rect x="410" y="2" width="22" height="15" rx="3" fill="#2563eb"/>')
    svg.append('<text x="440" y="14" font-size="11" font-weight="700" fill="#0f172a">Puerta Acotada (P1 a P7)</text>')
    svg.append('<rect x="630" y="2" width="22" height="15" rx="3" fill="#d97706"/>')
    svg.append('<text x="660" y="14" font-size="11" font-weight="700" fill="#0f172a">Clóset con Medidas (1 a 3)</text>')
    svg.append('<rect x="850" y="2" width="16" height="16" rx="2" fill="#475569" stroke="#38bdf8"/>')
    svg.append('<text x="875" y="14" font-size="11" font-weight="700" fill="#0f172a">Registro de Muro "Caja"</text>')
    svg.append('</g>')

    # Escala y Notas
    svg.append('<g transform="translate(20, 55)">')
    svg.append('<text x="0" y="15" font-size="10" fill="#64748b"><strong>Escala Gráfica:</strong> 1 metro = 65 px | Muros provisionales sujetos a rectificación milimétrica con flexómetro en obra.</text>')
    svg.append('<text x="0" y="30" font-size="10" fill="#dc2626"><strong>NOTA NORMATIVA NOM-001-SEDE-2012:</strong> Los identificadores de levantamiento no son circuitos. Contactos en baños y áreas de servicio requieren protección GFCI obligatoria.</text>')
    svg.append('</g>')

    svg.append('</g>') # End Cuadro
    svg.append('</svg>')
    return '\n'.join(svg)

# Generar archivo SVG de levantamiento
svg_content = generate_svg_survey()
with open('plano_levantamiento_croquis_2D.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
print("Generado: plano_levantamiento_croquis_2D.svg")

# Generar archivo DXF de levantamiento
def generate_dxf_survey():
    dxf = []
    dxf.append('0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$INSUNITS\n70\n6\n0\nENDSEC\n')
    dxf.append('0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n6\n')
    layers = [
        ('ARQUITECTURA_MUROS', 7),
        ('SURVEY_APAGADORES', 2),
        ('SURVEY_CONTACTOS', 4),
        ('SURVEY_PUERTAS', 5),
        ('SURVEY_VENTANAS', 3),
        ('SURVEY_CLOSETS', 6)
    ]
    for name, col in layers:
        dxf.append(f'0\nLAYER\n2\n{name}\n70\n0\n62\n{col}\n6\nCONTINUOUS\n')
    dxf.append('0\nENDTAB\n0\nENDSEC\n')
    dxf.append('0\nSECTION\n2\nENTITIES\n')

    for r in ROOMS:
        x1 = r['x']
        y1 = -r['y']
        x2 = r['x'] + r['w']
        y2 = -(r['y'] + r['h'])
        lines = [(x1,y1,x2,y1), (x2,y1,x2,y2), (x2,y2,x1,y2), (x1,y2,x1,y1)]
        for sx, sy, ex, ey in lines:
            dxf.append('0\nLINE\n8\nARQUITECTURA_MUROS\n')
            dxf.append(f'10\n{sx:.3f}\n20\n{sy:.3f}\n30\n0.0\n11\n{ex:.3f}\n21\n{ey:.3f}\n31\n0.0\n')
        rname = r["name"]
        dxf.append('0\nTEXT\n8\nARQUITECTURA_MUROS\n')
        dxf.append(f'10\n{(x1+0.2):.3f}\n20\n{(y1-0.4):.3f}\n30\n0.0\n40\n0.22\n1\n{rname}\n')

    for s in SURVEY_ITEMS:
        cx = s['x']
        cy = -s['y']
        scode = s['code']
        stext = s.get('dim', s.get('label', ''))
        layer = 'SURVEY_APAGADORES' if s['type'] == 'switch' else \
                'SURVEY_CONTACTOS' if s['type'] == 'outlet' else \
                'SURVEY_PUERTAS' if s['type'] == 'door' else \
                'SURVEY_VENTANAS' if s['type'] == 'window' else \
                'SURVEY_CLOSETS' if s['type'] == 'closet' else 'ARQUITECTURA_MUROS'
        dxf.append(f'0\nPOINT\n8\n{layer}\n10\n{cx:.3f}\n20\n{cy:.3f}\n30\n0.0\n')
        dxf.append(f'0\nTEXT\n8\n{layer}\n10\n{(cx+0.15):.3f}\n20\n{cy:.3f}\n30\n0.0\n40\n0.18\n1\n[{scode}] {stext}\n')

    dxf.append('0\nENDSEC\n0\nEOF\n')
    return ''.join(dxf)

with open('plano_levantamiento_croquis_2D.dxf', 'w', encoding='utf-8') as f:
    f.write(generate_dxf_survey())
print("Generado: plano_levantamiento_croquis_2D.dxf")
