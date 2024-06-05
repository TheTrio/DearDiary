FROM --platform=linux/amd64 node:gallium-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

CMD [ "npm" , "start"]
