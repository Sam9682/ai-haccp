FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]