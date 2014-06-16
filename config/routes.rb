Church::Application.routes.draw do
  # SESSIONS
  post "/login" => "sessions#login"
  get "/logout" => "sessions#logout"
  post "/accessibility/:accessibility" => "application#accessibility"
  
  # ADMINISTRATION
  get "/admin" => "admin#admin"
  post "/news_articles/publish"
  resources :articles
  resources :contents
  resources :diaries
  resources :email_addresses
  resources :images
  resources :news_articles
  resources :notes
  resources :page_layouts
  resources :pages
  resources :panels
  resources :periodicals
  resources :users
  
  # NON-DEV ADMINISTRATION
  get "/admin/notes" => "admin#notes"
  get "/admin/note/:id" => "admin#note"
  get "/admin/prayers" => "admin#prayers"
  get "/admin/prayers/:date" => "admin#prayer"
  post "/admin/prayers/:date" => "admin#update_prayer"
  post "/admin/prayers/delete/:date" => "admin#destroy_prayer"
  
  # DESTROY FIX
  post "/articles/delete/:id" => "articles#destroy"
  post "/contents/delete/:id" => "contents#destroy"
  post "/diaries/delete/:id" => "diaries#destroy"
  post "/email_addresses/delete/:id" => "email_addresses#destroy"
  post "/images/delete/:id" => "images#destroy"
  post "/news_articles/delete/:id" => "news_articles#destroy"
  post "/notes/delete/:id" => "notes#destroy"
  post "/page_layouts/delete/:id" => "page_layouts#destroy"
  post "/pages/delete/:id" => "pages#destroy"
  post "/panels/delete/:id" => "panels#destroy"
  post "/periodicals/delete/:id" => "periodicals#destroy"
  post "/users/delete/:id" => "users#destroy"
  
  # CONTACT
  post "/contact" => "notes#contact"
  
  # PRELOADED PAGES
  get "/news" => "home#news"
  get "/ajax_news" => "home#ajax_news"
  get "/events/diary" => "home#diary"
  get "/ajax_diary" => "home#ajax_diary"
  
  # CUSTOM CONTENT
  get "/image/:id" => "home#image"
  get "/:link" => "home#page"
  get "/:link/:sub_link" => "home#page"
  
  root :to => "home#index"
end
