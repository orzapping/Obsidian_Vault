#!/bin/bash

# Sync GOLDEN-SOURCE from /srv/prism-shared to Obsidian vault
# Run this periodically to keep documentation in sync

SOURCE="/srv/prism-shared/GOLDEN-SOURCE"
DEST="/home/obsidan/Documents/Obsidian Vault/02-Projects/PRISM/GOLDEN-SOURCE"

echo "Syncing GOLDEN-SOURCE documentation..."
echo "From: $SOURCE"
echo "To: $DEST"

# Use rsync to sync files (preserves timestamps, only copies changed files)
rsync -av --delete "$SOURCE/" "$DEST/"

echo "Sync complete!"
echo "Files synced at: $(date)"