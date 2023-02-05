FROM node:16

WORKDIR /home/sumer/Documents/Projects/Marketplace

COPY package*.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
