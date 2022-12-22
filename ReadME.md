# DearDiary

![A screenshot of Dear Diary](https://i.imgur.com/ncOF8RR.png)

A simple diary writing application. Built using Express, SCSS, and vanilla JavaScript(something I definitely wouldn't recommend).

## Run

Running is as simple as creating an `.env` file with the following variables:

```text
DB_URL=mongodb_url for storing your entries. If you're not sure, check out MongoDB atlas.
imgurClientID=token for uploading your images to imgur
ENVIRONMENT=Production
```

And then, simply use docker to run the application.

```bash
docker run -p 80:3000 --env-file .env thetrio51/deardiary:latest
```

## Development setup

Install the LTS version of Node and run the following commands in your terminal.

```bash
git clone https://github.com/TheTrio/DearDiary.git
npm install
npm start
```

You should have a development server running on `localhost:3000`.

## Features

-   AES-256 encryption for diary entries
-   A way to view random entries
-   A WYSIWYG editor for writing entries
-   A (rather complicated) way to export entries
-   A functional dark mode
