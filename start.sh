#!/bin/bash
nohup node index.js > bot.log 2>&1 &
echo "JosieBot started. Logs are being written to bot.log"