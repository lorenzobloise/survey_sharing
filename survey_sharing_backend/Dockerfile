FROM alpine/java:18-jdk
RUN apk update && apk add --no-cache tzdata
ENV TZ=Europe/Rome
COPY ./target/survey_sharing_backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT java -jar backend.jar