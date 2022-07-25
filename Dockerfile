FROM node:16.13.0 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./
COPY .env ./

# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:16.13.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

EXPOSE 4000

CMD ["yarn", "start:prod"]
