# 🗄️ Configuration de la Base de Données

## ✅ Base de Données Ajoutée

Le projet utilise maintenant **Prisma** avec **SQLite** pour le stockage persistant des données.

## 🚀 Installation et Configuration

### 1. Installer les dépendances

```bash
cd D:\nfc-card-ai
npm install
```

### 2. Générer le client Prisma

```bash
npm run db:generate
```

### 3. Créer la base de données

```bash
npm run db:push
```

Cette commande va :
- Créer le fichier `prisma/dev.db` (SQLite)
- Créer toutes les tables selon le schéma Prisma

### 4. (Optionnel) Ouvrir Prisma Studio

Pour visualiser et gérer vos données :

```bash
npm run db:studio
```

Cela ouvre une interface graphique sur http://localhost:5555

## 📊 Structure de la Base de Données

### Tables Créées

1. **CardProfile** - Profils des cartes NFC
   - Informations principales (nom, poste, entreprise, etc.)
   - Relations avec les autres tables

2. **SocialMedia** - Réseaux sociaux
   - LinkedIn, Twitter, Facebook, Instagram

3. **TimeSlot** - Créneaux disponibles pour rendez-vous
   - Date, heure, localisation, lien de visioconférence

4. **Analytics** - Statistiques et métriques
   - Scans NFC/QR, échanges, rendez-vous, etc.

5. **Appointment** - Rendez-vous pris
   - Informations du visiteur, créneau sélectionné

6. **ContactExchange** - Échanges de numéros
   - Historique des échanges

## 🔄 Migration depuis l'Ancien Système

Les services ont été mis à jour pour utiliser la base de données :

- `lib/analytics/service-db.ts` - Service Analytics avec DB
- `lib/profiles/service-db.ts` - Service Profiles avec DB

**Important** : Pour activer la base de données, remplacez les imports :

```typescript
// Ancien (mémoire)
import { AnalyticsService } from '@/lib/analytics/service';

// Nouveau (base de données)
import { AnalyticsService } from '@/lib/analytics/service-db';
```

## 🎯 Utilisation

### Créer un profil de carte

```typescript
import { ProfileService } from '@/lib/profiles/service-db';

const profileService = ProfileService.getInstance();
const profile = await profileService.createProfile({
  id: 'demo-1',
  name: 'Jean Dupont',
  position: 'Directeur Commercial',
  company: 'Tech Solutions',
  phone: '+33612345678',
  email: 'jean.dupont@techsolutions.fr',
  // ...
});
```

### Récupérer les analytics

```typescript
import { AnalyticsService } from '@/lib/analytics/service-db';

const analyticsService = AnalyticsService.getInstance();
const stats = await analyticsService.getAnalytics('demo-1');
```

## 🔧 Migration vers PostgreSQL/MySQL (Production)

Pour la production, vous pouvez facilement migrer vers PostgreSQL ou MySQL :

1. Modifiez `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql" // ou "mysql"
  url      = env("DATABASE_URL")
}
```

2. Mettez à jour `.env.local` :
```
DATABASE_URL="postgresql://user:password@localhost:5432/nfc_card_db?schema=public"
```

3. Créez la migration :
```bash
npm run db:migrate
```

## 📝 Commandes Utiles

- `npm run db:generate` - Génère le client Prisma
- `npm run db:push` - Synchronise le schéma avec la DB (développement)
- `npm run db:migrate` - Crée une migration (production)
- `npm run db:studio` - Ouvre Prisma Studio

## ⚠️ Notes Importantes

- La base de données SQLite est créée dans `prisma/dev.db`
- Ajoutez `prisma/dev.db` et `prisma/dev.db-journal` au `.gitignore`
- Pour la production, utilisez PostgreSQL ou MySQL
- Les données sont maintenant persistantes entre les redémarrages

