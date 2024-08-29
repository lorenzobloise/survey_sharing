FROM node:21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod
FROM nginx:alpine
RUN apk update && apk add tzdata
ENV TZ=Europe/Rome
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/survey-sharing-frontend /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
