FROM node:20-alpine

# Skapa arbetskatalog i containern
WORKDIR /usr/src/app

# Kopiera package-filer först (bättre caching)
COPY package*.json ./

# Installera dependencies
RUN npm install --only=production

# Kopiera resten av koden
COPY . .

# Exponera port 3000
EXPOSE 3000

# Startkommandot
CMD ["npm", "start"]
