source 'http://rubygems.org'
ruby '2.4.1'

gem 'rails'
gem 'jquery-rails'

# PostgreSQL database and activerecord querying
group :production do
  gem "pg"
end
gem 'activerecord'
gem 'activerecord-session_store'

# Encryption
gem 'aes'

# XML
gem 'nokogiri'
gem 'nori'

# Pagination
gem 'kaminari'

# Gems used only for assets and not required in production environments by default
group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'
end

# Use mysql2 for local development
group :development do
  gem 'mysql2'
end

group :test do
  # Pretty printed test output
  gem 'turn', :require => false
end
