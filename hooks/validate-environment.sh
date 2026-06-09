#!/bin/bash

# Validate environment setup on session start
echo "[Pre-Session] Checking environment..."

# Check if git is available
if ! command -v git > /dev/null 2>&1; then
    echo '{"action": "block", "reason": "git is not available on this system"}'
    exit 1
fi

# Check for API keys (at least one must be set)
if [ -z "$GOOGLE_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$OPENAI_API_KEY" ] && [ -z "$MISTRAL_API_KEY" ] && [ -z "$GROQ_API_KEY" ]; then
    echo '[Warning] No API key found. Set one of: GOOGLE_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, MISTRAL_API_KEY, GROQ_API_KEY'
fi

# Check if we're in a git repo
if [ -d ".git" ]; then
    echo "[Info] Working within a git repository"
fi

# Allow session to proceed
echo '{"action": "allow"}'

