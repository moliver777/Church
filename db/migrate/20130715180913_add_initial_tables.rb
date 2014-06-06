class AddInitialTables < ActiveRecord::Migration
  def up
    create_table :articles do |t|
      t.date    :date,            :null => false
      t.string  :filename,        :null => false
      t.binary  :binary_content,  :null => false
      t.timestamps
    end

    create_table :contents do |t|
      t.string  :content_type
      t.text    :html_content
      t.timestamps
    end

    create_table :diaries do |t|
      t.string  :title, :null => false
      t.date    :date,  :null => false
      t.text    :text,  :null => false
      t.timestamps
    end

    create_table :email_addresses do |t|
      t.string  :email_address, :null => false
      t.boolean :enabled,       :null => false, :default => true
      t.timestamps
    end

    create_table :images do |t|
      t.string  :name,            :null => false
      t.binary  :binary_content,  :null => false
      t.timestamps
    end

    create_table :image_mappings do |t|
      t.integer :content_id
      t.integer :diary_id
      t.integer :news_article_id
      t.integer :panel_id
      t.integer :image_id,  :null => false
      t.timestamps
    end

    create_table :news_articles do |t|
      t.string  :title,     :null => false
      t.string  :abstract,  :null => false
      t.text    :text,      :null => false
      t.boolean :publish,   :null => false, :default => false
      t.timestamps
    end

    create_table :notes do |t|
      t.string  :name,        :null => false
      t.string  :phone_number
      t.string  :email_address
      t.text    :message,     :null => false
      t.boolean :read,        :null => false, :default => false
      t.string  :ip_address,  :null => false
      t.string  :category,    :null => false
      t.timestamps
    end

    create_table :page_layouts do |t|
      t.string  :content_type
      t.string  :name,          :null => false
      t.integer :num_panels,    :null => false, :default => 0
      t.text    :html_content
      t.timestamps
    end

    create_table :pages do |t|
      t.string  :link,              :null => false
      t.string  :title,             :null => false
      t.integer :page_layout_id,    :null => false
      t.integer :panel_1
      t.integer :panel_2
      t.integer :panel_3
      t.integer :panel_4
      t.integer :panel_5
      t.boolean :publish,           :null => false, :default => false
      t.boolean :menu_link,         :null => false, :default => false
      t.integer :menu_position,     :null => false, :default => 0
      t.integer :sub_menu_position, :null => false, :default => 0
      t.timestamps
    end

    create_table :panels do |t|
      t.integer :page_layout_id
      t.string  :name,            :null => false
      t.text    :text
      t.string  :classes
      t.timestamps
    end

    create_table :periodicals do |t|
      t.date    :date,    :null => false
      t.integer :period,  :null => false, :default => 1
      t.text    :text,    :null => false
      t.timestamps
    end

    create_table :settings do |t|
      t.string  :key
      t.text    :value
      t.timestamps
    end

    create_table :users do |t|
      t.string  :username
      t.string  :password
      t.string  :level
      t.timestamps
    end
  end

  def down
    drop_table :articles
    drop_table :contents
    drop_table :diaries
    drop_table :email_addresses
    drop_table :images
    drop_table :image_mappings
    drop_table :news_articles
    drop_table :notes
    drop_table :page_layouts
    drop_table :pages
    drop_table :panels
    drop_table :periodicals
    drop_table :settings
    drop_table :users
  end
end
