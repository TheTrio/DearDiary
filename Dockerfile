FROM node:gallium-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm" , "start"]
