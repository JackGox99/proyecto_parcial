# ----- Imagen de la página (frontend) -----
# Etapa 1: compila React con Node y deja los archivos estáticos en /app/build.
FROM node:22-alpine AS construccion

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src
RUN npm run build

# Etapa 2: solo los archivos compilados, servidos por Nginx. Node y las
# dependencias de la etapa 1 no llegan a la imagen final.
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construccion /app/build /usr/share/nginx/html

EXPOSE 80
