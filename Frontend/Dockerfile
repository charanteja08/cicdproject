FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json first
COPY package.json ./

# Install dependencies - this will update package-lock.json if needed
RUN npm install --legacy-peer-deps --no-audit

# Copy source code
COPY . .

# Set build-time environment variables
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# Build the application
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

