FROM node:14

WORKDIR /app

COPY package* /app/

RUN npm ci

COPY . .

CMD npm start