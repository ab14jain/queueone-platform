FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production=false

COPY next.config.js tsconfig.json next-env.d.ts ./
COPY public ./public
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
