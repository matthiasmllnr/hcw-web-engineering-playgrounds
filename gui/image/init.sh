#!/bin/bash

echo "Starting up ..."

cd /home/app

# #############################################################################
# Keep Angular and Packages up-to-date
#
echo "Updating dependencies..."
npm i
echo "Done."

# #############################################################################
# Start dev server
#
echo "Starting dev server..."
npm run-script -- ng serve --host 0.0.0.0 --port 4200
