## =========================
## Base (shared)
## =========================

FROM ruby:3.4.8-slim AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Vienna

ENV APP_USER="app"
ENV HOME=/home/$APP_USER

ENV BUNDLE_PATH=$HOME/vendor/bundle
ENV BUNDLE_BIN=$HOME/vendor/bundle/bin
ENV GEM_HOME=$HOME/vendor/bundle
ENV PATH=$HOME/vendor/bundle/bin:$PATH

RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends \
  build-essential \
  tzdata \
  pkg-config \
  git \
  tini \
  curl \
  ca-certificates \
  libyaml-dev && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN groupadd --system --gid 1000 $APP_USER && \
  useradd $APP_USER --uid 1000 --gid 1000 --create-home --shell /bin/bash

WORKDIR $HOME

## Bundle install (cache-friendly)
COPY Gemfile Gemfile.lock ./
RUN gem update --system 3.6.8 && \
  gem install bundler --no-document -v 2.6.9 && \
  bundle config set path "$BUNDLE_PATH" && \
  bundle install

## Copy app
COPY . .

RUN chown -R $APP_USER:$APP_USER $HOME

## Make scripts executable
RUN chmod +x /home/app/image/app/entrypoint/init-dev.sh && \
  chmod +x /home/app/image/app/entrypoint/init-prod.sh

USER $APP_USER:$APP_USER

EXPOSE 3000

## =========================
## Development
## =========================

FROM base AS development
ENV RAILS_ENV=development
ENTRYPOINT ["/usr/bin/tini", "--", "/bin/bash", "/home/app/image/app/entrypoint/init-dev.sh"]


## =========================
## Production
## =========================

FROM base AS production
ENV RAILS_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--", "/bin/bash", "/home/app/image/app/entrypoint/init-prod.sh"]