FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime", "server.js"]
