#!/bin/sh

if [ "$RUN_SEED" = "true" ]; then
  echo "Running database seed..."
  node seed.js
fi

echo "Starting server..."
npm start 