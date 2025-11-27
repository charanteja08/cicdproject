#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Clean and build the application
mvn clean package -DskipTests -q

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    ls -la target/
else
    echo "Build failed!"
    exit 1
fi