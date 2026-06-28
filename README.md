# AURA — Plateforme E-Commerce

Application e-commerce complète avec :
- **Backend** : Java Spring Boot 3.3 + PostgreSQL
- **Frontend client** : React + Vite + Tailwind CSS
- **Panel admin** : React + Vite + Tailwind CSS

---

## Prérequis

Installe ces outils avant de commencer :

| Outil | Version | Lien |
|-------|---------|------|
| Java JDK | 17 ou + | https://adoptium.net |
| Maven | 3.9 ou + | https://maven.apache.org/download.cgi |
| Node.js | 18 ou + | https://nodejs.org |
| PostgreSQL | 15 ou + | https://www.postgresql.org/download/windows |

Vérifie les installations :
```bash
java -version
mvn -version
node -version
```

---

## 1. PostgreSQL — Configurer la base de données

### a) Installer PostgreSQL
Télécharge et installe PostgreSQL depuis https://www.postgresql.org/download/windows/

Pendant l'installation, retiens le **mot de passe** que tu choisis pour l'utilisateur `postgres`.

### b) Créer la base de données

**Option 1 — pgAdmin (interface graphique, installée avec PostgreSQL) :**
1. Ouvre **pgAdmin**
2. Clique droit sur `Databases` → `Create` → `Database`
3. Nom : `aura_db`
4. Clique `Save`

**Option 2 — Terminal :**
```bash
psql -U postgres
```
```sql
CREATE DATABASE aura_db;
\q
```

> Les tables (`users`, `products`, `orders`) sont créées **automatiquement** au premier démarrage du backend. Tu n'as rien à faire de plus.

---

## 2. Backend — Spring Boot

### a) Configurer les variables d'environnement

Ouvre `backend/src/main/resources/application.properties` et remplis les valeurs :

```properties
# ========== BASE DE DONNÉES ==========
spring.datasource.url=jdbc:postgresql://localhost:5432/aura_db
spring.datasource.username=postgres
spring.datasource.password=TON_MOT_DE_PASSE_POSTGRESQL

# ========== JWT ==========
# Chaîne secrète de ton choix, minimum 32 caractères
jwt.secret=aura_super_secret_jwt_key_change_this_in_prod

# ========== ADMIN ==========
admin.email=admin@aura.com
admin.password=admin123

# ========== CLOUDINARY (pour les images produits) ==========
cloudinary.cloud-name=TON_CLOUD_NAME
cloudinary.api-key=TON_API_KEY
cloudinary.api-secret=TON_API_SECRET
```

> **Cloudinary** est un service gratuit pour stocker les images.
> Crée un compte sur https://cloudinary.com et copie les 3 clés depuis ton Dashboard.

### b) Démarrer le backend

```bash
cd backend
mvn spring-boot:run
```

Le backend démarre sur **http://localhost:4000**

Tu dois voir dans la console :
```
Tomcat started on port 4000
Started AuraApplication
```

---

## 3. Frontend Client — React

### a) Variables d'environnement

Crée ou vérifie le fichier `frontend/.env` :

```env
VITE_BACKEND_URL=http://localhost:4000
```

### b) Installer et démarrer

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

---

## 4. Panel Admin — React

### a) Variables d'environnement

Crée ou vérifie le fichier `admin/.env` :

```env
VITE_BACKEND_URL=http://localhost:4000
```

### b) Installer et démarrer

```bash
cd admin
npm install
npm run dev
```

Le panel admin démarre sur **http://localhost:5174**

---

## Démarrage complet (ordre recommandé)

Ouvre **3 terminaux** et exécute dans cet ordre :

```bash
# Terminal 1 — Backend (à démarrer en premier)
cd backend
mvn spring-boot:run

# Terminal 2 — Frontend client
cd frontend
npm run dev

# Terminal 3 — Panel Admin
cd admin
npm run dev
```

---

## Connexion Admin

URL : **http://localhost:5174**

| Champ | Valeur |
|-------|--------|
| Email | `admin@aura.com` |
| Mot de passe | `admin123` |

> Ces valeurs correspondent à ce que tu as mis dans `application.properties` (`admin.email` et `admin.password`).

---

## Structure du projet

```
aura/
├── backend/                         → Spring Boot (Java 17)
│   ├── pom.xml                      → Dépendances Maven
│   └── src/main/
│       ├── java/com/aura/
│       │   ├── AuraApplication.java → Point d'entrée
│       │   ├── config/              → Sécurité, Cloudinary, CORS
│       │   ├── controller/          → Routes API
│       │   ├── model/               → Entités JPA (User, Product, Order)
│       │   ├── repository/          → Accès base de données
│       │   ├── security/            → JWT (filtre + utilitaires)
│       │   └── service/             → Logique métier
│       └── resources/
│           └── application.properties → Configuration
│
├── frontend/                        → Application client (React + Vite)
│   ├── src/
│   │   ├── page/                    → Pages (Home, Product, Cart, Orders…)
│   │   ├── components/              → Composants réutilisables
│   │   └── context/ShopContext.jsx  → État global (panier, produits, auth)
│   └── .env                         → VITE_BACKEND_URL
│
└── admin/                           → Panel administrateur (React + Vite)
    ├── src/
    │   └── pages/
    │       ├── Add.jsx              → Ajouter un produit
    │       ├── List.jsx             → Gérer les produits + soldes
    │       └── Orders.jsx           → Gérer les commandes
    └── .env                         → VITE_BACKEND_URL
```

---

## Fonctionnalités

### Côté client
- Catalogue produits avec filtres et tri
- Fiche produit avec sélection de taille (stock en temps réel)
- Panier persistant (synchronisé avec le backend)
- Commande avec livraison (COD)
- Historique des commandes

### Côté admin
- Ajouter des produits avec images (Cloudinary ou local)
- Gérer le stock par taille
- Solder un article (prix barré + badge %)
- Retirer un solde
- Gérer le statut des commandes

---

## API — Endpoints disponibles

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/user/register` | Inscription | — |
| POST | `/api/user/login` | Connexion | — |
| POST | `/api/user/admin` | Connexion admin | — |
| GET | `/api/product/list` | Liste des produits | — |
| POST | `/api/product/single` | Détail d'un produit | — |
| POST | `/api/product/add` | Ajouter un produit | Admin |
| POST | `/api/product/remove` | Supprimer un produit | Admin |
| POST | `/api/product/sale` | Appliquer / retirer un solde | Admin |
| POST | `/api/cart/get` | Récupérer le panier | User |
| POST | `/api/cart/add` | Ajouter au panier | User |
| POST | `/api/cart/update` | Modifier la quantité | User |
| POST | `/api/order/place` | Passer une commande | User |
| POST | `/api/order/userorders` | Mes commandes | User |
| POST | `/api/order/list` | Toutes les commandes | Admin |
| POST | `/api/order/status` | Changer le statut | Admin |

---

## Problèmes fréquents

**Le backend ne démarre pas**
- Vérifie que PostgreSQL est bien démarré
- Vérifie le mot de passe dans `application.properties`
- Vérifie que la base `aura_db` existe

**Les images ne s'affichent pas**
- Si tu utilises Cloudinary : vérifie les 3 clés dans `application.properties`
- Si les images sont locales : elles sont dans `backend/uploads/` et servies sur `http://localhost:4000/uploads/`

**Erreur CORS**
- Vérifie que `cors.allowed-origins` dans `application.properties` contient bien `http://localhost:5173,http://localhost:5174`

**`mvn` non reconnu**
- Ajoute Maven au PATH système ou utilise le Maven embarqué : `./mvnw spring-boot:run`
