#!/bin/bash

# If a node_modules directory does not exist, run npm install
if [ ! -d "node_modules" ]; then
  npm install
fi

# If a dist directory does not exist, run gulp
if [ ! -d "dist" ]; then
  gulp
fi

# Run the nodemon server
nodemon ./app.js localhost 3000
