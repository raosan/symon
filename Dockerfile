# Use NGINX Alpine Stable
FROM nginx:stable-alpine

WORKDIR /usr/src/app

# Copy source files
COPY . .

# Install npm, supervisor
RUN apk add --update npm supervisor

# Install dependencies
RUN npm ci

# Delete existing NGINX conf and copy NGINX conf from src folder
COPY src/nginx /etc/nginx/

# Copy supervisor conf
COPY supervisord.conf /etc/supervisord.conf

# Expose port
EXPOSE 80

# Run the app
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]