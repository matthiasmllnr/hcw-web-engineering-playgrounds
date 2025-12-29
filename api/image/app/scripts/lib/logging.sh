#!/usr/bin/env bash

## make the script robust for production usage:
##
## set -e: if any command returns a non-zero exit code, the script immediately exits
## set -u: if an undefined variable is referenced, Bash will exit with an error
## set -o pipefail: normally, in a pipeline like cmd1 | cmd2 | cmd3, Bash only checks the last command’s exit code. With pipefail, if any command fails, the whole pipeline fails
set -euo pipefail

## automatically resolves the current file name
SCRIPT_NAME="[${0##*/}]"

# =========================
# Color Setup (auto-disable in CI/non-TTY)
# =========================

if [[ -t 1 ]]; then
  COLOR_RESET="\033[0m"
  COLOR_INFO="\033[1;34m"    ## blue
  COLOR_WARNING="\033[1;33m" ## yellow
  COLOR_ERROR="\033[1;31m"   ## red
else
  COLOR_RESET=""
  COLOR_INFO=""
  COLOR_WARNING=""
  COLOR_ERROR=""
fi

# =========================
# Logging Functions
# =========================

log_info() {
  local ts
  ts=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "${COLOR_INFO}${ts} ${SCRIPT_NAME} [INFO]${COLOR_RESET} $*"
}

log_warning() {
  local ts
  ts=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "${COLOR_WARNING}${ts} ${SCRIPT_NAME} [WARNING]${COLOR_RESET} $*" >&2
}

log_error() {
  local ts
  ts=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "${COLOR_ERROR}${ts} ${SCRIPT_NAME} [ERROR]${COLOR_RESET} $*" >&2
}