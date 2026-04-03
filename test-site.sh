#!/bin/bash
# test-site.sh
# This script builds the Quartz Docker image from the Quartz project directory 
# and runs it while mounting the local Obsidian project files over it.

CONFIG_FILE=".quartz-env"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ask for Quartz directory if config doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    echo "First time setup: Where is your base Quartz project directory located?"
    echo "Example: /home/netyeti/Projects/quartz"
    read -p "Quartz Directory: " QUARTZ_DIR
    echo "QUARTZ_DIR=\"$QUARTZ_DIR\"" > "$CONFIG_FILE"
    echo "Saved to $CONFIG_FILE"
fi

source "$CONFIG_FILE"

# Stop and remove any pre-existing container under this name
docker rm -f quartz-test-site 2>/dev/null

echo "Building Quartz Docker image..."
# Temporarily change directory to the quartz engine
cd "$QUARTZ_DIR" || { echo "Failed to find $QUARTZ_DIR"; exit 1; }
docker build -t quartz-local .

echo "Synchronizing Obsidian theme configurations..."
node "$PROJECT_DIR/.github/quartz/push-theme.cjs"

echo "Running Quartz tests..."
node "$PROJECT_DIR/scripts/verify-vault.js"
if [ $? -ne 0 ]; then
    echo "Error: Vault verification failed! Aborting server startup."
    cd - > /dev/null
    exit 1
fi

echo "Tests passed! Starting Quartz container locally on port 8080..."
# Map port 8080
# Mount the local vault over content
# Mount config, layout and custom.scss
docker run --name quartz-test-site -d -p 8080:8080 \
  -v "$PROJECT_DIR":/usr/src/app/content \
  -v "$PROJECT_DIR/.github/quartz/quartz.config.ts":/usr/src/app/quartz.config.ts \
  -v "$PROJECT_DIR/.github/quartz/quartz.layout.ts":/usr/src/app/quartz.layout.ts \
  -v "$PROJECT_DIR/.github/quartz/custom.scss":/usr/src/app/quartz/styles/custom.scss \
  quartz-local

echo ""
echo "Quartz container is now running!"
echo "View your site at: http://localhost:8080"
echo "To view live logs, run: docker logs -f quartz-test-site"
echo "To shut down the site, run: docker rm -f quartz-test-site"

# Return to the previous directory
cd - > /dev/null
