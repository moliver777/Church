class ChangesToArticlesTable < ActiveRecord::Migration
  def change
    change_column :articles, :date, :date, :null => true
    add_column :articles, :category, :string, :null => false
    add_column :articles, :original_filename, :string, :null => false
  end
end
