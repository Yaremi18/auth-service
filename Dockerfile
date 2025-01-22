FROM node:22

WORKDIR /app

COPY package.json ./

RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3000

CMD ["node", "--watch", "src/server.js"]
