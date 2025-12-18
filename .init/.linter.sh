#!/bin/bash
cd /tmp/kavia/workspace/code-generation/user-data-collection-4237-4249/user_data_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

