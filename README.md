# VideoChattr

A simple and lightweight video conferencing web app built on Next.js, Redux, Agora and Express.js.

## Demo

![](https://media.giphy.com/media/wS4piemMiOzyKdmkiz/giphy.gif)

## Run Locally

Clone the project

```bash
  git clone https://github.com/DenzelHooke/videoChattrr.git
```

Go to the project directory

```bash
  cd ./videoChattrr
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Start the client

```bash
  npm run client
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
located in ./videoChattrr

```
NODE_ENV = development
MONGO_URI = [mongoDB CLUSTER URI]
JWT_SECRET = [SECRET_KEY]
NEXT_PUBLIC_AGORA_APP_CERT = [AGORA_PUBLIC_CERT]
NEXT_PUBLIC_AGORA_APP_ID = [AGORA_APP_ID]
NEXT_PUBLIC_REDIS_PASS = [REDIS_DB_KEY]
```
