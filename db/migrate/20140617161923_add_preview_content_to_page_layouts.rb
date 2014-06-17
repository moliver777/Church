class AddPreviewContentToPageLayouts < ActiveRecord::Migration
  def change
    add_column :page_layouts, :preview_content, :text
  end
end
