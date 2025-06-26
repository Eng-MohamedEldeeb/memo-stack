FROM node:22.16.0

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

CMD ["npm" , "run"], "dev"