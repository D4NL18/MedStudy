# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
# Copy the Maven wrapper and POM first to cache dependencies
COPY mvnw .
RUN chmod +x mvnw
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code and build
COPY src src
RUN ./mvnw package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy only the compiled JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Environment variables for production and memory limits
ENV SPRING_PROFILES_ACTIVE=prod
# Limiting memory helps prevent exceeding Cloud Run's container limits
ENV JAVA_OPTS="-Xmx256m -Xms128m"

# Command to run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
