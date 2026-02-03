#!/bin/bash
# Script d'installation complète pour NFC Card AI (Linux/Mac)
# Ce script installe toutes les dépendances et configure l'environnement

echo ""
echo "🚀 Installation complète de NFC Card AI"
echo ""

# 1. Installation des dépendances npm
echo "📦 Étape 1/4 : Installation des dépendances npm..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation npm"
    exit 1
fi
echo "✅ Dépendances npm installées"
echo ""

# 2. Génération du client Prisma
echo "🗄️  Étape 2/4 : Génération du client Prisma..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération Prisma"
    exit 1
fi
echo "✅ Client Prisma généré"
echo ""

# 3. Vérification des variables d'environnement
echo "🔐 Étape 3/4 : Vérification des variables d'environnement..."
if [ -f .env.local ]; then
    echo "✅ Fichier .env.local trouvé"
    if grep -q "OPENAI_API_KEY" .env.local; then
        echo "✅ Clé API OpenAI configurée"
    else
        echo "⚠️  Clé API OpenAI non trouvée dans .env.local"
    fi
else
    echo "⚠️  Fichier .env.local non trouvé"
    echo "   Créez un fichier .env.local avec OPENAI_API_KEY=votre_cle"
fi
echo ""

# 4. Vérification de la base de données
echo "💾 Étape 4/4 : Vérification de la base de données..."
if [ -f "prisma/prisma/dev.db" ]; then
    echo "✅ Base de données trouvée"
else
    echo "⚠️  Base de données non trouvée, exécutez: npm run db:push"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installation terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Vérifiez que .env.local contient OPENAI_API_KEY"
echo "   2. Si nécessaire, exécutez: npm run db:push"
echo "   3. Lancez l'application: npm run dev"
echo "   4. Ouvrez http://localhost:3000 dans votre navigateur"
echo ""
echo "🎉 Prêt à démarrer !"
echo ""

