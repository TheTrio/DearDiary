FROM --platform=linux/amd64 node:gallium-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm" , "start"]
