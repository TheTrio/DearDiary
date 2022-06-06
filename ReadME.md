# DearDiary

![A screenshot of Dear Diary](https://i.imgur.com/ncOF8RR.png)

A free and open source website to manage your Diary Entries. Can be found [here](https://warm-cliffs-50746.herokuapp.com/)

## Host locally

There might be several reasons you want to host Dear Diary locally. Most importantly, it means that your data is yours. It stays on your device, and therefore, the chances of someone getting access to it are pretty low. Here we look at how you can host Dear Diary locally.

There are two ways to host Dear Diary locally - either through docker or without it.

### Host using Docker

1. Install [Docker](https://docs.docker.com/engine/install/) for your system
2. Create a `.env` file for your secrets. The format of the file is as such

```
DB_URL=mongodb_url # for storing your entries. If you're not sure, check out MongoDB atlas.
imgurClientID=token # for uploading your images to imgur
ENVIRONMENT=Production
```

3. Run the image

```
$ docker run -p 80:3000 --env-file .env activeswaucer/deardiary:latest
```

This assumes that the `.env` file is in your working directory.

4. Go to `localhost:80/`. That is, type `127.0.0.1:80` in the address bar of your browser.

### Host without Docker

1. Install [NodeJS LTS 14.17.1](https://nodejs.dev/learn/how-to-install-nodejs)

2. Install [Mongo DB](https://docs.mongodb.com/manual/installation/)

3. Clone this repository by either downloading the zip file from Github or by entering the following in your terminal

```
$ git clone https://github.com/TheTrio/DearDiary.git
```

Or if you prefer using ssh

```
$ git clone ssh://git@github.com/TheTrio/DearDiary.git
```

4. Open the folder, and install the node dependencies

```
$ npm install
```

5. Start the local server by typing the following in your terminal

```
$ npm start
```

6. Visit localhost at port 3000. That is, type `127.0.0.1:3000` in the address bar of your browser.
