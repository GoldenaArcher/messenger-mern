FROM node:22.14.0-slim

WORKDIR /app

COPY package*.json turbo.json ./

RUN npm install

COPY . .

EXPOSE 3000 5000 8000

CMD ["npx", "turbo", "run", "dev"]
