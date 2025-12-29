#!/bin/bash
set -euo pipefail
## Load logging utilities
source /home/app/image/app/scripts/lib/logging.sh

## =========================
## Ruby Gems Installation
## =========================

# Make sure gems are present (dev convenience)
if ! bundle check >/dev/null 2>&1; then
  log_info "Bundle not satisfied. Installing gems…"
  bundle install
fi

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

if [[ "${RAILS_DEV_ONLY_BOOT_PUMA_SERVER}" == "false" ]]; then
  log_info "RAILS_DEV_ONLY_BOOT_PUMA_SERVER == false => You must manually start the Rails server inside the container."
  log_info "Use: doex playgrounds-api => server-start-dev.sh (globally available in /usr/local/bin)"
  ## Keep the container running
  tail -f /dev/null
else
  log_info "Starting puma app server..."
  bundle exec rails server -b 0.0.0.0 -p $RAILS_PORT
fi