@echo off
REM Run Spring Boot backend with reduced memory settings
echo Starting AgriZen Backend with optimized memory settings...
echo.

REM Set JVM memory options
set JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseSerialGC -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m

REM Run Spring Boot application
mvn spring-boot:run -Dspring-boot.run.jvmArguments="%JAVA_OPTS%"

pause

