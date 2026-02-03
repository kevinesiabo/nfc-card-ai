# 🚀 Déploiement Vercel - Guide Étape par Étape

## 📋 Prérequis

- ✅ Compte GitHub (gratuit)
- ✅ Compte Vercel (gratuit)
- ✅ Votre clé API OpenAI

---

## Étape 1 : Initialiser Git (si pas déjà fait)

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Application carte NFC"
```

---

## Étape 2 : Créer un repository GitHub

1. **Allez sur [github.com](https://github.com)** et connectez-vous
2. **Cliquez sur le "+" en haut à droite** → "New repository"
3. **Nommez votre repo** : `nfc-card-ai` (ou autre nom)
4. **Choisissez "Public" ou "Private"**
5. **NE cochez PAS** "Initialize with README" (vous avez déjà des fichiers)
6. **Cliquez sur "Create repository"**

---

## Étape 3 : Connecter votre projet à GitHub

Dans votre terminal, exécutez :

```bash
# Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/nfc-card-ai.git

# Pousser votre code
git branch -M main
git push -u origin main
```

**Note :** Si GitHub vous demande de vous authentifier, utilisez un Personal Access Token.

---

## Étape 4 : Créer un compte Vercel

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Cliquez sur "Sign Up"**
3. **Choisissez "Continue with GitHub"**
4. **Autorisez Vercel** à accéder à votre compte GitHub

---

## Étape 5 : Déployer votre projet

1. **Dans Vercel, cliquez sur "Add New Project"**
2. **Trouvez votre repository** `nfc-card-ai` dans la liste
3. **Cliquez sur "Import"**

---

## Étape 6 : Configuration du projet

Vercel détecte automatiquement Next.js, mais vérifiez :

- **Framework Preset** : Next.js ✅
- **Root Directory** : `./` ✅
- **Build Command** : `npm run build` ✅
- **Output Directory** : `.next` ✅
- **Install Command** : `npm install` ✅

---

## Étape 7 : Variables d'environnement

**AVANT de cliquer sur "Deploy"**, ajoutez les variables d'environnement :

### Cliquez sur "Environment Variables" et ajoutez :

#### 1. DATABASE_URL
```
Name: DATABASE_URL
Value: file:./prisma/prisma/dev.db
```

#### 2. OPENAI_API_KEY
```
Name: OPENAI_API_KEY
Value: sk-votre-clé-api-openai-ici
```
*(Remplacez par votre vraie clé API OpenAI)*

#### 3. NEXT_PUBLIC_BASE_URL
```
Name: NEXT_PUBLIC_BASE_URL
Value: (laissez vide pour l'instant)
```
**⚠️ Important :** On va remplir ça APRÈS le premier déploiement

---

## Étape 8 : Premier déploiement

1. **Cliquez sur "Deploy"**
2. **Attendez 2-3 minutes** pendant le build
3. **Une fois terminé**, Vercel vous donne une URL comme :
   ```
   https://nfc-card-ai-xyz123.vercel.app
   ```

---

## Étape 9 : Configurer NEXT_PUBLIC_BASE_URL

1. **Copiez l'URL** que Vercel vous a donnée
2. **Dans Vercel, allez dans Settings → Environment Variables**
3. **Trouvez `NEXT_PUBLIC_BASE_URL`** et modifiez-la :
   ```
   Value: https://nfc-card-ai-xyz123.vercel.app
   ```
   *(Remplacez par votre vraie URL Vercel)*
4. **Sauvegardez**
5. **Allez dans l'onglet "Deployments"**
6. **Cliquez sur les 3 points** du dernier déploiement
7. **Cliquez sur "Redeploy"** pour appliquer la nouvelle variable

---

## Étape 10 : Tester votre application

1. **Visitez votre URL** : `https://votre-app.vercel.app/demo-1`
2. **Vérifiez que la page charge** ✅
3. **Testez le QR code** :
   - Cliquez sur "Voir le QR Code"
   - L'URL doit commencer par `https://votre-app.vercel.app` (pas localhost)
4. **Scannez avec votre téléphone** → doit fonctionner ! ✅

---

## ✅ Checklist

- [ ] Git initialisé
- [ ] Repository GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé dans Vercel
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] `NEXT_PUBLIC_BASE_URL` configuré avec l'URL Vercel
- [ ] Redéploiement effectué
- [ ] Application testée et fonctionnelle
- [ ] QR code testé depuis un téléphone

---

## 🆘 Problèmes courants

### Erreur : "Cannot find module"
- ✅ Vérifiez que toutes les dépendances sont dans `package.json`
- ✅ Vercel installe automatiquement, mais vérifiez les logs

### QR code pointe vers localhost
- ✅ Vérifiez que `NEXT_PUBLIC_BASE_URL` est bien défini
- ✅ Redéployez après avoir ajouté/modifié la variable

### Base de données ne fonctionne pas
- ⚠️ SQLite peut avoir des problèmes sur Vercel (fichiers éphémères)
- ✅ Pour la production, considérez PostgreSQL (voir ci-dessous)

---

## 🗄️ Option : Migrer vers PostgreSQL (Recommandé)

SQLite peut avoir des problèmes sur Vercel. Pour une solution robuste :

### Utiliser Supabase (Gratuit)

1. **Créez un compte sur [supabase.com](https://supabase.com)**
2. **Créez un nouveau projet**
3. **Allez dans Settings → Database**
4. **Copiez la "Connection string"** (URI)
5. **Dans Vercel, modifiez `DATABASE_URL`** :
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
6. **Modifiez `prisma/schema.prisma`** :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
7. **Poussez les changements sur GitHub**
8. **Vercel redéploie automatiquement**

---

## 🎉 Félicitations !

Votre application est maintenant en ligne et accessible depuis n'importe où dans le monde !

**Votre URL publique** : `https://votre-app.vercel.app`

Les QR codes fonctionnent maintenant pour tous vos clients, où qu'ils soient ! 🚀

