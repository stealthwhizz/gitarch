# Git Archaeologist Memory

This file stores all findings from investigations, built up over multiple sessions. It serves as a cumulative history of the codebase's decision-making and architectural evolution.

## Investigation Findings

### Template for New Findings

```markdown
## Investigation: [Question Asked]

- **Repository**: [URL]
- **Date**: [ISO 8601 timestamp]
- **Investigator**: [User/Session ID]

### Question
[Original question asked]

### Findings

1. **Main Finding**
   - **Citation**: `[SHA]` by [Author] on [Date]
   - **Evidence**: [Commit message or relevant diff]
   - **Context**: [Explanation]

2. **Related Finding**
   - **Citation**: `[SHA]` by [Author] on [Date]
   - **Evidence**: [What this shows]
   - **Timeline**: [How this relates to main finding]

### Patterns Discovered
- [Pattern 1]
- [Pattern 2]

### Related Previous Findings
- [Link to previous finding]

---
```

## Index by Repository

This section groups findings by repository for quick access.

### Repository: [URL]
- Investigation 1
- Investigation 2

## Index by Pattern

This section groups findings by architectural or code patterns.

### Pattern: [Pattern Name]
- Finding 1
- Finding 2

## Index by Author

This section tracks decision patterns by author.

### Author: [Name]
- Notable decisions
- Decision patterns
- Time period active

## Notes

- All timestamps are in ISO 8601 format
- All citations include commit SHA (first 7 chars)
- All findings reference the investigation question
- Cross-references are maintained when findings relate
