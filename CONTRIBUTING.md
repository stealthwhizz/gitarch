# Contributing to Git Archaeologist

Thank you for your interest in contributing! This agent is built to evolve through community contributions.

## Project Philosophy

Git Archaeologist is driven by these principles:

1. **Evidence Over Speculation** — All findings must be backed by git history
2. **Precision** — Cite exact commits, authors, and dates
3. **Composability** — Skills and tools should be modular and reusable
4. **Transparency** — Explain investigation processes clearly
5. **Memory** — Build cumulative knowledge across investigations

## How to Contribute

### 1. Adding Investigation Skills

Skills are in `skills/`. To add a new skill:

1. Create `skills/your-skill/SKILL.md` with:
   - Skill name and description
   - When to use it
   - Investigation workflow
   - Output format

2. Create shell scripts in `skills/your-skill/scripts/`:
   ```bash
   scripts/my-investigation.sh
   ```

3. Register in `agent.yaml`:
   ```yaml
   skills: [archaeology, your-skill]
   ```

### 2. Adding Investigation Tools

Tools are in `tools/`. To add a new tool:

1. Create `tools/my-tool.yaml`:
   ```yaml
   name: my-tool
   description: What this does
   input_schema:
     properties:
       param: { type: string }
     required: [param]
   implementation:
     script: scripts/my-tool.sh
     runtime: sh
   ```

2. Create the implementation script:
   ```bash
   scripts/my-tool.sh
   ```

3. The script receives JSON on stdin and outputs results

### 3. Improving Memory Storage

The memory system lives in `memory/MEMORY.md`. To improve it:

1. Enhance the template in `memory/MEMORY.md`
2. Improve indexing strategies
3. Add cross-referencing mechanisms

### 4. Enhancing the CLI

The CLI is `index.js`. Enhancements might include:

- Better output formatting
- Session management
- Result exporting
- Interactive mode improvements

### 5. Adding Examples

Create detailed examples that demonstrate investigation capabilities. Examples should:

- Show the question asked
- Demonstrate findings with citations
- Explain decision context
- Highlight patterns discovered

## Development Workflow

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make changes** following the philosophy above
4. **Test locally**:
   ```bash
   node index.js "Test question" --dir /path/to/repo
   ```
5. **Commit** with clear messages:
   ```bash
   git commit -m "Add: new investigation skill for authentication patterns"
   ```
6. **Push** and **open a PR** with:
   - Clear description of changes
   - Why this improves the agent
   - Example usage if applicable

## Code Style

- **Shell scripts**: Follow POSIX standards, use `set -e` for safety
- **JavaScript**: Use clear, descriptive variable names
- **Documentation**: Use Markdown, keep it accessible to non-developers

## Adding Dependencies

If you need new dependencies:

1. **Consider alternatives first** — Does GitAgent already provide this?
2. **Keep it minimal** — Each dependency adds size and complexity
3. **Update package.json** with clear justification in your PR

Avoid adding dependencies unless absolutely necessary.

## Testing Your Changes

### Local Testing

```bash
# Test with a local repo
node index.js "Your test question" --dir /path/to/test/repo

# Test with GitHub repo
GITHUB_TOKEN=ghp_xxx node index.js "Question" --repo https://github.com/org/repo
```

### Testing Shell Scripts

Shell scripts should be tested independently:

```bash
# Test a git query script
echo '{"command":"log","limit":10}' | bash skills/archaeology/scripts/git-query.sh
```

## Reporting Issues

When reporting issues:

1. **Be specific** — What question were you asking?
2. **Show output** — Include the agent's response and error messages
3. **Provide repo** — Link to the repo you were investigating (if possible)
4. **Suggest investigation** — What should the agent have found?

## Questions?

- Open an issue for feature requests or bugs
- Start a discussion for architectural questions
- Reference the GitAgent docs for framework questions

Thank you for contributing! 🔍
