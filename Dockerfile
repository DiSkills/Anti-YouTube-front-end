FROM node

WORKDIR /app/frontend
COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
