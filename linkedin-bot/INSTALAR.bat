@echo off
chcp 65001 >nul
title Instalando LinkedIn Bot...

echo.
echo ====================================
echo   LinkedIn Bot - Instalação
echo ====================================
echo.

:: Verifica se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado.
    echo.
    echo Baixe e instale em: https://nodejs.org
    echo Escolha a versão "LTS" e instale normalmente.
    echo Depois feche esta janela e clique de novo em INSTALAR.bat
    echo.
    pause
    start https://nodejs.org
    exit
)

echo ✅ Node.js encontrado.
echo.
echo 📦 Instalando dependências...
call npm install
echo.
echo 🌐 Instalando navegador Chrome automático...
call npx playwright install chromium
echo.
echo ====================================
echo   ✅ Instalação concluída!
echo ====================================
echo.
echo Próximo passo: clique duas vezes em
echo   👉 1-FAZER-LOGIN.bat
echo.
pause
