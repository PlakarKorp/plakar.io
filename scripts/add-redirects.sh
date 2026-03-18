# !/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 main"
  echo "Example: $0 v1.1.0"
  exit 1
fi

VERSION=$1

for file in ../content/docs/${VERSION}/references/commands/*.md; do
  command=$(basename "$file" .md)
  [ "$command" = "_index" ] && continue
  if ! sed -n '/^---$/,/^---$/p' "$file" | grep -q "^aliases:"; then
    sed -i '/^summary:/a\
aliases:\
  - /docs/'"${VERSION}"'/commands/'"$command"'/' "$file"
    echo "Added alias to $command"
  else
    echo "Skipped $command (alias already exists)"
  fi
done

echo "Finished processing ${VERSION} command files"
