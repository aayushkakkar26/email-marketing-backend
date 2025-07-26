# email-marketing-backend

Email Marketing SaaS — Backend

This is the backend built using NestJS, MongoDB (Mongoose)

🚀 Project Setup

📦 Requirements

Node.js (v18+)

MongoDB (Cloud or Local)

Docker & Docker Compose

.env file

📁 Environment Variables

Create a .env file based on the example below:

PORT=3000
MONGO_URI = your_Mongo_uri
RESEND_API_KEY = your_resend_api_key
PORT = your_port

You can include these in a .env.example file too.

🧱 Run Locally (without Docker)

yarn install
yarn start:dev

🐳 Docker Setup

📁 Dockerfile (placed in root of backend)

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

🧪 Docker Compose Service (Defined in infra repo)

Define backend service in docker-compose.yml with port 3000 and link it with mongo service.