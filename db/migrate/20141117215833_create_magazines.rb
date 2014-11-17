class CreateMagazines < ActiveRecord::Migration
  def change
    create_table :magazines do |t|
      t.date    :date,              :null => false
      t.string  :filename,          :null => false
      t.string  :original_filename, :null => false
      t.binary  :binary_content,    :null => false
      t.timestamps
    end
  end
end
