# ZENO Collection - E-commerce Website

Boutique en ligne premium de chaussures et sandales pour femmes - Basée en Tunisie.

## 🌟 Fonctionnalités

### Site Public
- 🏠 Hero slider avec bannières configurables
- 👟 Catégories: SAMBA, Espadrilles, Sabot, Nouveautés
- 🛍️ Grille Best Sellers, Nouveautés, Promotions
- 📄 Pages produits avec galerie d'images, zoom, tailles, couleurs
- 🛒 Panier avec coupon de réduction
- 💳 Checkout avec Paiement à la livraison (Cash on Delivery)
- 💬 Intégration WhatsApp complète (bouton flottant, checkout WhatsApp)
- 🔐 Espace client (Inscription, Connexion, Mot de passe oublié)
- ❤️ Liste de souhaits
- 📸 Galerie Instagram
- 📧 Newsletter
- ⭐ Avis clients
- 📱 Design Mobile First
- 🔍 SEO Optimisé (FR, mots-clés Tunisie)

### Panel Admin Caché (/admin)
- 🔒 Connexion sécurisée (Email + Password)
- 📊 Dashboard avec statistiques en temps réel
- 👟 Gestion Produits (CRUD complet, upload d'images, couleurs, tailles)
- 📁 Gestion Catégories
- 📦 Gestion Commandes (statuts: Pending, Processing, Shipped, Delivered, Cancelled)
- 👥 Gestion Clients
- 🎟️ Gestion Coupons
- 🖼️ Gestion Bannières (Hero slider)
- ⭐ Modération des Avis
- 📧 Newsletter (export CSV)
- 🗂️ Médiathèque
- ⚙️ Paramètres du store (WhatsApp, contact, réseaux sociaux, logo)

**Identifiants admin par défaut:**
- Email: `admin@zeno.tn`
- Password: `admin123`

## 🛠️ Stack Technique

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 7
- **Styles:** Tailwind CSS 4
- **Routing:** React Router DOM
- **State:** React Context + localStorage (persistance)
- **Authentification Admin:** Session Storage

## 🚀 Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

## 🌐 Déploiement sur Vercel (Guide Étape par Étape)

### Étape 1: Préparer le projet
```bash
npm run build
```
Vérifiez que le dossier `dist/` est créé sans erreurs.

### Étape 2: Créer un compte Vercel
1. Allez sur https://vercel.com
2. Inscrivez-vous avec GitHub / GitLab / Email
3. C'est **gratuit** pour les projets personnels

### Étape 3: Déployer (3 méthodes)

#### Méthode A: Via GitHub (RECOMMANDÉ)
1. Créez un repository GitHub privé ou public
2. Pushez votre code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/zeno-collection.git
   git push -u origin main
   ```
3. Sur Vercel → "Add New..." → "Project"
4. Sélectionnez votre repo GitHub
5. **Framework Preset:** Vite (détecté automatiquement)
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Cliquez sur **Deploy**
9. Votre site sera live sur `https://votre-projet.vercel.app`

#### Méthode B: Via CLI Vercel
```bash
npm install -g vercel
vercel login
vercel
# Suivez les instructions
vercel --prod  # Pour déployer en production
```

#### Méthode C: Upload direct (sans Git)
1. `npm run build`
2. Sur vercel.com → "Add New" → "Project" → "Other"
3. Glissez-déposez le dossier `dist/`

### Étape 4: Connecter un domaine personnalisé (optionnel)
1. Sur Vercel → Settings → Domains
2. Ajoutez `zenocollection.tn` ou `votre-boutique.tn`
3. Configurez les DNS chez votre registrar:
   - Type A: `76.76.21.21`
   - Ou CNAME: `cname.vercel-dns.com`
4. Vercel configure automatiquement le SSL/HTTPS

## 🗄️ Base de Données (Optionnel)

Le site fonctionne actuellement avec **localStorage** pour une solution 100% frontend sans serveur.

Pour connecter une vraie base de données (MySQL, MongoDB, etc.):

### Option 1: MySQL + Node.js Backend (Recommandé pour production)
1. Créez un dossier `/api` avec Express/Fastify
2. Endpoints REST: `/api/products`, `/api/orders`, `/api/auth`
3. Déployez le backend séparément (sur Hostinger, Railway, etc.)
4. Mettez à jour `src/data/store.ts` pour utiliser `fetch()` au lieu de localStorage

### Option 2: Firebase / Supabase (No-code)
- **Supabase:** PostgreSQL gratuit, parfait pour e-commerce
- **Firebase Firestore:** Très facile à intégrer avec React

### Schéma de base de données recommandé:
```
products (id, name, description, price, sale_price, sku, stock, category, images, sizes, colors, featured, best_seller, created_at)
categories (id, name, slug, image, description)
orders (id, customer_name, email, phone, city, address, items JSON, total, status, created_at)
customers (id, name, email, phone, created_at)
coupons (id, code, type, value, expiry, usage_limit, used)
banners (id, title, subtitle, image, link, active)
reviews (id, product_id, author, rating, comment, approved, created_at)
newsletter (id, email, created_at)
settings (store_name, whatsapp, email, phone, address, instagram, currency)
admins (id, email, password_hash, created_at)
```

## 📦 Pour créer un fichier ZIP

```bash
# Sur Windows PowerShell:
Compress-Archive -Path * -DestinationPath zeno-collection.zip -Force

# Sur macOS/Linux:
zip -r zeno-collection.zip . -x "node_modules/*" ".git/*" "dist/*"
```

## 🔒 Sécurité

1. **Changez le mot de passe admin** dans `src/data/store.ts` ou via le panel (futur)
2. Pour la production: utilisez un backend avec JWT/bcrypt pour l'authentification admin
3. Ne stockez JAMAIS de vrais mots de passe en clair
4. Utilisez HTTPS (Vercel le fournit gratuitement)

## 📱 Personnalisation rapide

- **Couleurs:** `src/index.css` → variables Tailwind
- **Logo / Nom:** Panel Admin → Paramètres, ou `src/data/store.ts` → `defaultSettings`
- **Numéro WhatsApp:** Panel Admin → Paramètres (remplace `21692765464`)
- **Bannières Hero:** Panel Admin → Bannières
- **Produits:** Panel Admin → Produits
- **Catégories:** Panel Admin → Catégories
- **Devise:** Panel Admin → Paramètres (par défaut: TND)

## 📈 SEO

- Titre et meta description optimisés pour "sandales femme tunisie"
- URLs propres: `/products`, `/product/:id`
- Open Graph tags pour le partage social
- Schema.org JSON-LD peut être ajouté pour les produits

## 🆘 Support

Pour toute question: contactez votre développeur ou consultez la documentation Vercel.

---

**Fait avec ❤️ pour ZENO Collection - Tunisie 🇹🇳**
