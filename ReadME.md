# DearDiary

![A screenshot of Dear Diary](https://i.imgur.com/ncOF8RR.png)

A free and open source website to manage your Diary Entries. 

## Why

While several Diary Writing services exist, they're either paid, or have a rather limited free tier. Since they're all close sourced, users also worry about the privacy of their entries. DearDiary aims to solve both of those problems by adopting a free and open source model. 

## When

Currently, DearDiary is not available for public use and is still under production. Users can however clone this repository to create their own version of DearDiary locally, with nobody but them having access to their entries.

## How to run locally

1. Clone this repository by either downloading the zip file from Github or by entering the following in your terminal
```
$ git clone https://github.com/TheTrio/DearDiary.git
```

Or if you prefer using ssh

```
$ git clone ssh://git@github.com/TheTrio/DearDiary.git
```
2. Open the folder, and install the node dependencies 
```
$ npm install
```
3. Start the local server by typing the following in your terminal
```
$ npm start
```
4. Visit localhost at port 3000. That is, type `127.0.0.1:3000` in the address bar of your browser.

Please note that this assumes that you already have MongoDB and NodeJS installed on your machine. You can read about how to install MongoDB and NodeJS on your machine [here](https://docs.mongodb.com/manual/installation/) and [here](https://nodejs.dev/learn/how-to-install-nodejs) respectively.

