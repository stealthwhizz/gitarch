---
name: archaeology
description: Investigate why code is the way it is through git history analysis
---

# Git Archaeology Skill

## Overview

This skill enables deep investigation of a codebase's history and decision-making. Use it to answer questions about why code is structured the way it is.

## When to Use This Skill

- "Why does the auth module avoid async/await?"
- "When was this pattern introduced and by whom?"
- "What code was deleted from this file and why?"
- "How has this module evolved over time?"
- "Which author made this critical architectural decision?"

## Investigation Workflow

### 1. **Initial Question Analysis**
Parse the question to understand what you're investigating:
- Is it about a specific file, module, or pattern?
- Is it about timing (when was it introduced)?
- Is it about authorship (who decided)?
- Is it about evolution (how did it change)?

### 2. **Blame Analysis**
Run `git-blame.sh` on relevant files to see:
- Who touched each line last
- When they touched it
- What the commit message says

### 3. **History Trace**
Use `git-log-analysis.sh` to:
- Find commits that introduced or modified the pattern
- Track the evolution across multiple commits
- Identify pivotal decisions

### 4. **Deleted Code Excavation**
Run `git-deleted-files.sh` to find:
- Code that was removed that might explain current patterns
- The commit messages explaining why code was deleted
- Related files that were refactored

### 5. **Commit Context**
Use `git-commit-context.sh` to extract:
- Full commit message (not just subject)
- Author and committer info
- Diff of the specific change
- Related commits

### 6. **Pattern Recognition**
Use `git-author-history.sh` to:
- See if authors have consistent decision patterns
- Identify when architectural changes happen
- Track learning or pattern evolution

### 7. **Memory Storage**
Save findings to memory/MEMORY.md:
- The original question
- The repository analyzed
- Key findings with full citations
- Patterns discovered
- Links to related findings

## Output Format

Always provide answers in this format:

```
## Investigation: [Question]

### Finding
[Main answer with explanation]

### Evidence
- [Citation 1]: <SHA> by <Author> on <Date>
- [Citation 2]: <SHA> by <Author> on <Date>

### Context
[Explanation of the decision, trade-offs, alternatives]

### Timeline
[If applicable, show how this evolved over time]
```

## Tools Used by This Skill

- `git-blame.sh` — Line-level attribution
- `git-log-analysis.sh` — Commit history patterns
- `git-deleted-files.sh` — Find deleted code
- `git-commit-context.sh` — Get full commit details
- `git-author-history.sh` — Author decision patterns

## Tips for Deep Investigation

1. **Follow the Chain**
   - Don't stop at the first commit
   - Trace backward to the original decision
   - Look for any refactorings or migrations

2. **Check for Deletions**
   - Code that was removed often explains why current code exists
   - Look at the deletion commit message for intent

3. **Look at Alternatives**
   - Check if different approaches existed in different branches
   - See if patterns changed in recent commits

4. **Consider Context**
   - Commits around the target often provide context
   - Look at other files changed in the same commit

5. **Interview the Code**
   - Commit messages are often the "why"
   - Author names might match documentation or issues
   - Dates might correlate with project milestones

## Example Investigation

**Question**: "Why does the auth module avoid async/await?"

**Process**:
1. Run `git-blame.sh` on auth module files
2. Find commits that chose callbacks or promises
3. Check those commits with `git-commit-context.sh`
4. Search for any refactoring that considered async/await
5. Look at author history for decision patterns
6. Check deleted files for abandoned async attempts
7. Store findings with full citations
8. Link to related decisions in memory

**Output** would show:
- The specific commit (with SHA, author, date)
- The reasoning in the commit message
- Historical context (was async/await available then?)
- Any alternatives considered
- How this evolved (if it changed later)
