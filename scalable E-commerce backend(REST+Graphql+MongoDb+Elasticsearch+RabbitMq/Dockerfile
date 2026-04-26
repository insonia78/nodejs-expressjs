FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG SERVICE_PATH
ENV SERVICE_PATH=${SERVICE_PATH}

EXPOSE 4000

CMD ["sh", "-c", "npx tsx ${SERVICE_PATH}"]