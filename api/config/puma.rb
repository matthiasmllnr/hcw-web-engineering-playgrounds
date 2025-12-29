## Set the Rails environment
environment ENV.fetch("RAILS_ENV", "development")

## Single thread per worker (due to thread-unsafety)
threads_count = 1
threads threads_count, threads_count

## Use multiple workers for concurrency
## Rule of thumb: 1 worker per CPU core
workers ENV.fetch("WEB_CONCURRENCY") { Etc.nprocessors }

## Preload the app to take advantage of Copy-On-Write
preload_app!

## How long is a puma thread allowed to not respond to the puma main process before being killed?
worker_timeout ENV.fetch("PUMA_WORKER_TIMEOUT", 60).to_i ## seconds

## Bind to TCP if used standalone (with health checks, etc.)
port ENV.fetch("RAILS_PORT", 3000)

## Specifies the `pidfile` that Puma will use
pidfile ENV.fetch("PIDFILE", "tmp/pids/server.pid")

## Allow puma to be restarted by `bin/rails restart` command
plugin :tmp_restart