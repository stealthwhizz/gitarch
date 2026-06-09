#!/bin/bash

# Save findings to memory after response
read -r context

# Extract findings from the context if provided
investigation_topic=$(echo "$context" | jq -r '.topic // "general"')

# Add an entry to memory if it's a significant finding
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# This is a placeholder - in a full implementation, the agent would 
# serialize findings and append them to memory/MEMORY.md
echo "[Post-Response] Findings from investigation on $investigation_topic recorded at $timestamp"

echo "{\"action\": \"allow\"}"
