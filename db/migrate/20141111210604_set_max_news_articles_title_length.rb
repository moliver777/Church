class SetMaxNewsArticlesTitleLength < ActiveRecord::Migration
  def change
    change_column :news_articles, :title, :string, :limit => 135
  end
end
