#!/bin/bash
set -e

# Validate environment setup on session start
echo "[Pre-Session] Checking environment..."

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "{\"action\": \"block\", \"reason\": \"git is not available on this system\"}"
    exit 1
fi

# Check for GitHub token (optional but recommended for private repos)
if [ -z "$GITHUB_TOKEN" ] && [ -z "$GIT_TOKEN" ]; then
    echo "[Warning] No GitHub token found. Working with public repos only."
fi

# Check if we're in a git repo (if a target repo is provided)
if [ -d ".git" ]; then
    echo "[Info] Working within a git repository"
fi

# Allow session to proceed
echo "{\"action\": \"allow\"}"
