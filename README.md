# 🎴 Carte NFC Premium avec IA Texte

Solution professionnelle de networking avec carte NFC, intégrant un assistant IA texte pour faciliter les échanges et la prise de rendez-vous.

## ✨ Fonctionnalités

### 🔹 Core Features
- **Scan NFC/QR Code** - Détection automatique et ouverture de la page digitale
- **Page d'accueil professionnelle** - Présentation avec photo, nom, poste, entreprise
- **Actions rapides** - Appel, Email, WhatsApp, Réseaux sociaux, Itinéraire, Rendez-vous
- **Échange de numéros intelligent** - Avec validation bilatérale et IA contextuelle
- **Prise de rendez-vous** - Intégration Google Calendar avec confirmation instantanée
- **Localisation & Itinéraire** - Google Maps / Apple Plans intégrés
- **Agent IA Texte** - Guide contextuel multi-langue (FR/EN)
- **Contenu dynamique** - Multi-profils et modification en temps réel
- **Analytics & Reporting** - Suivi complet des interactions
- **Sécurité RGPD** - Conformité by design avec bannière de consentement

### 🎨 Design Professionnel
- Interface moderne avec effet glass (glassmorphism)
- Animations fluides et transitions élégantes
- Design responsive (mobile, tablette, desktop)
- UX optimisée pour une expérience intuitive

## 🚀 Démarrage rapide

### Installation

```bash
npm install
npx prisma generate
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

**Note :** En développement, le QR code utilise automatiquement l'IP locale de votre ordinateur, permettant de tester depuis un téléphone sur le même Wi-Fi.

### Configuration pour la Production

Pour que les QR codes fonctionnent en production (clients scannant depuis n'importe où), configurez l'URL publique :

```env
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```

**📖 Voir le guide complet :** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Build de production

```bash
npm run build
npm start
```

## 📁 Structure du projet

```
nfc-card-ai/
├── app/                    # Pages Next.js App Router
│   ├── [cardId]/          # Page dynamique par carte
│   └── layout.tsx         # Layout principal
├── components/             # Composants React
│   ├── ui/                # Composants UI réutilisables
│   ├── actions/           # Boutons d'action
│   ├── ai/                # Composants IA
│   └── analytics/         # Composants analytics
├── lib/                    # Utilitaires et services
│   ├── ai/                # Service IA
│   ├── analytics/         # Service analytics
│   └── utils/             # Fonctions utilitaires
├── types/                  # Types TypeScript
└── public/                 # Assets statiques
```

## 🛠️ Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour la robustesse
- **Tailwind CSS** - Styling moderne et responsive
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes
- **React Hot Toast** - Notifications élégantes

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée du projet
- [FEATURES.md](./FEATURES.md) - Liste complète des fonctionnalités

## 🔧 Configuration

1. **Installez les dépendances**
   ```bash
   npm install
   ```

2. **Configurez la clé API OpenAI**
   - Le fichier `.env.local` a été créé avec votre clé API
   - ⚠️ **IMPORTANT** : Ne commitez jamais `.env.local` dans Git
   - En production, configurez la variable `OPENAI_API_KEY` sur votre hébergeur

3. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

## 📱 Utilisation

### Accès à une carte
Visitez `/demo-1` pour voir la carte de démonstration.

### Créer votre propre carte
1. Modifiez les données dans `app/[cardId]/page.tsx`
2. Ou connectez-vous à une API backend (voir `lib/profiles/service.ts`)

## 🚀 Déploiement

Le projet est prêt pour le déploiement sur Vercel, Netlify ou tout autre hébergeur Next.js.

```bash
npm run build
npm start
```

## 🤖 Intelligence Artificielle

L'assistant IA utilise **OpenAI GPT-3.5-turbo** pour fournir des réponses intelligentes et contextuelles. 

### Fonctionnalités IA
- ✅ Réponses contextuelles basées sur la conversation
- ✅ Support multi-langue (FR/EN)
- ✅ Détection d'intentions (échange de numéros, rendez-vous, itinéraire)
- ✅ Fallback automatique en cas d'erreur API
- ✅ Sécurité : clé API côté serveur uniquement

## 📝 License

MIT

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

