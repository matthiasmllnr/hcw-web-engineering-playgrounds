#!/bin/bash
set -euo pipefail
## Load logging utilities
source /home/app/image/app/scripts/lib/logging.sh

log_info "Starting API (production)..."

## =========================
## Cleanup tmp/pids
## =========================

log_info "Purging tmp/pids directory..."
rm -rf tmp/pids

log_info "Creating tmp/pids directory..."
mkdir -p tmp/pids

## =========================
## Application Launch
## =========================

log_info "Starting puma app server..."
exec bundle exec rails server -b 0.0.0.0 -p "${RAILS_PORT:-3000}"