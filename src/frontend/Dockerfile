FROM node:20-alpine as build

WORKDIR /app

# Accept build arguments
ARG REACT_APP_HTTP_PORT2
ARG REACT_APP_API_URL

# Set environment variables for build
ENV REACT_APP_HTTP_PORT2=$REACT_APP_HTTP_PORT2
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install --omit=dev --silent --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine

# Install docker-compose
RUN apk add --no-cache curl \
    && curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9002

CMD ["nginx", "-g", "daemon off;"]