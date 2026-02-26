FROM alpine:latest AS build

RUN apk add go git hugo npm

WORKDIR /opt/app

COPY . .

RUN hugo
RUN npm run pagefind:index

FROM nginx

WORKDIR /usr/share/nginx/html

COPY --from=build /opt/app/public .

EXPOSE 80/tcp