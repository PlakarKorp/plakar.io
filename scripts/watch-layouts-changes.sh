#!/bin/bash

echo "🔁 Watching layouts... will trigger Hugo reload at most every 8s and only on real content changes"

WATCH_DIR="themes/plakarium/layouts"
TRIGGER_FILE="content/_dev-trigger.md"
last_trigger_time=0
last_hash=""

fswatch -e '.*~$' -e '/$' -r "$WATCH_DIR" | while read file; do
  now=$(date +%s)
  diff=$((now - last_trigger_time))

  # Skip directories
  [ -d "$file" ] && continue

  echo "📝 Modified file: $file"

  # Calculate new hash of the modified file
  if [ -f "$file" ]; then
    new_hash=$(sha1sum "$file" | awk '{print $1}')
  else
    new_hash=""
  fi

  if [ "$new_hash" == "$last_hash" ]; then
    echo "⚠️  Skipped reload — no real content change (same hash)"
    continue
  fi

  if [ $diff -ge 3 ]; then
    echo "<!-- dev-reload-${now} -->" > "$TRIGGER_FILE"
    echo "✅ Triggered reload via $TRIGGER_FILE at $(date +%T)"
    last_trigger_time=$now
    last_hash=$new_hash
  else
    echo "⏱ Skipped reload (last was $diff seconds ago)"
  fi
done
