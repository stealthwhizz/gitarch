# Git Archaeologist

**Dig through git history to understand *why* your codebase is the way it is.**

Git Archaeologist is an AI agent that answers questions about code decisions, not code functionality. It uses git history, commit messages, blame analysis, and deleted files to uncover the "why" behind architectural patterns, technology choices, and implementation decisions.

Built on [GitAgent](https://github.com/open-gitagent/gitagent) — a git-native agent framework where agents live as version-controlled repositories.

## Features

- 🔍 **Deep History Excavation** — Traces decisions through git blame, logs, and deleted files
- 📍 **Precise Citations** — Every answer cites the exact commit (SHA, author, date)
- 💾 **Persistent Memory** — Builds a cumulative history of architectural decisions
- 🌐 **Works with Any GitHub Repo** — Pass any public repo URL at runtime
- 🔐 **No Hardcoding** — All configuration via environment variables
- 🛠️ **Skill-Based Investigation** — Composable archaeology skills for different investigation types
- 📊 **Multi-Source Analysis** — Combines blame, logs, diffs, and author patterns

## Quick Start

### Installation

```bash
# Global CLI
npm install -g @open-gitagent/gitagent
git clone https://github.com/stealthwhizz/gitarch.git ~/git-arch

# From this repo
npm install
```

### Basic Usage

```bash
# Investigate a GitHub repository
export GITHUB_TOKEN="ghp_xxx"
node index.js "Why does the auth module avoid async/await?" \
  --repo https://github.com/nodejs/node

# Investigate a local repository
node index.js "When was this pattern introduced?" \
  --dir /path/to/repo
```

### Examples

```bash
# Question about a design decision
git-arch "Why was synchronous I/O chosen here?" \
  --repo https://github.com/org/repo

# Question about authorship
git-arch "Who made the decision to use this pattern?" \
  --repo https://github.com/org/repo

# Question about evolution
git-arch "How has error handling changed over time?" \
  --repo https://github.com/org/repo

# Question about deleted code
git-arch "What was the original implementation of the auth module?" \
  --repo https://github.com/org/repo
```

## Architecture

This agent follows GitAgent's architecture:

```
gitarch/
├── agent.yaml              # Agent manifest (model, tools, runtime)
├── SOUL.md                 # Agent identity & philosophy
├── RULES.md                # Behavioral constraints & citation rules
├── skills/
│   └── archaeology/
│       ├── SKILL.md        # Archaeology skill instructions
│       └── scripts/        # Investigation shell scripts
├── tools/
│   ├── git-query.yaml      # Query git history
│   ├── git-diff-analysis.yaml  # Analyze changes
│   └── memory-search.yaml  # Search past findings
├── memory/
│   └── MEMORY.md           # Git-committed investigation findings
├── hooks/                  # Lifecycle hooks (validation, memory save)
├── index.js                # CLI entry point
└── package.json
```

### Key Files

- **SOUL.md** — Defines the agent's philosophy (precise, evidence-based, thorough)
- **RULES.md** — Citation rules and investigation protocols
- **skills/archaeology/SKILL.md** — How to conduct historical investigations
- **memory/MEMORY.md** — Cumulative findings from all investigations
- **agent.yaml** — Runtime configuration (preferred model, tools, timeouts)

## How It Works

1. **Question Parsing** — Understands what aspect of history you're asking about
2. **Investigation Strategy** — Determines which git tools to use (blame, log, deleted files)
3. **Evidence Collection** — Traces through commits, authors, and deleted code
4. **Citation Building** — Every finding includes SHA, author, and date
5. **Memory Storage** — Saves findings to memory for cross-session context
6. **Response** — Explains the decision in human terms with full archaeological backing

## Configuration

### Environment Variables

```bash
GITHUB_TOKEN          # GitHub personal access token (for private repos)
GIT_TOKEN            # Alternative name for GITHUB_TOKEN
GITAGENT_MODEL       # Override default model (default: anthropic:claude-sonnet-4-5-20250929)
OPENAI_API_KEY       # OpenAI API key (for gpt-4o models)
ANTHROPIC_API_KEY    # Anthropic API key (for Claude models)
DEBUG                # Enable debug output
```

### agent.yaml

```yaml
model:
  preferred: "anthropic:claude-sonnet-4-5-20250929"
  fallback: ["openai:gpt-4o"]
  constraints:
    temperature: 0.3          # Low temp for precise, factual responses
    max_tokens: 8000

tools: [cli, read, write, memory]    # Built-in GitAgent tools
skills: [archaeology]                # Our custom archaeology skill

runtime:
  max_turns: 30                # Max conversation turns
  timeout: 180                 # 3-minute timeout per query
```

## Investigation Techniques

The agent uses these git-based techniques:

### 1. Blame Analysis
Traces who touched each line and when:
```bash
git blame -L start,end filepath
```

### 2. History Tracing
Finds commits related to a keyword:
```bash
git log --grep="keyword" --format="%h %an %ai %s"
```

### 3. Deleted Code Excavation
Finds deleted files and why they were removed:
```bash
git log --diff-filter=D --summary
```

### 4. Commit Context
Gets full commit details including the "why":
```bash
git show --format=fuller <sha>
```

### 5. Author Patterns
Tracks decision patterns by author:
```bash
git log --author="name" --format="%h %ai %s"
```

### 6. Evolution Tracking
Compares code across time periods to show evolution.

## Skills

### Archaeology Skill

The core skill for historical investigation:

```bash
/skill:archaeology "Investigate the async/await decision in auth module"
```

The skill orchestrates multiple investigation techniques and synthesizes findings into a narrative.

## Memory System

Findings are stored in git-committed memory, creating a persistent knowledge base:

```markdown
## Investigation: Why does the auth module avoid async/await?

- **Repository**: https://github.com/nodejs/node
- **Date**: 2024-06-09T12:00:00Z

### Findings
1. **Decision Commit**
   - **Citation**: `3a7f9c2` by Sarah Patel on 2021-03-15
   - **Evidence**: "Chose callbacks for better error handling in async contexts"

### Patterns Discovered
- Consistent use of callbacks in early modules
- Gradual migration to async/await in newer modules
```

Memory enables:
- **Cross-Session Learning** — Findings from one investigation inform future queries
- **Pattern Recognition** — Identifying repeated architectural decisions
- **Author Tracking** — Understanding individual decision patterns over time

## Requirements

- **Node.js** 18+
- **git** installed
- **GitHub Token** (for private repos) — set via `GITHUB_TOKEN` env var
- **API Key** — For your chosen model provider:
  - `OPENAI_API_KEY` for OpenAI models
  - `ANTHROPIC_API_KEY` for Claude models

## Examples in Action

### Example 1: Understanding a Design Decision

```bash
$ git-arch "Why does Node.js use single-threaded event loop?" \
  --repo https://github.com/nodejs/node

🔍 Git Archaeologist starting...
📦 Repository: https://github.com/nodejs/node
❓ Question: "Why does Node.js use single-threaded event loop?"

============================================================

[Investigation underway...]

The single-threaded design was a fundamental architectural choice made
in Node.js's early development:

**Initial Decision**
- **Citation**: `6c1a4c2` by Ryan Dahl on 2009-05-27
- **Commit Message**: "Start with single-threaded event loop architecture"
- **Context**: Inspired by Nginx, designed for high-concurrency with low overhead

**Evolution**
Over time, the architecture evolved:
- **2012-11**: libuv abstraction added (`c3f2a1e` by Ben Noordhuis)
- **2014-03**: Thread pool for file I/O (`7e8f3a2` by Fedor Indutny)
- **2015-06**: Better worker thread support (`5b9d2c1` by Yosuke Furukawa)

**Trade-offs**
The choice enabled:
✓ Simpler mental model for developers
✓ Lower overhead per connection
✓ Elegant callback-based concurrency
✗ CPU-bound tasks block the event loop
✗ Requires careful async/await discipline

**Pattern**: This decision reflects a philosophy of simplicity-first,
with escape hatches (thread pool) added for specific use cases rather than
making threading first-class.

============================= ==============================

✅ Investigation complete.
```

### Example 2: Finding Deleted Code

```bash
$ git-arch "What was deleted from the original auth module?" \
  --repo https://github.com/org/myproject

🔍 Searching for deleted files...

**Deleted: auth/legacy-oauth.js**
- **Deleted in**: `9f8e7d6` by Alex Chen on 2023-11-20
- **Deletion Message**: "Remove legacy OAuth 1.0 support, migrate to OAuth 2.0"
- **Original Author**: `2c3d4e5` by Sam Rivera on 2019-07-15

The original OAuth 1.0 implementation was replaced because:
1. OAuth 2.0 is now the standard
2. Reduced maintenance burden
3. Better security posture
```

## Development

### Adding New Investigation Skills

Create a new skill in `skills/your-skill/`:

```
skills/your-skill/
├── SKILL.md          # Skill documentation
└── scripts/
    └── investigation.sh
```

### Adding Investigation Tools

Define tools in `tools/`:

```yaml
name: your-tool
description: What this tool does
input_schema:
  properties:
    param: { type: string }
  required: [param]
implementation:
  script: scripts/your-tool.sh
  runtime: sh
```

### Testing

The agent works with any git repository. Test locally:

```bash
node index.js "Test question" --dir /path/to/test/repo
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with descriptive messages
5. Push and open a PR

## License

MIT © 2024 stealthwhizz

## Resources

- [GitAgent Framework](https://github.com/open-gitagent/gitagent)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub API](https://docs.github.com/en/rest)

## Roadmap

- [ ] Web UI for investigation browsing
- [ ] Integration with GitHub Issues for archaeological comments
- [ ] Machine learning for pattern detection
- [ ] Export findings as documentation
- [ ] Collaborate on investigation (multi-agent)
- [ ] Rebase/merge decision analysis

---

**Built with curiosity about code history.**
