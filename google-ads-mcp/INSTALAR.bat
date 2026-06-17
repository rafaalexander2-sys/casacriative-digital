@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   NOWA Google Ads MCP -- Instalacao
echo ============================================
echo.

set MCP_DIR=%~dp0
set MCP_DIR=%MCP_DIR:~0,-1%
set TS_PATH=%MCP_DIR%\src\index.ts

echo Pasta: %MCP_DIR%
echo.

:: Verifica se .env existe
if not exist "%MCP_DIR%\.env" (
    echo ERRO: Ficheiro .env nao encontrado!
    echo Coloca o ficheiro .env dentro desta pasta e corre de novo.
    echo.
    pause
    exit /b 1
)
echo OK - .env encontrado
echo.

:: Instala dependencias npm
echo Instalando dependencias npm...
cd /d "%MCP_DIR%"
call npm install --silent
if errorlevel 1 (
    echo ERRO: npm install falhou.
    echo Instala o Node.js em: https://nodejs.org
    pause
    exit /b 1
)
echo OK - dependencias instaladas
echo.

:: Le as variaveis do .env
echo Lendo credenciais do .env...
for /f "usebackq tokens=1,* delims==" %%A in ("%MCP_DIR%\.env") do (
    if "%%A"=="GOOGLE_ADS_CLIENT_ID"           set CLIENT_ID=%%B
    if "%%A"=="GOOGLE_ADS_CLIENT_SECRET"       set CLIENT_SECRET=%%B
    if "%%A"=="GOOGLE_ADS_DEVELOPER_TOKEN"     set DEV_TOKEN=%%B
    if "%%A"=="GOOGLE_ADS_REFRESH_TOKEN"       set REFRESH_TOKEN=%%B
    if "%%A"=="GOOGLE_ADS_MCC_ID"              set MCC_ID=%%B
    if "%%A"=="GOOGLE_ADS_DEFAULT_CUSTOMER_ID" set DEFAULT_CID=%%B
)

:: Configura Claude Desktop
set CONFIG_DIR=%APPDATA%\Claude
set CONFIG_FILE=%CONFIG_DIR%\claude_desktop_config.json
if not exist "%CONFIG_DIR%" mkdir "%CONFIG_DIR%"

echo Configurando Claude Desktop...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$ts = '%TS_PATH%'.Replace('\','\\'); " ^
"$cid = '%CLIENT_ID%'; $cs = '%CLIENT_SECRET%'; $dt = '%DEV_TOKEN%'; $rt = '%REFRESH_TOKEN%'; $mcc = '%MCC_ID%'; $def = '%DEFAULT_CID%'; " ^
"$json = '{\"mcpServers\":{\"google-ads\":{\"command\":\"npx\",\"args\":[\"tsx\",\"' + $ts + '\"],\"env\":{\"GOOGLE_ADS_CLIENT_ID\":\"' + $cid + '\",\"GOOGLE_ADS_CLIENT_SECRET\":\"' + $cs + '\",\"GOOGLE_ADS_DEVELOPER_TOKEN\":\"' + $dt + '\",\"GOOGLE_ADS_REFRESH_TOKEN\":\"' + $rt + '\",\"GOOGLE_ADS_MCC_ID\":\"' + $mcc + '\",\"GOOGLE_ADS_DEFAULT_CUSTOMER_ID\":\"' + $def + '\"}}}}'; " ^
"$json | Set-Content '%CONFIG_FILE%' -Encoding UTF8"

echo OK - Claude Desktop configurado
echo.
echo ============================================
echo   CONCLUIDO!
echo ============================================
echo.
echo Proximos passos:
echo  1. Fecha e abre o Claude Desktop
echo  2. Nova conversa
echo  3. Escreve: lista as contas do google ads
echo.
pause
