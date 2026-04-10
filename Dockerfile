# Usar una imagen ligera de Node
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./
RUN npm install --only=production

# Copiar el código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar
CMD [ "node", "server.js" ]