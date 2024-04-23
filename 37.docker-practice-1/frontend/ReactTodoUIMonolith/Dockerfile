FROM node:16.13.0-alpine as builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html




