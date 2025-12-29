#!/bin/bash
set -e

## Load logging utilities
source /home/app/image/app/scripts/lib/logging.sh

log_info "Starting puma app server..."
  bundle exec rails server -b 0.0.0.0 -p $RAILS_PORT