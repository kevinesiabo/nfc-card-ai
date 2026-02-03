# 🚀 Guide de Déploiement - Carte NFC

## Options d'Hébergement Recommandées

### 1. 🟢 Vercel (Recommandé - Le plus simple)
**Avantages :**
- ✅ Gratuit pour les projets personnels
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique
- ✅ Optimisé pour Next.js (créé par les mêmes développeurs)
- ✅ Configuration en 5 minutes

**Étapes :**

1. **Créez un compte sur [vercel.com](https://vercel.com)**

2. **Connectez votre repository GitHub**
   - Cliquez sur "New Project"
   - Importez votre repo `nfc-card-ai`

3. **Configurez les variables d'environnement :**
   ```
   DATABASE_URL=file:./prisma/prisma/dev.db
   OPENAI_API_KEY=votre-clé-api-openai
   NEXT_PUBLIC_BASE_URL=https://votre-app.vercel.app
   ```
   *(Vercel génère automatiquement l'URL, vous pouvez la copier)*

4. **Déployez !**
   - Vercel détecte automatiquement Next.js
   - Le build se fait automatiquement
   - Votre app est en ligne en 2-3 minutes

5. **Pour utiliser votre propre domaine :**
   - Allez dans Settings → Domains
   - Ajoutez votre domaine
   - Mettez à jour `NEXT_PUBLIC_BASE_URL` avec votre domaine

---

### 2. 🔵 Netlify
**Avantages :**
- ✅ Gratuit
- ✅ Déploiement automatique
- ✅ HTTPS automatique
- ✅ Bon support Next.js

**Étapes :**

1. **Créez un compte sur [netlify.com](https://netlify.com)**

2. **Connectez votre repository GitHub**

3. **Configuration du build :**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Variables d'environnement :**
   ```
   DATABASE_URL=file:./prisma/prisma/dev.db
   OPENAI_API_KEY=votre-clé-api-openai
   NEXT_PUBLIC_BASE_URL=https://votre-app.netlify.app
   ```

---

### 3. 🟡 Serveur VPS (DigitalOcean, AWS, etc.)
**Avantages :**
- ✅ Contrôle total
- ✅ Pas de limites de trafic
- ✅ Peut être moins cher à long terme

**Étapes :**

1. **Créez un serveur Ubuntu (20.04+)**

2. **Installez Node.js :**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Installez PM2 (gestionnaire de processus) :**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clonez votre projet :**
   ```bash
   git clone https://github.com/votre-username/nfc-card-ai.git
   cd nfc-card-ai
   npm install
   npx prisma generate
   ```

5. **Configurez `.env` :**
   ```env
   DATABASE_URL=file:./prisma/prisma/prod.db
   OPENAI_API_KEY=votre-clé-api-openai
   NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
   NODE_ENV=production
   ```

6. **Build et démarrez :**
   ```bash
   npm run build
   pm2 start npm --name "nfc-card" -- start
   pm2 save
   pm2 startup
   ```

7. **Configurez Nginx (reverse proxy) :**
   ```bash
   sudo apt install nginx
   ```

   Créez `/etc/nginx/sites-available/nfc-card` :
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Activez le site :
   ```bash
   sudo ln -s /etc/nginx/sites-available/nfc-card /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Configurez SSL avec Let's Encrypt :**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d votre-domaine.com
   ```

---

## ⚠️ Points Importants

### Base de Données en Production

**Option 1 : SQLite (Simple mais limité)**
- ✅ Fonctionne pour petits projets
- ❌ Pas de sauvegarde automatique
- ❌ Ne scale pas bien

**Option 2 : PostgreSQL (Recommandé pour production)**
- ✅ Plus robuste
- ✅ Sauvegardes automatiques
- ✅ Meilleure performance

**Pour migrer vers PostgreSQL :**

1. **Créez une base de données PostgreSQL** (sur Railway, Supabase, ou votre VPS)

2. **Modifiez `prisma/schema.prisma` :**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Mettez à jour `DATABASE_URL` :**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

4. **Migrez :**
   ```bash
   npx prisma migrate deploy
   ```

---

## 🔐 Sécurité

### Variables d'Environnement
- ✅ **JAMAIS** commiter `.env` dans Git
- ✅ Utiliser les variables d'environnement de votre hébergeur
- ✅ Utiliser HTTPS en production (obligatoire)

### Clés API
- ✅ Stocker `OPENAI_API_KEY` dans les variables d'environnement
- ✅ Ne jamais exposer dans le code client
- ✅ Utiliser des clés avec limites de taux

---

## 📊 Monitoring

### Vercel Analytics
- Intégré gratuitement
- Voir les performances et erreurs

### PM2 Monitoring (VPS)
```bash
pm2 monit
pm2 logs
```

---

## 🆘 Dépannage

### Le QR code ne fonctionne pas
1. Vérifiez que `NEXT_PUBLIC_BASE_URL` est défini
2. Vérifiez que l'URL commence par `https://` (pas `http://`)
3. Testez l'URL directement dans un navigateur

### Erreur de build
1. Vérifiez que toutes les dépendances sont installées
2. Vérifiez les variables d'environnement
3. Consultez les logs de build

### Base de données ne fonctionne pas
1. Vérifiez `DATABASE_URL`
2. Exécutez `npx prisma generate`
3. Vérifiez les permissions du fichier de base de données

---

## 📞 Support

Pour toute question, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)

