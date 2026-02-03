# Guide de Déploiement - Carte NFC

## Configuration de l'URL Publique pour le QR Code

Pour que les QR codes fonctionnent en production (quand les clients scannent avec leurs téléphones), vous devez configurer une URL publique accessible depuis Internet.

### 1. Configuration de l'URL Publique

Créez ou modifiez le fichier `.env.local` (ou `.env` en production) et ajoutez :

```env
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```

**Exemples selon votre hébergement :**

#### Vercel
```env
NEXT_PUBLIC_BASE_URL=https://votre-app.vercel.app
```

#### Netlify
```env
NEXT_PUBLIC_BASE_URL=https://votre-app.netlify.app
```

#### Votre propre serveur avec domaine
```env
NEXT_PUBLIC_BASE_URL=https://cartes-nfc.votre-entreprise.com
```

#### Serveur VPS/Dedicated
```env
NEXT_PUBLIC_BASE_URL=https://votre-ip-publique.com
# ou
NEXT_PUBLIC_BASE_URL=http://votre-ip-publique:3000
```

### 2. Comportement du Code

Le code fonctionne automatiquement selon l'environnement :

- **En développement** (`NODE_ENV=development`) :
  - Si `NEXT_PUBLIC_BASE_URL` n'est pas défini → utilise l'IP locale (ex: `http://192.168.1.100:3000`)
  - Permet de tester le QR code depuis un téléphone sur le même Wi-Fi

- **En production** (`NODE_ENV=production`) :
  - **DOIT** utiliser `NEXT_PUBLIC_BASE_URL` pour que les QR codes fonctionnent depuis n'importe où
  - Si non défini, utilise l'origin de la requête (peut ne pas fonctionner selon l'hébergement)

### 3. Vérification

Après le déploiement, testez le QR code :

1. Accédez à votre carte : `https://votre-domaine.com/demo-1`
2. Cliquez sur "Voir le QR Code"
3. Vérifiez que l'URL dans le QR code commence par `https://votre-domaine.com` (pas `localhost` ou une IP locale)
4. Scannez avec un téléphone (même pas sur le même Wi-Fi) → doit fonctionner

### 4. Déploiement sur Vercel (Recommandé)

1. **Connectez votre repo GitHub à Vercel**
2. **Ajoutez la variable d'environnement** dans les paramètres Vercel :
   - Variable : `NEXT_PUBLIC_BASE_URL`
   - Valeur : `https://votre-app.vercel.app` (ou votre domaine personnalisé)
3. **Déployez** → Vercel génère automatiquement l'URL

### 5. Déploiement sur votre propre serveur

1. **Installez Node.js** sur votre serveur
2. **Clonez le projet**
3. **Configurez `.env`** avec `NEXT_PUBLIC_BASE_URL`
4. **Build et démarrez** :
   ```bash
   npm run build
   npm start
   ```
5. **Configurez un reverse proxy** (Nginx/Apache) pour exposer le port 3000
6. **Configurez SSL** (Let's Encrypt) pour HTTPS

### 6. Important pour la Production

✅ **À FAIRE :**
- Définir `NEXT_PUBLIC_BASE_URL` avec une URL publique HTTPS
- Utiliser HTTPS (obligatoire pour les fonctionnalités modernes)
- Tester le QR code depuis différents réseaux

❌ **À ÉVITER :**
- Laisser `NEXT_PUBLIC_BASE_URL` vide en production
- Utiliser HTTP en production (sécurité)
- Utiliser des IPs locales en production

### 7. Exemple de Configuration Complète

**`.env.local` (développement) :**
```env
DATABASE_URL="file:./prisma/prisma/dev.db"
OPENAI_API_KEY="votre-clé-api"
# NEXT_PUBLIC_BASE_URL non défini → utilise IP locale automatiquement
```

**`.env.production` (production) :**
```env
DATABASE_URL="file:./prisma/prisma/prod.db"
OPENAI_API_KEY="votre-clé-api"
NEXT_PUBLIC_BASE_URL="https://cartes-nfc.votre-entreprise.com"
```

