#!/usr/bin/env bash

# -----------------------------------------------------
# WARNING: This script removes any existing Postgres
# data directory at /opt/homebrew/var/postgresql@14,
# so you will lose all local databases there.
# Proceed with caution.
# -----------------------------------------------------

# Variables you can customize:
DB_NAME="jokes_api_db"
DB_USER="jokesuser"
DB_PASS="jokespassword"
DATA_DIR="/opt/homebrew/var/postgresql@14"
DATA_FILE="./official_joke_api-master/jokes/index.json" # Path to the jokes data file

echo "==> Stopping any running PostgreSQL services..."
brew services stop postgresql 2>/dev/null || true
brew services stop postgresql@14 2>/dev/null || true

echo "==> Uninstalling old PostgreSQL versions (if present)..."
brew uninstall postgresql --force 2>/dev/null || true
brew uninstall postgresql@14 --force 2>/dev/null || true

echo "==> Reinstalling PostgreSQL 14..."
brew update
brew reinstall postgresql@14

echo "==> Removing old data directory (destructive!)..."
rm -rf "$DATA_DIR"

echo "==> Initializing a fresh data directory with current user as superuser..."
# --encoding=utf8 ensures UTF-8 encoding
initdb "$DATA_DIR" --encoding=utf8

echo "==> Starting PostgreSQL 14 via Homebrew..."
brew services start postgresql@14

echo "==> Waiting a few seconds for the server to spin up..."
sleep 5

# -----------------------------------------------------
# Create your application user & database
# connecting to the default postgres database
# -----------------------------------------------------
echo "==> Creating user [$DB_USER]..."
psql -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" \
  | grep -q 1 || psql -d postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}' CREATEDB;"

echo "==> Dropping database [$DB_NAME] if it exists..."
psql -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"

echo "==> Creating database [$DB_NAME]..."
psql -d postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# -----------------------------------------------------
# Enable uuid-ossp extension
# -----------------------------------------------------
echo "==> Enabling uuid-ossp extension in [$DB_NAME]..."
psql -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# -----------------------------------------------------
# Create the jokes table
# -----------------------------------------------------
echo "==> Creating 'jokes' table (if not exists) in [$DB_NAME]..."
psql -U "${DB_USER}" -d "${DB_NAME}" -c "
CREATE TABLE IF NOT EXISTS jokes (
    id SERIAL PRIMARY KEY,
    joke_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    setup TEXT NOT NULL,
    punchline TEXT NOT NULL,
    rating FLOAT DEFAULT 0,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"

# -----------------------------------------------------
# Populate initial data from jokes/index.json
# -----------------------------------------------------
if [[ -f "$DATA_FILE" ]]; then
  echo "==> Populating initial data from [$DATA_FILE]..."
  while IFS= read -r line; do
    # Convert JSON line to SQL INSERT
    TYPE=$(echo "$line" | jq -r '.type')
    SETUP=$(echo "$line" | jq -r '.setup' | sed "s/'/''/g") # Escape single quotes
    PUNCHLINE=$(echo "$line" | jq -r '.punchline' | sed "s/'/''/g") # Escape single quotes

    psql -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO jokes (type, setup, punchline)
    VALUES ('$TYPE', '$SETUP', '$PUNCHLINE');
    " || echo "Failed to insert joke: $SETUP"
  done < <(jq -c '.[]' "$DATA_FILE")
else
  echo "Data file [$DATA_FILE] not found. Skipping initial data population."
fi

echo
echo "=============================================================="
echo "PostgreSQL 14 is now set up with:"
echo " - Data directory: $DATA_DIR"
echo " - SUPERUSER:      $USER"
echo " - DB user:        $DB_USER (password: $DB_PASS)"
echo " - DB name:        $DB_NAME"
echo " - 'jokes' table created and populated from jokes/index.json"
echo "=============================================================="
