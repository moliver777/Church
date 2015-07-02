class AddGalleryFieldsToImages < ActiveRecord::Migration
  def change
    add_column :images, :thumb_content, :binary,  null: true
    add_column :images, :gallery_id,    :integer, null: true
    add_column :images, :image_order,   :integer, null: true
  end
end
