Church::Application.routes.draw do
  # SESSIONS
  post "/login" => "sessions#login"
  get "/logout" => "sessions#logout"
  post "/accessibility/:accessibility" => "application#accessibility"
  
  # ADMINISTRATION
  get "/admin" => "admin#admin"
	get "/admin/wysiwyg_images" => "admin#wysiwyg_images"
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
  
  get "/admin/pages" => "admin#pages"
  post "/admin/publish_page/:page_id" => "admin#publish_page"
  get "/admin/pages/:page_id" => "admin#panels"
  get "/admin/pages/:page_id/:panel_id" => "admin#panel"
  post "/admin/pages/:page_id/:panel_id" => "admin#update_panel"
  
  get "/admin/diary" => "admin#diary"
  get "/admin/diary/new" => "admin#new_diary"
  get "/admin/diary/edit/:id" => "admin#edit_diary"
  post "/admin/diary/create" => "admin#create_diary"
  post "/admin/diary/update/:id" => "admin#update_diary"
  post "/admin/diary/delete/:id" => "admin#destroy_diary"
  
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
  post "/contact" => "home#contact"
  
  # PRELOADED PAGES
  get "/home" => "home#index"
  get "/news" => "home#news"
  get "/ajax_news" => "home#ajax_news"
  get "/events/diary" => "home#diary"
  get "/ajax_diary" => "home#ajax_diary"
  
  # CUSTOM CONTENT
  get "/download/:filename" => "home#article"
  get "/image/:id" => "home#image"
  get "/:link" => "home#page"
  get "/:link/:sub_link" => "home#page"
  
  root :to => "home#index"
end
