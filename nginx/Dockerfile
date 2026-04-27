# Stage 1: build the React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Nginx serves the static build + proxies to APIs
FROM nginx:alpine

COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
