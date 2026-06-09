#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
author=$(echo "$input" | jq -r '.author')
limit=$(echo "$input" | jq -r '.limit // 30')

# Show all commits by an author with dates and messages
git log --author="$author" -n "$limit" --format="%h %ai %s" 2>/dev/null | {
    awk '{
        print "SHA: " $1 " | Date: " $2 " " $3 " | Message: " substr($0, index($0, $4))
    }'
} || echo "No commits found by author: $author"
