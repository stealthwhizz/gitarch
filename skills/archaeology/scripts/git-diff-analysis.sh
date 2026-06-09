#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
ref1=$(echo "$input" | jq -r '.ref1')
ref2=$(echo "$input" | jq -r '.ref2 // "HEAD"')
path=$(echo "$input" | jq -r '.path // ""')
stat=$(echo "$input" | jq -r '.stat // false')

# Run git diff between two refs
if [ "$stat" = "true" ]; then
    if [ -n "$path" ]; then
        git diff "$ref1" "$ref2" --stat -- "$path"
    else
        git diff "$ref1" "$ref2" --stat
    fi
else
    if [ -n "$path" ]; then
        git diff "$ref1" "$ref2" -- "$path"
    else
        git diff "$ref1" "$ref2"
    fi
fi
