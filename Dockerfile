# Pourquoi utiliser un Dockerfile multi-stage (Build / Prod)

    # Le stage Build contient tout ce qui est nécessaire pour compiler l’application
    # (TypeScript, devDependencies, outils de build).
    # Le stage Prod ne contient que ce qui est nécessaire à l’exécution
    # (code compilé + dépendances runtime).

# Bénéfices clés

    # Image plus légère → démarrage plus rapide, déploiements plus rapides.
    # Sécurité renforcée → aucun outil de build ni dépendance de dev en production.
    # Reproductibilité → même build en local, CI et production.
    # Séparation claire des responsabilités → build ≠ runtime (bonne pratique DevOps).
    # Meilleure compatibilité CI/CD et Kubernetes → images propres, stables, immuables.

# RUNTIME ONLY : L’image Docker ne contient que ce qui est strictement nécessaire pour exécuter l’application, et rien de plus.

# 🧠 Concrètement, dans ton projet NestJS
        # Ce que le runtime DOIT contenir
        # Node.js (le moteur d’exécution)
        # Les dépendances runtime (dependencies)
        # Le code compilé (dist/)
        # La configuration d’exécution (env vars)

# Ce que le runtime NE DOIT PAS contenir
        # TypeScript
        # ts-node
        # Compilateur
        # ESLint / Prettier
        # Jest
        # DevDependencies
        # Outils de build
        # Code source .ts
        # 👉 Tout ça reste dans le stage Build, qui est jeté.


#         BUILD STAGE                  PROD STAGE (runtime only)
# ─────────────               ──────────────────────────
# TypeScript                  Node.js
# ts-node                     dependencies
# jest                         dist/
# eslint                       app runtime
# devDependencies

# Première étape le build stage qui sert à compiler l'application
FROM node:20-alpine AS builder

WORKDIR /app

# Le COPY package.json package-lock.json ./ ne copie que les fichiers de dépendances
# Cette ligne permet de ne pas réinstaller les dépendances si elles n'ont pas changé
COPY package*.json ./
# La commande npm ci installe les dépendances listées dans package-lock.json de manière propre
RUN npm ci

# Ici la phase de build de l'application TypeScript qui sert à compiler le code source en JavaScript
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build


# Deuxième étape : l'image finale qui sera utilisée pour exécuter l'application
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Copier les fichiers construits depuis l'étape de build
COPY --from=builder /app/dist ./dist

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
CMD wget -qO- http://localhost:3000/health || exit 1

# For the command ensure that relations in db postgres are created before starting the app
CMD ["sh", "-c", "until nc -z postgres 5432; do echo 'waiting for postgres'; sleep 1; done; npx typeorm migration:run -d dist/database/typeorm.datasource.js && node dist/main.js"]

