# 🚀 Déploiement sur Vercel - Guide Rapide

## Étape 1 : Préparer votre code

1. **Assurez-vous que votre code est sur GitHub**
   ```bash
   git add .
   git commit -m "Prêt pour déploiement"
   git push origin main
   ```

## Étape 2 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub

## Étape 3 : Déployer votre projet

1. **Cliquez sur "Add New Project"**
2. **Importez votre repository** `nfc-card-ai`
3. **Vercel détecte automatiquement Next.js** ✅

## Étape 4 : Configurer les variables d'environnement

Dans la section "Environment Variables", ajoutez :

### Variables obligatoires :

```
DATABASE_URL
file:./prisma/prisma/dev.db
```

```
OPENAI_API_KEY
sk-votre-clé-api-openai
```

```
NEXT_PUBLIC_BASE_URL
https://votre-app.vercel.app
```
*(Vercel génère cette URL automatiquement, vous la verrez après le premier déploiement)*

### ⚠️ Important pour NEXT_PUBLIC_BASE_URL :

1. **Après le premier déploiement**, Vercel vous donne une URL comme `https://nfc-card-ai-xyz.vercel.app`
2. **Copiez cette URL** et mettez-la dans `NEXT_PUBLIC_BASE_URL`
3. **Redéployez** pour que les QR codes utilisent la bonne URL

## Étape 5 : Déployer !

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Votre app est en ligne ! 🎉

## Étape 6 : Tester

1. **Visitez votre URL** : `https://votre-app.vercel.app/demo-1`
2. **Vérifiez le QR code** :
   - Cliquez sur "Voir le QR Code"
   - L'URL doit commencer par `https://votre-app.vercel.app` (pas localhost)
3. **Scannez avec votre téléphone** → doit fonctionner ! ✅

## 🔧 Configuration d'un domaine personnalisé (Optionnel)

1. Allez dans **Settings → Domains**
2. Ajoutez votre domaine (ex: `cartes-nfc.votre-entreprise.com`)
3. Suivez les instructions DNS
4. **Mettez à jour** `NEXT_PUBLIC_BASE_URL` avec votre domaine
5. **Redéployez**

## 📊 Monitoring

- **Analytics** : Vercel fournit des analytics gratuits
- **Logs** : Voir les logs dans l'onglet "Deployments"
- **Performance** : Voir les métriques dans l'onglet "Analytics"

## 🆘 Problèmes courants

### Le QR code pointe vers localhost
- ✅ Vérifiez que `NEXT_PUBLIC_BASE_URL` est bien défini
- ✅ Redéployez après avoir ajouté la variable

### Erreur de build
- ✅ Vérifiez que toutes les variables d'environnement sont définies
- ✅ Consultez les logs de build dans Vercel

### Base de données ne fonctionne pas
- ⚠️ **Important** : SQLite ne fonctionne pas bien sur Vercel (fichiers éphémères)
- ✅ **Solution** : Utilisez PostgreSQL (voir section ci-dessous)

## 🗄️ Migrer vers PostgreSQL (Recommandé pour Vercel)

SQLite ne fonctionne pas bien sur Vercel car les fichiers sont éphémères. Utilisez PostgreSQL :

### Option 1 : Supabase (Gratuit)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez la connection string (Settings → Database → Connection string)
4. Mettez à jour `DATABASE_URL` dans Vercel :
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
5. Modifiez `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Redéployez

### Option 2 : Railway (Gratuit)

1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un nouveau projet → Add PostgreSQL
3. Copiez la connection string
4. Mettez à jour `DATABASE_URL` dans Vercel
5. Modifiez `prisma/schema.prisma` comme ci-dessus
6. Redéployez

## ✅ Checklist de déploiement

- [ ] Code poussé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé
- [ ] Variables d'environnement configurées
- [ ] `NEXT_PUBLIC_BASE_URL` défini avec l'URL Vercel
- [ ] Déploiement réussi
- [ ] QR code testé et fonctionnel
- [ ] (Optionnel) Domaine personnalisé configuré
- [ ] (Optionnel) PostgreSQL configuré

## 🎉 Félicitations !

Votre application est maintenant en ligne et accessible depuis n'importe où dans le monde !

