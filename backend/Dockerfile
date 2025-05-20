FROM node:18-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Create a startup script
RUN echo '#!/bin/sh\n\
if [ "$RUN_SEED" = "true" ]; then\n\
  echo "Running database seed..."\n\
  node seed.js\n\
fi\n\
echo "Starting server..."\n\
npm start' > /api/start.sh && chmod +x /api/start.sh

CMD ["/api/start.sh"]