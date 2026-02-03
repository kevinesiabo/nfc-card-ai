# Tests Unitaires - Carte NFC

## 📋 Structure des Tests

```
__tests__/
├── utils.test.ts              # Tests des fonctions utilitaires
├── api/
│   ├── profiles.test.ts       # Tests API profiles
│   └── analytics.test.ts      # Tests API analytics
├── components/
│   └── ContactExchange.test.tsx  # Tests composant ContactExchange
├── services/
│   └── ProfileService.test.ts    # Tests service ProfileService
└── integration/
    └── card-flow.test.ts         # Tests d'intégration
```

## 🚀 Exécution des Tests

### Tous les tests
```bash
npm test
```

### Mode watch (développement)
```bash
npm run test:watch
```

### Avec couverture de code
```bash
npm run test:coverage
```

### Un fichier spécifique
```bash
npm test -- utils.test.ts
```

## 📊 Types de Tests

### 1. Tests Unitaires
- **Utils** : Fonctions utilitaires (formatPhoneNumber, generateVCard, etc.)
- **Services** : Logique métier (ProfileService, AnalyticsService)
- **API Routes** : Endpoints API (GET, POST, PUT)

### 2. Tests de Composants
- **React Components** : Rendu, interactions utilisateur, événements

### 3. Tests d'Intégration
- **Flux complets** : Parcours utilisateur de bout en bout

## ✅ Couverture Actuelle

- ✅ Utilitaires (utils.ts)
- ✅ API Routes (profiles, analytics)
- ✅ Services (ProfileService)
- ✅ Composants (ContactExchange)
- ✅ Tests d'intégration

## 🔧 Configuration

- **Jest** : Framework de test
- **React Testing Library** : Tests de composants React
- **jsdom** : Environnement DOM pour les tests
- **ts-jest** : Support TypeScript

## 📝 Ajouter de Nouveaux Tests

1. Créer un fichier `*.test.ts` ou `*.test.tsx`
2. Importer les fonctions/composants à tester
3. Écrire les tests avec `describe` et `it`
4. Exécuter `npm test` pour vérifier

### Exemple

```typescript
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

