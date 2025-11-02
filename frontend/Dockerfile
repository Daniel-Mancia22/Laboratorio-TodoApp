FROM nginx:alpine

# Crear estructura de directorios
WORKDIR /usr/share/nginx/html

# Copiar archivos estáticos
COPY index.html .
COPY src/ ./src/

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Nginx se inicia automáticamente