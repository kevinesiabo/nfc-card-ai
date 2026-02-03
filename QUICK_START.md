# ⚡ Démarrage Rapide - Déploiement

## 🎯 Choisissez votre option

### Option 1 : Vercel (5 minutes) ⭐ RECOMMANDÉ

**Le plus simple et rapide**

1. **Poussez votre code sur GitHub**
2. **Allez sur [vercel.com](https://vercel.com)** et connectez GitHub
3. **Importez votre projet**
4. **Ajoutez les variables d'environnement** :
   - `DATABASE_URL` = `file:./prisma/prisma/dev.db`
   - `OPENAI_API_KEY` = votre clé
   - `NEXT_PUBLIC_BASE_URL` = URL Vercel (après le premier déploiement)
5. **Déployez !**

📖 **Guide détaillé** : [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

---

### Option 2 : Netlify (10 minutes)

1. **Poussez votre code sur GitHub**
2. **Allez sur [netlify.com](https://netlify.com)**
3. **Importez depuis GitHub**
4. **Configurez** :
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Ajoutez les variables d'environnement**
6. **Déployez !**

---

### Option 3 : Votre propre serveur (30 minutes)

1. **Créez un serveur Ubuntu**
2. **Installez Node.js et Nginx**
3. **Clonez votre projet**
4. **Configurez les variables d'environnement**
5. **Build et démarrez avec PM2**
6. **Configurez Nginx et SSL**

📖 **Guide détaillé** : [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## ⚠️ Points Importants

### Pour que les QR codes fonctionnent :

✅ **OBLIGATOIRE** : Définir `NEXT_PUBLIC_BASE_URL` avec votre URL publique
✅ **OBLIGATOIRE** : Utiliser HTTPS (pas HTTP)
✅ **OBLIGATOIRE** : Tester le QR code depuis un téléphone

### Base de données :

- **SQLite** : OK pour développement, limité en production
- **PostgreSQL** : Recommandé pour production (gratuit sur Supabase/Railway)

---

## 🆘 Besoin d'aide ?

Consultez les guides détaillés :
- [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) - Guide Vercel complet
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guide général
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Configuration avancée

