@echo off
chcp 65001 >nul
title Enviando mensagens LinkedIn...

echo.
echo ====================================
echo   LinkedIn Bot - Enviando
echo ====================================
echo.

if not exist session.json (
    echo ❌ Sessão não encontrada.
    echo    Execute primeiro: 1-FAZER-LOGIN.bat
    echo.
    pause
    exit
)

if not exist queue.json (
    echo ❌ queue.json não encontrado.
    echo.
    echo INSTRUÇÕES:
    echo  1. Vá em casacriative.com.br/prospeccao
    echo  2. Adicione prospects e gere as mensagens
    echo  3. Clique no botão "Exportar para Bot"
    echo  4. Salve o arquivo queue.json NESTA pasta
    echo  5. Execute este arquivo novamente
    echo.
    pause
    exit
)

echo ✅ Tudo pronto. Iniciando envio...
echo.
echo O Chrome vai abrir e enviar as mensagens automaticamente.
echo NÃO feche o Chrome durante o processo.
echo.
echo Para parar: feche esta janela preta.
echo.
pause

node send.js

echo.
echo ====================================
echo   ✅ Envio concluído!
echo ====================================
echo.
echo O arquivo queue-result.json foi criado.
echo.
echo Para atualizar o dashboard:
echo  1. Vá em casacriative.com.br/prospeccao
echo  2. Clique em "Importar Resultado"
echo  3. Selecione o arquivo queue-result.json desta pasta
echo.
pause
