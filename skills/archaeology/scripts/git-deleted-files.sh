#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
pattern=$(echo "$input" | jq -r '.pattern // ""')

# Find deleted files in git history
# Use --diff-filter=D to show only deletions
if [ -n "$pattern" ]; then
    git log --diff-filter=D --summary --format="%H %an %ae %ai" --grep="$pattern" 2>/dev/null | {
        while read line; do
            if [[ $line == create* ]]; then
                sha=$(echo "$line" | awk '{print $1}')
                file=$(echo "$line" | sed "s/.*delete mode .* //")
                echo "Deleted: $file"
                git show "$sha:$file" 2>/dev/null | head -20
                echo "---"
            fi
        done
    }
else
    # Show all deleted files
    git log --diff-filter=D --summary --oneline --pretty=format:"%h %an %ai" | head -20 || echo "No deleted files found"
fi
