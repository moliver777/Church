# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20141111194406) do

  create_table "articles", :force => true do |t|
    t.date     "date"
    t.string   "filename",                                                :null => false
    t.binary   "binary_content",    :limit => 2147483647,                 :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "category",                                                :null => false
    t.string   "original_filename",                       :default => "", :null => false
  end

  create_table "contents", :force => true do |t|
    t.string   "content_type"
    t.text     "html_content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "diaries", :force => true do |t|
    t.string   "title",      :null => false
    t.date     "date",       :null => false
    t.text     "text",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "email_addresses", :force => true do |t|
    t.string   "email_address",                   :null => false
    t.boolean  "enabled",       :default => true, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "image_mappings", :force => true do |t|
    t.integer  "content_id"
    t.integer  "diary_id"
    t.integer  "news_article_id"
    t.integer  "panel_id"
    t.integer  "image_id",        :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "images", :force => true do |t|
    t.string   "name",                                 :null => false
    t.binary   "binary_content", :limit => 2147483647, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "news_articles", :force => true do |t|
    t.string   "title",                         :null => false
    t.string   "abstract",   :default => ""
    t.boolean  "publish",    :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "content"
  end

  create_table "notes", :force => true do |t|
    t.string   "name",                             :null => false
    t.string   "phone_number"
    t.string   "email_address"
    t.text     "message",                          :null => false
    t.boolean  "is_read",       :default => false, :null => false
    t.string   "ip_address",                       :null => false
    t.string   "category",                         :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "page_layouts", :force => true do |t|
    t.string   "content_type"
    t.string   "name",                           :null => false
    t.integer  "num_panels",      :default => 0, :null => false
    t.text     "html_content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "preview_content"
  end

  create_table "pages", :force => true do |t|
    t.string   "link",                                 :null => false
    t.string   "title",                                :null => false
    t.integer  "page_layout_id",                       :null => false
    t.integer  "panel_1"
    t.integer  "panel_2"
    t.integer  "panel_3"
    t.integer  "panel_4"
    t.integer  "panel_5"
    t.boolean  "publish",           :default => false, :null => false
    t.boolean  "menu_link",         :default => false, :null => false
    t.integer  "menu_position",     :default => 0,     :null => false
    t.integer  "sub_menu_position", :default => 0,     :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "panels", :force => true do |t|
    t.integer  "page_layout_id", :null => false
    t.string   "name",           :null => false
    t.text     "text"
    t.string   "classes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "periodicals", :force => true do |t|
    t.date     "date",                      :null => false
    t.integer  "period",     :default => 1, :null => false
    t.text     "text",                      :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "settings", :force => true do |t|
    t.string   "key"
    t.text     "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "password"
    t.string   "level"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
