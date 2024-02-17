FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g prisma
RUN npm run install-dependencies

EXPOSE 4000

CMD [ "npm", "run", "docker-app" ]
