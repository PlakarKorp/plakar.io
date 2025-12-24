FROM alpine:latest AS build

RUN apk add go git hugo

WORKDIR /opt/app

COPY . .

RUN hugo

FROM nginx

WORKDIR /usr/share/nginx/html

COPY --from=build /opt/app/public .

EXPOSE 80/tcp