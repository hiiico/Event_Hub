# Build stage
FROM node:20-alpine AS builder
ARG API_URL
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .

# Create environment.prod.ts with the passed API_URL
RUN echo "export const environment = { production: true, apiUrl: '${API_URL}' };" > src/environments/environment.prod.ts

# Build with production configuration (triggers file replacement)
RUN npm run build -- --configuration=production

# Run stage
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
