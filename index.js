#!/usr/bin/env node

/**
 * Git Archaeologist - CLI Entry Point
 * 
 * Usage:
 *   npx git-arch "Why does the auth module avoid async/await?" --repo https://github.com/org/repo
 *   GITHUB_TOKEN=ghp_xxx npx git-arch "Question" --repo https://github.com/org/repo
 *   npx git-arch "Question" --dir /path/to/repo
 * 
 * Required environment variables:
 *   LYZR_API_KEY              - Lyzr API key
 *   GITAGENT_LYZR_AGENT_ID    - Lyzr agent ID
 *
 * Optional:
 *   GITHUB_TOKEN     - GitHub personal access token (for private repos)
 *   GITAGENT_MODEL   - Override the model string (default: built from Lyzr env vars)
 *   DEBUG            - Enable debug output
 *
 * .env file support:
 *   Create a .env file from .env.example (git-ignored for security)
 */

import { query } from '@open-gitagent/gitagent';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

// Load .env file if it exists
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (err) {
  // Silently ignore .env loading errors
}

// GitAgent routes Lyzr through pi-ai's OpenAI-compatible path: it sets
// model.provider="openai" and sends OPENAI_API_KEY as the Bearer token.
// So OPENAI_API_KEY must be the real Lyzr key — not "dummy" — for auth to work.
if (process.env.LYZR_API_KEY) {
  process.env.OPENAI_API_KEY = process.env.LYZR_API_KEY;
} else if (!process.env.OPENAI_API_KEY) {
  process.env.OPENAI_API_KEY = 'dummy';
}

// Build the active model string from environment variables.
// Priority: explicit GITAGENT_MODEL override > Lyzr credentials > error
function resolveModel() {
  if (process.env.GITAGENT_MODEL) {
    return process.env.GITAGENT_MODEL;
  }

  if (!process.env.LYZR_API_KEY) {
    console.error('❌ LYZR_API_KEY is not set. Copy .env.example to .env and fill in your Lyzr credentials.');
    process.exit(1);
  }

  const agentId = process.env.GITAGENT_LYZR_AGENT_ID;
  if (!agentId) {
    console.error('❌ GITAGENT_LYZR_AGENT_ID is not set. Add it to your .env file.');
    process.exit(1);
  }

  return `lyzr:${agentId}@https://agent-prod.studio.lyzr.ai/v4`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command-line arguments
const args = process.argv.slice(2);
let prompt = '';
let repoUrl = null;
let localDir = process.cwd();
let githubToken = null;

// Parse flags and options
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--repo' || arg === '-r') {
    repoUrl = args[i + 1];
    i++;
  } else if (arg === '--dir' || arg === '-d') {
    localDir = args[i + 1];
    i++;
  } else if (arg === '--pat') {
    githubToken = args[i + 1];
    i++;
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else if (!prompt && !arg.startsWith('--') && !arg.startsWith('-')) {
    prompt = arg;
  }
}

// If no prompt provided, show help
if (!prompt) {
  printHelp();
  process.exit(1);
}

// Get GitHub token from environment if not provided via CLI
if (!githubToken) {
  githubToken = process.env.GITHUB_TOKEN || process.env.GIT_TOKEN;
}

// Main execution
async function main() {
  try {
    console.log('🔍 Git Archaeologist starting...\n');
    
    // Setup query options
    const queryOptions = {
      prompt,
      dir: localDir,
      model: resolveModel(),
    };
    
    // Debug: Show which API key is being used
    if (process.env.DEBUG) {
      console.log(`[DEBUG] Model: ${queryOptions.model}`);
      console.log(`[DEBUG] LYZR_API_KEY: ${process.env.LYZR_API_KEY ? '✓' : '✗'}`);
      console.log(`[DEBUG] GITAGENT_LYZR_AGENT_ID: ${process.env.GITAGENT_LYZR_AGENT_ID ? '✓' : '✗'}`);
      console.log(`[DEBUG] GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? '✓' : '✗'}`);
    }

    // If a repo URL is provided, use local repo mode
    if (repoUrl) {
      if (!githubToken) {
        console.warn('⚠️  Warning: No GitHub token provided. Limited to public repos.');
        console.warn('   Set GITHUB_TOKEN or GIT_TOKEN environment variable, or use --pat flag.\n');
      }

      queryOptions.repo = {
        url: repoUrl,
        token: githubToken,
      };
      
      console.log(`📦 Repository: ${repoUrl}`);
    } else {
      console.log(`📁 Local directory: ${localDir}`);
    }
    
    console.log(`❓ Question: "${prompt}"\n`);
    console.log('=' .repeat(60));
    console.log();

    // Run the query
    let fullResponse = '';
    for await (const msg of query(queryOptions)) {
      switch (msg.type) {
        case 'delta':
          // Stream response text
          process.stdout.write(msg.content);
          fullResponse += msg.content;
          break;

        case 'assistant':
          // End of response
          console.log('\n');
          if (msg.usage) {
            console.log(`\n📊 Tokens used: ${msg.usage.totalTokens || 'unknown'}`);
          }
          break;

        case 'tool_use':
          // Tool invocation
          console.log(`\n🔧 Using tool: ${msg.toolName}`);
          break;

        case 'tool_result':
          // Tool result (verbose output omitted for cleanliness)
          if (msg.isError) {
            console.error(`❌ Tool error: ${msg.content}`);
          }
          break;

        case 'system':
          // System messages (errors, events)
          if (msg.subtype === 'error') {
            console.error(`\n❌ System error: ${msg.content}`);
          } else if (process.env.DEBUG) {
            console.log(`[${msg.subtype}] ${msg.content}`);
          }
          break;

        case 'user':
          // User messages in multi-turn
          console.log(`\n👤 User: ${msg.content}`);
          break;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Investigation complete.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Git Archaeologist - Dig through git history to understand why code is the way it is

USAGE
  git-arch <question> [OPTIONS]

QUESTIONS
  "Why does the auth module avoid async/await?"
  "When was this pattern introduced?"
  "Who made the decision to use this approach?"
  "How has this module evolved over time?"

OPTIONS
  -r, --repo <url>      GitHub repository URL (clones and works on session branch)
  -d, --dir <path>      Local directory containing agent (default: current directory)
  --pat <token>         GitHub personal access token (or set GITHUB_TOKEN env var)
  -h, --help            Show this help message

ENVIRONMENT VARIABLES
  LYZR_API_KEY              Lyzr API key (required)
  GITAGENT_LYZR_AGENT_ID    Lyzr agent ID (required)
  GITHUB_TOKEN              GitHub personal access token (for private repos)
  GITAGENT_MODEL            Override the full model string
  DEBUG                     Enable debug output

EXAMPLES
  # Investigate a GitHub repo
  git-arch "Why avoid async/await?" --repo https://github.com/org/repo

  # Investigate local directory
  git-arch "When was this introduced?" --dir /path/to/repo

  # Use a specific GitHub token
  git-arch "Question" --repo https://github.com/org/repo --pat ghp_xxxxx

  # Override model (advanced)
  GITAGENT_MODEL="lyzr:other-agent-id@https://agent-prod.studio.lyzr.ai/v4" git-arch "Question" --repo <url>

REQUIREMENTS
  - Node.js 18+
  - git installed
  - LYZR_API_KEY and GITAGENT_LYZR_AGENT_ID set in .env

For more info, visit: https://github.com/stealthwhizz/gitarch
  `);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
