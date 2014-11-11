class ChangeNewsArticlesTableDefaults < ActiveRecord::Migration
  def change
    change_column :news_articles, :abstract, :string, :null => true
    remove_column :news_articles, :text
    add_column :news_articles, :content, :text
  end
end
