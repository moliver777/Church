class AddGalleriesTable < ActiveRecord::Migration
  def up
    create_table :galleries do |t|
      t.string  :name, :null => false
      t.integer :gallery_order
      t.timestamps
    end
  end

  def down
    drop_table :galleries
  end
end
