FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5001
ENV MODEL_URL=https://storage.googleapis.com/example-llenn/model/model.json

CMD ["npm", "start"]
