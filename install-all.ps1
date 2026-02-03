# Script d'installation complète pour NFC Card AI
# Ce script installe toutes les dépendances et configure l'environnement

Write-Host "🚀 Installation complète de NFC Card AI" -ForegroundColor Cyan
Write-Host ""

# 1. Installation des dépendances npm
Write-Host "📦 Étape 1/4 : Installation des dépendances npm..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation npm" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances npm installées" -ForegroundColor Green
Write-Host ""

# 2. Génération du client Prisma
Write-Host "🗄️  Étape 2/4 : Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération Prisma" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Client Prisma généré" -ForegroundColor Green
Write-Host ""

# 3. Vérification des variables d'environnement
Write-Host "🔐 Étape 3/4 : Vérification des variables d'environnement..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Write-Host "✅ Fichier .env.local trouvé" -ForegroundColor Green
    $hasApiKey = Select-String -Path .env.local -Pattern "OPENAI_API_KEY" -Quiet
    if ($hasApiKey) {
        Write-Host "✅ Clé API OpenAI configurée" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Clé API OpenAI non trouvée dans .env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Fichier .env.local non trouvé" -ForegroundColor Yellow
    Write-Host "   Créez un fichier .env.local avec OPENAI_API_KEY=votre_cle" -ForegroundColor Yellow
}
Write-Host ""

# 4. Vérification de la base de données
Write-Host "💾 Étape 4/4 : Vérification de la base de données..." -ForegroundColor Yellow
if (Test-Path "prisma\prisma\dev.db") {
    Write-Host "✅ Base de données trouvée" -ForegroundColor Green
} else {
    Write-Host "⚠️  Base de données non trouvée, exécutez: npm run db:push" -ForegroundColor Yellow
}
Write-Host ""

# Résumé
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Installation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Vérifiez que .env.local contient OPENAI_API_KEY" -ForegroundColor White
Write-Host "   2. Si nécessaire, exécutez: npm run db:push" -ForegroundColor White
Write-Host "   3. Lancez l'application: npm run dev" -ForegroundColor White
Write-Host "   4. Ouvrez http://localhost:3000 dans votre navigateur" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Prêt à démarrer !" -ForegroundColor Green

