# Build stage — usa uma imagem com Maven + JDK 21 já instalados, evitando o mvnw
# (mais rápido e sem os problemas de permissão de execução do wrapper).
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage — imagem enxuta, só com o JRE necessário para rodar o jar.
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
