@echo off
chcp 65001 >nul
title Login LinkedIn...

echo.
echo ====================================
echo   LinkedIn Bot - Login
echo ====================================
echo.
echo 🌐 Abrindo o Chrome...
echo.
echo INSTRUÇÕES:
echo  1. Faça login no LinkedIn normalmente
echo  2. Quando chegar no feed (página inicial), aguarde
echo  3. A janela vai fechar sozinha e salvar sua sessão
echo.
echo ⚠️  Não feche a janela do Chrome manualmente!
echo.
pause

node setup-session.js

echo.
if exist session.json (
    echo ✅ Login salvo com sucesso!
    echo.
    echo Próximo passo:
    echo  1. Vá no dashboard: casacriative.com.br/prospeccao
    echo  2. Adicione prospects e gere as mensagens
    echo  3. Clique em "Exportar para Bot" e salve o arquivo aqui nesta pasta
    echo  4. Depois clique em 2-ENVIAR-MENSAGENS.bat
) else (
    echo ❌ Algo deu errado. Tente novamente.
)
echo.
pause
