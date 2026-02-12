#!/bin/bash

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 main"
  echo "Example: $0 v1.1.0"
  exit 1
fi

VERSION=$1

for file in content/docs/${VERSION}/references/commands/*/index.md; do
  # Extract command name from path
  # e.g., content/docs/main/references/commands/plakar-cat/index.md -> plakar-cat
  command=$(basename $(dirname "$file"))

  # Check if alias already exists in front matter (between the --- delimiters)
  if ! sed -n '/^---$/,/^---$/p' "$file" | grep -q "^aliases:"; then
    # Insert alias after the summary line, before the closing ---
    sed -i '/^summary:/a\
aliases:\
  - /docs/'"${VERSION}"'/commands/'"$command"'/' "$file"
    echo "Added alias to $command"
  else
    echo "Skipped $command (alias already exists)"
  fi
done

echo "Finished processing ${VERSION} command files"
