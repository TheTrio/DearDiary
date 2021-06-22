# DearDiary

![A screenshot of Dear Diary](https://i.imgur.com/ncOF8RR.png)

A free and open source website to manage your Diary Entries. 

## Why

1. We're completely free and open source
2. All your diary entries are encrypted. Do note that the strength of the encryption depends on your password, so its advised to choose it wisely.
3. Apart from your diary entries, we store no other information. None whatsoever 
4. To further ensure privacy, none of the images you upload in your entries are stored on our servers. They're uploaded privately to [IMGUR](imgur.com/) and we merely store the links of those images. And yes, even those links are encrypted 

Still not convinced? You can learn about hosting Dear Diary  [here](#host-locally)

## Host locally

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

