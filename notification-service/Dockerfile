FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production=false

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 5001

CMD ["npm", "run", "start"]
