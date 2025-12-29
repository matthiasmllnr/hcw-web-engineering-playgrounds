## =========================
## Require: SERVICES
## =========================

Dir[Rails.root.join('services', '**', '*.rb')].each { |f| 
  require f 
}
