#!/bin/bash

LOG_FILE="./deploy-log-$(date '+%Y%m%d-%H%M%S').log"
APP_NAME="emsforge-backend"

echo "🚀 Starting EMSForge backend deployment..." | tee -a $LOG_FILE

# STEP 1: Move into backend directory
cd /home/emsforge/backend || {
  echo "❌ ERROR: Failed to cd into backend directory." | tee -a $LOG_FILE
  exit 1
}
echo "📁 Changed directory to $(pwd)" | tee -a $LOG_FILE

# STEP 2: Clean up
echo "🧹 Removing node_modules and package-lock.json..." | tee -a $LOG_FILE
rm -rf node_modules package-lock.json && echo "✅ Removed node_modules and lockfile" | tee -a $LOG_FILE

# STEP 3: Install packages
echo "📦 Running npm install (1st attempt)..." | tee -a $LOG_FILE
npm install 2>&1 | tee -a $LOG_FILE
INSTALL_EXIT_CODE=${PIPESTATUS[0]}

if [ $INSTALL_EXIT_CODE -ne 0 ]; then
  echo "⚠️ npm install failed. Retrying with --legacy-peer-deps..." | tee -a $LOG_FILE
  npm install --legacy-peer-deps 2>&1 | tee -a $LOG_FILE
  INSTALL_EXIT_CODE=${PIPESTATUS[0]}
  
  if [ $INSTALL_EXIT_CODE -ne 0 ]; then
    echo "❌ npm install failed again. Aborting deployment." | tee -a $LOG_FILE
    exit 1
  else
    echo "✅ Packages installed successfully with --legacy-peer-deps." | tee -a $LOG_FILE
  fi
else
  echo "✅ Packages installed successfully." | tee -a $LOG_FILE
fi

# STEP 3.5: Verify critical packages manually
echo "🔎 Verifying required dependencies (axios, express, mysql2)..." | tee -a $LOG_FILE
for pkg in axios express mysql2; do
  if [ ! -d "node_modules/$pkg" ]; then
    echo "📦 Missing $pkg. Installing separately..." | tee -a $LOG_FILE
    npm install "$pkg" 2>&1 | tee -a $LOG_FILE
  else
    echo "✅ $pkg is present." | tee -a $LOG_FILE
  fi
done

# STEP 4: Remove old PM2 process if it exists
echo "🧼 Cleaning up any existing PM2 process ($APP_NAME)..." | tee -a $LOG_FILE
pm2 delete "$APP_NAME" 2>/dev/null && echo "🗑️ Old process deleted." | tee -a $LOG_FILE

# STEP 5: Start backend
echo "🚦 Starting backend with PM2..." | tee -a $LOG_FILE
NODE_PATH=$(pwd)/node_modules pm2 start server.js --name "$APP_NAME" --update-env 2>&1 | tee -a $LOG_FILE
PM2_START_CODE=${PIPESTATUS[0]}

if [ $PM2_START_CODE -ne 0 ]; then
  echo "❌ PM2 failed to start the backend server." | tee -a $LOG_FILE
  exit 1
fi
echo "✅ PM2 started $APP_NAME" | tee -a $LOG_FILE

# STEP 6: Save PM2 process list
echo "💾 Saving PM2 process list..." | tee -a $LOG_FILE
pm2 save 2>&1 | tee -a $LOG_FILE

# STEP 7: Show PM2 process list
echo "📋 PM2 Process List:" | tee -a $LOG_FILE
pm2 list | tee -a $LOG_FILE

# STEP 8: Show live logs
echo "📈 Launching live PM2 logs..." | tee -a $LOG_FILE
pm2 logs "$APP_NAME" --lines 250
