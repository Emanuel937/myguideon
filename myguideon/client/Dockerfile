FROM node:latest

# Utilisation d'un répertoire de travail standard
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json /app/

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . /app/

# Exposer le port utilisé par l'application React
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
