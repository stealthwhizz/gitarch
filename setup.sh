#!/bin/bash

# Git Archaeologist Installation & Setup

set -e

echo "🔍 Git Archaeologist - Setup Guide"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install git from https://git-scm.com/"
    exit 1
fi

echo "✅ Git $(git --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for API key
echo ""
echo "🔑 API Key Setup"
if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  No API key found in environment."
    echo ""
    echo "This agent requires an API key. Choose one:"
    echo ""
    echo "Option 1: OpenAI (gpt-4o)"
    echo "  Set: export OPENAI_API_KEY='sk-...'"
    echo "  Get key: https://platform.openai.com/api-keys"
    echo ""
    echo "Option 2: Anthropic (Claude)"
    echo "  Set: export ANTHROPIC_API_KEY='sk-ant-...'"
    echo "  Get key: https://console.anthropic.com/"
    echo ""
else
    if [ -n "$OPENAI_API_KEY" ]; then
        echo "✅ OpenAI API key configured"
    fi
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        echo "✅ Anthropic API key configured"
    fi
fi

# Check for GitHub token (optional)
echo ""
echo "🔐 GitHub Token (Optional)"
if [ -z "$GITHUB_TOKEN" ] && [ -z "$GIT_TOKEN" ]; then
    echo "⚠️  No GitHub token found."
    echo ""
    echo "For private repos, set:"
    echo "  export GITHUB_TOKEN='ghp_...'"
    echo ""
    echo "Get a token: https://github.com/settings/tokens"
    echo "Scope needed: 'repo' (full control of private repos)"
else
    echo "✅ GitHub token configured"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your API key (if not already set):"
echo "   export OPENAI_API_KEY='sk-...' or ANTHROPIC_API_KEY='sk-ant-...'"
echo ""
echo "2. Try your first investigation:"
echo "   node index.js 'Why does this module use callbacks?' --repo https://github.com/org/repo"
echo ""
echo "3. For more information, see README.md"
echo ""
