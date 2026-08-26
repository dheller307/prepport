# Build JAR
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY src src

RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw package -DskipTests -B

# Run JRE only
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/prepport-backend-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
