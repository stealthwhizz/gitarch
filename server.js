#!/usr/bin/env node
import express from 'express';
import { query } from '@open-gitagent/gitagent';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On Windows the server process may not have sh on PATH, but GitAgent's cli
// tool always spawns via sh. Find Git's sh.exe and prepend it.
if (process.platform === 'win32') {
  const candidates = [
    'C:\\Program Files\\Git\\usr\\bin',
    'C:\\Program Files\\Git\\bin',
    'C:\\Program Files (x86)\\Git\\usr\\bin',
    'C:\\Program Files (x86)\\Git\\bin',
  ];
  for (const p of candidates) {
    if (fs.existsSync(path.join(p, 'sh.exe'))) {
      process.env.PATH = `${p};${process.env.PATH || ''}`;
      break;
    }
  }
}

// Load .env
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...parts] = trimmed.split('=');
        const value = parts.join('=').replace(/^["']|["']$/g, '');
        if (key && value && !process.env[key]) process.env[key] = value;
      }
    });
  }
} catch {}

// GitAgent routes Lyzr through pi-ai's OpenAI-compatible path: it sets
// model.provider="openai" and sends OPENAI_API_KEY as the Bearer token.
if (process.env.LYZR_API_KEY) {
  process.env.OPENAI_API_KEY = process.env.LYZR_API_KEY;
} else if (!process.env.OPENAI_API_KEY) {
  process.env.OPENAI_API_KEY = 'dummy';
}

function resolveModel() {
  if (process.env.GITAGENT_MODEL) return process.env.GITAGENT_MODEL;
  if (!process.env.LYZR_API_KEY) throw new Error('LYZR_API_KEY is not set in .env');
  if (!process.env.GITAGENT_LYZR_AGENT_ID) throw new Error('GITAGENT_LYZR_AGENT_ID is not set in .env');
  return `lyzr:${process.env.GITAGENT_LYZR_AGENT_ID}@https://agent-prod.studio.lyzr.ai/v4`;
}

// Clone target repo into a fresh temp directory so GitAgent never touches
// the server's own working tree.
function cloneToTemp(repoUrl) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitarch-'));
  const token  = process.env.GITHUB_TOKEN;
  const cloneUrl = token
    ? repoUrl.replace('https://', `https://${token}@`)
    : repoUrl;

  execFileSync('git', ['clone', '--depth=100', cloneUrl, '.'], {
    cwd: tmpDir,
    stdio: 'pipe',
    timeout: 90_000,
  });

  return tmpDir;
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/investigate', async (req, res) => {
  const { repo, question } = req.query;

  if (!repo || !question) {
    return res.status(400).json({ error: 'repo and question are required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (payload) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

  let tmpDir = null;

  try {
    // Clone into temp — GitAgent investigates the clone, not this directory
    send({ type: 'system', subtype: 'info', content: 'cloning repository...' });
    tmpDir = cloneToTemp(repo);

    // Tell the agent it is already inside the cloned repo so it starts
    // running git commands immediately rather than asking for a URL.
    const enrichedPrompt =
      `Repository ${repo} has been cloned to the current working directory.\n` +
      `Run git commands (log, blame, show, diff) against this directory to answer:\n\n` +
      question;

    const opts = {
      prompt: enrichedPrompt,
      model: resolveModel(),
      dir: tmpDir,
    };

    for await (const msg of query(opts)) {
      send(msg);
    }

    send({ type: 'done' });
  } catch (err) {
    send({ type: 'error', message: err.message });
  } finally {
    res.end();
    if (tmpDir) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Git Archaeologist UI → http://localhost:${PORT}\n`);
});
