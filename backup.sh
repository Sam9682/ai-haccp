#!/bin/bash
# AI-HACCP Backup Script

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/ai_haccp_backup_$DATE.sql"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $BACKUP_FILE"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres ai_haccp > "$BACKUP_FILE"

if [[ $? -eq 0 ]]; then
    echo "Backup created successfully: $BACKUP_FILE"
    
    # Keep only last 7 backups
    ls -t "$BACKUP_DIR"/ai_haccp_backup_*.sql | tail -n +8 | xargs -r rm
    echo "Old backups cleaned up"
else
    echo "Backup failed!"
    exit 1
fi
