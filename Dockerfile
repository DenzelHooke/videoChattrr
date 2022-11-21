FROM node:19-alpine

WORKDIR /home/denzel/videoChattrr


COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8080

RUN npm run server