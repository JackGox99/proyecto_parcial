# ----- Imagen del servidor (backend) -----
# Node 22 en Alpine: una imagen pequeña con lo justo para correr Express.
FROM node:22-alpine

WORKDIR /app

# Primero solo los package.json: si no cambian, Docker reutiliza la capa
# con las dependencias ya instaladas y la construcción es más rápida.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Las variables de la base de datos (DB_HOST, DB_PASSWORD, ...) no van en la
# imagen: las entrega docker-compose al arrancar el contenedor.
ENV NODE_ENV=production
EXPOSE 4000
USER node
CMD ["node", "index.js"]
