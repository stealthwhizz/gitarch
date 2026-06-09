#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
command=$(echo "$input" | jq -r '.command')
path=$(echo "$input" | jq -r '.path // ""')
since=$(echo "$input" | jq -r '.since // ""')
until=$(echo "$input" | jq -r '.until // ""')
author=$(echo "$input" | jq -r '.author // ""')
pattern=$(echo "$input" | jq -r '.pattern // ""')
format=$(echo "$input" | jq -r '.format // "raw"')

# Build the git command
git_cmd="git $command"

# Add optional filters
if [ -n "$path" ]; then
    git_cmd="$git_cmd -- $path"
fi

if [ -n "$since" ]; then
    git_cmd="$git_cmd --since='$since'"
fi

if [ -n "$until" ]; then
    git_cmd="$git_cmd --until='$until'"
fi

if [ -n "$author" ]; then
    git_cmd="$git_cmd --author='$author'"
fi

# Execute the command
if [ "$format" = "json" ]; then
    # Output in JSON format for log commands
    if [[ "$command" == "log"* ]]; then
        eval "$git_cmd" --format="%H%n%an%n%ae%n%ai%n%s%n%b%n---" | awk '
            BEGIN { 
                RS = "---" 
                FS = "\n"
                print "["
                first = 1
            }
            NF > 1 {
                if (!first) print ","
                first = 0
                gsub(/"/, "\\\"", $5)
                gsub(/"/, "\\\"", $6)
                print "{"
                print "  \"sha\": \"" substr($1, 1, 7) "\","
                print "  \"author\": \"" $2 " <" $3 ">\","
                print "  \"date\": \"" $4 "\","
                print "  \"message\": \"" $5 "\""
                print "}"
            }
            END { print "]" }
        '
    else
        eval "$git_cmd"
    fi
elif [ "$format" = "summary" ]; then
    # Summary format for better readability
    if [[ "$command" == "log"* ]]; then
        eval "$git_cmd" --format="%h %an %ad %s" --date=short
    else
        eval "$git_cmd"
    fi
else
    # Raw git output
    eval "$git_cmd"
fi
