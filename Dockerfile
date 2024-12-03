FROM node:18-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./
COPY app.js ./

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]
