# PowerShell script to run Spring Boot backend with reduced memory settings
Write-Host "Starting AgriZen Backend with optimized memory settings..." -ForegroundColor Green
Write-Host ""

# Set JVM memory options
$env:JAVA_OPTS = "-Xmx512m -Xms256m -XX:+UseSerialGC -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m"

# Run Spring Boot application
mvn spring-boot:run -Dspring-boot.run.jvmArguments="$env:JAVA_OPTS"

