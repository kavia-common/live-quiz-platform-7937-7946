#!/bin/bash
cd /home/kavia/workspace/code-generation/live-quiz-platform-7937-7946/quiz_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

