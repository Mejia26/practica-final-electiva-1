# 1. Usamos una imagen ligera de Node.js como base
FROM node:18-slim

# 2. Creamos y definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY app/package*.json ./

# 4. Instalamos las dependencias
RUN npm install --production

# 5. Copiamos el resto del código de la aplicación
COPY . .

# 6. Exponemos el puerto en el que corre nuestra app
EXPOSE 3000

# 7. Comando para arrancar la aplicación
CMD ["node", "app/server.js"]