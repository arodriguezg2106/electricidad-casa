@echo off
title VoltHome CDMX - Servidor de Aplicacion Local
color 0B
echo =========================================================================
echo   VoltHome CDMX - Sistema de Modelado, Calculo y Presupuesto Electrico
echo   Normativa: NOM-001-SEDE-2012 / CFE Baja Tension Residencial
echo =========================================================================
echo.

if not exist "electro-modeler\dist\index.html" (
    echo [INFO] Primera ejecucion detectada: construyendo paquete de produccion...
    cd electro-modeler
    call npm install
    call npm run build
    cd ..
)

echo Iniciando servidor local en el puerto 5173...
echo La aplicacion web se abrira automaticamente en tu navegador web.
echo.
echo Presiona Ctrl+C en esta ventana cuando desees cerrar la aplicacion.
echo.
start http://localhost:5173
python -m http.server 5173 --directory electro-modeler/dist
if errorlevel 1 (
    echo Servidor Python no disponible, intentando con npm run dev...
    cd electro-modeler
    npm run dev
)
pause
