# Build the Spring Boot jar, then run it on a small Java runtime image.
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
# Tests need a database, so they run in CI/locally rather than during the image build.
RUN mvn -B -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 wease
COPY --from=build /app/target/*.jar app.jar
USER wease
EXPOSE 8080
# Free hosting tiers have ~512 MB of memory; keep the JVM within it.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]