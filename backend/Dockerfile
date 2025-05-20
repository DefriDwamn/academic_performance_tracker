FROM node:18-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Make start script executable
RUN chmod +x start.sh

CMD ["./start.sh"]