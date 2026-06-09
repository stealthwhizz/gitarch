#!/bin/bash

# Log tool usage for audit
read -r context
tool_name=$(echo "$context" | jq -r '.toolName // "unknown"')
tool_args=$(echo "$context" | jq -r '.args // {}')

# Log to audit file
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "[$timestamp] Tool: $tool_name | Args: $(echo "$tool_args" | jq -c .)" >> .gitagent/audit.log 2>/dev/null || true

# Allow all tool calls (pre-gating can be added here)
echo "{\"action\": \"allow\"}"
