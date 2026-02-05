# Build Stage
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Gradle files
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Download dependencies
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

# Copy source code
COPY src ./src

# Build application
RUN ./gradlew clean build -x test --no-daemon

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/build/libs/*.jar app.jar

# Create non-root user
RUN adduser -D -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]