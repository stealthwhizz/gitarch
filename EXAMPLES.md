# Git Archaeologist - Examples

This directory contains example investigations that demonstrate how Git Archaeologist works.

## Running Examples

```bash
# Set your API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Run an example
node ../index.js "Example question here" --repo https://github.com/org/repo
```

## Example Questions

These are real questions you can ask Git Archaeologist:

### Architecture & Design

- "Why does this codebase use synchronous I/O instead of async/await?"
- "When was the MVC pattern introduced to this project?"
- "What was the original architecture before it was refactored?"
- "Why does this module avoid using external dependencies?"
- "How did the error handling strategy evolve over time?"

### Technology Choices

- "Why does the team use callbacks instead of promises?"
- "When was TypeScript adopted, and what prompted it?"
- "Why is a monolith instead of microservices?"
- "What alternatives were considered before choosing this framework?"
- "Why was this specific database chosen?"

### Code Patterns

- "Why is this function recursive instead of iterative?"
- "When was the Builder pattern introduced?"
- "What was the original way of handling authentication?"
- "Why are there two different approaches to logging?"
- "How did the caching strategy change over time?"

### Decision Context

- "Who made the decision to use this approach?"
- "What was happening in the project at the time this decision was made?"
- "Have previous attempts at this been tried?"
- "What trade-offs were made with this design?"
- "Why was the previous approach abandoned?"

### Author Patterns

- "How do this author's decisions differ from others?"
- "What patterns does this architect tend to favor?"
- "When did leadership change, and how did code patterns change?"

### Project Evolution

- "How has this module changed since project inception?"
- "What was the first version of this feature?"
- "When did the team shift from this pattern to another?"
- "Why was this entire module deleted and rebuilt?"

## Understanding Responses

Git Archaeologist responses include:

1. **Finding** — The main answer to your question
2. **Evidence** — Citations with:
   - Commit SHA (first 7 characters)
   - Author name and email
   - Commit date (ISO 8601)
   - Commit message excerpt
3. **Context** — Explanation of the decision, trade-offs, alternatives
4. **Timeline** — If applicable, how the decision evolved over time

## Tips for Better Questions

1. **Be Specific**
   - ❌ "Why is the code like this?"
   - ✅ "Why does the auth module avoid async/await?"

2. **Ask About Decisions, Not Implementation**
   - ❌ "How does this function work?"
   - ✅ "Why was recursion chosen over iteration here?"

3. **Provide Context**
   - ❌ "When was this added?"
   - ✅ "When was the caching layer added to the API?"

4. **Follow Up Naturally**
   - First: "Why was X chosen?"
   - Then: "Who made that decision?"
   - Then: "Has it been revisited since?"

## Sample Investigation

### Question
"Why does the Node.js core use callbacks instead of async/await in the event loop?"

### Process
1. Agent traces through the original Node.js commits
2. Finds the foundational decisions (Ryan Dahl, 2009)
3. Identifies when the architecture was set
4. Looks for any attempts to change it
5. Provides context about the era's technology landscape

### Response Would Include
- The original commit introducing callbacks
- Why async/await wasn't used (didn't exist yet)
- How the architecture evolved (libuv, worker threads)
- Trade-offs and design philosophy
- Timeline of architectural changes

## Exploring the Agent

Try these investigation paths:

### Path 1: Understand a Pattern
```bash
# Start broad
"What pattern is used for error handling?"

# Get specific
"Why does this module use try/catch?"

# Understand evolution
"When did this error handling pattern change?"

# Contextualize
"Who made the decision to switch error handling approaches?"
```

### Path 2: Trace a Decision
```bash
# Find the decision
"Why was this technology chosen?"

# Understand alternatives
"What other approaches were considered?"

# Check for evolution
"Has this technology choice been revisited?"

# Understand impact
"How did choosing this technology affect the codebase?"
```

### Path 3: Author Archaeology
```bash
# Find who decided
"Who introduced this architectural pattern?"

# See their other decisions
"What other key decisions did this author make?"

# Compare approaches
"How do this author's decisions compare to others?"
```

---

**Want to contribute examples?** Open a PR with your interesting investigations!
