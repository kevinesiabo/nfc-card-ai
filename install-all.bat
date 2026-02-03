@echo off
REM Script d'installation complète pour NFC Card AI (Windows Batch)
REM Ce script installe toutes les dépendances et configure l'environnement

echo.
echo 🚀 Installation complète de NFC Card AI
echo.

REM 1. Installation des dépendances npm
echo 📦 Étape 1/4 : Installation des dépendances npm...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation npm
    exit /b 1
)
echo ✅ Dépendances npm installées
echo.

REM 2. Génération du client Prisma
echo 🗄️  Étape 2/4 : Génération du client Prisma...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Erreur lors de la génération Prisma
    exit /b 1
)
echo ✅ Client Prisma généré
echo.

REM 3. Vérification des variables d'environnement
echo 🔐 Étape 3/4 : Vérification des variables d'environnement...
if exist .env.local (
    echo ✅ Fichier .env.local trouvé
    findstr /C:"OPENAI_API_KEY" .env.local >nul
    if errorlevel 1 (
        echo ⚠️  Clé API OpenAI non trouvée dans .env.local
    ) else (
        echo ✅ Clé API OpenAI configurée
    )
) else (
    echo ⚠️  Fichier .env.local non trouvé
    echo    Créez un fichier .env.local avec OPENAI_API_KEY=votre_cle
)
echo.

REM 4. Vérification de la base de données
echo 💾 Étape 4/4 : Vérification de la base de données...
if exist "prisma\prisma\dev.db" (
    echo ✅ Base de données trouvée
) else (
    echo ⚠️  Base de données non trouvée, exécutez: npm run db:push
)
echo.

REM Résumé
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Installation terminée !
echo.
echo 📋 Prochaines étapes:
echo    1. Vérifiez que .env.local contient OPENAI_API_KEY
echo    2. Si nécessaire, exécutez: npm run db:push
echo    3. Lancez l'application: npm run dev
echo    4. Ouvrez http://localhost:3000 dans votre navigateur
echo.
echo 🎉 Prêt à démarrer !
echo.
pause

