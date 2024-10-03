#!/bin/bash
# Execute "bash update_site.sh" to run this script.

# Stop the service
echo "Stopping craftation-labs service..."
systemctl stop craftation-labs

# Reset and pull the latest code
echo "Resetting git repository..."
git reset --hard

echo "Pulling latest code from origin master..."
git pull origin master

# Build the project
echo "Building the project with yarn..."
yarn build

# Start the service
echo "Starting craftation-labs service..."
systemctl start craftation-labs

echo "Update completed successfully!"