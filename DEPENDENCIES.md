# 📦 Liste des Dépendances - NFC Card AI

## 🚀 Installation Rapide

### Option 1 : Script automatique (Recommandé)

**Windows (PowerShell):**
```powershell
.\install-all.ps1
```

**Windows (CMD):**
```cmd
install-all.bat
```

**Linux/Mac:**
```bash
chmod +x install-all.sh
./install-all.sh
```

### Option 2 : Commande npm
```bash
npm run install:all
```

### Option 3 : Installation manuelle
```bash
npm install
npx prisma generate
```

---

## 📋 Dépendances Principales (Dependencies)

### Framework & Core
- **next** `^14.0.4` - Framework React avec App Router
- **react** `^18.2.0` - Bibliothèque React
- **react-dom** `^18.2.0` - Rendu React pour le DOM
- **typescript** `^5.3.3` - Typage statique

### Types TypeScript
- **@types/node** `^20.10.6` - Types pour Node.js
- **@types/react** `^18.2.46` - Types pour React
- **@types/react-dom** `^18.2.18` - Types pour React DOM

### Styling
- **tailwindcss** `^3.4.0` - Framework CSS utilitaire
- **autoprefixer** `^10.4.16` - Préfixes CSS automatiques
- **postcss** `^8.4.32` - Processeur CSS
- **clsx** `^2.0.0` - Utilitaire pour classes conditionnelles
- **tailwind-merge** `^2.2.0` - Fusion intelligente des classes Tailwind

### UI & Animations
- **lucide-react** `^0.303.0` - Bibliothèque d'icônes
- **framer-motion** `^10.16.16` - Animations fluides
- **react-hot-toast** `^2.4.1` - Notifications élégantes

### Utilitaires
- **date-fns** `^3.0.6` - Manipulation de dates
- **openai** `^4.20.1` - SDK OpenAI pour l'IA
- **@prisma/client** `^5.7.1` - Client Prisma ORM

---

## 🛠️ Dépendances de Développement (DevDependencies)

- **eslint** `^8.56.0` - Linter JavaScript/TypeScript
- **eslint-config-next** `^14.0.4` - Configuration ESLint pour Next.js
- **prisma** `^5.7.1` - ORM et outils de migration
- **tsx** `^4.7.0` - Exécution TypeScript

---

## 📊 Statistiques

- **Total des dépendances:** 38 packages
- **Dépendances directes:** 18
- **Dépendances de développement:** 4
- **Taille approximative:** ~200 MB (node_modules)

---

## ✅ Vérification de l'Installation

Après l'installation, vérifiez que tout est correct :

```bash
# Vérifier les dépendances installées
npm list --depth=0

# Vérifier Prisma
npx prisma --version

# Vérifier Next.js
npx next --version
```

---

## 🔧 Configuration Requise

### Variables d'Environnement

Créez un fichier `.env.local` avec :

```env
# Base de données SQLite
DATABASE_URL="file:./prisma/prisma/dev.db"

# Clé API OpenAI (requis pour l'IA)
OPENAI_API_KEY="sk-proj-..."
```

### Base de Données

Après l'installation, initialisez la base de données :

```bash
npm run db:push
npm run db:seed
```

---

## 🚨 Résolution de Problèmes

### Erreur "prisma n'est pas reconnu"
```bash
npx prisma generate
```

### Erreur "tsx n'est pas reconnu"
```bash
npm install -g tsx
# ou
npx tsx scripts/seed.ts
```

### Erreur de dépendances manquantes
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur Prisma Client
```bash
npx prisma generate
```

---

## 📝 Notes Importantes

1. **Node.js requis:** Version 18.x ou supérieure
2. **npm requis:** Version 9.x ou supérieure
3. **Clé API OpenAI:** Nécessaire pour les fonctionnalités IA
4. **Base de données:** SQLite par défaut (peut être migrée vers PostgreSQL/MySQL)

---

## 🔄 Mise à Jour des Dépendances

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour toutes les dépendances
npm update

# Mettre à jour une dépendance spécifique
npm install package-name@latest
```

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

