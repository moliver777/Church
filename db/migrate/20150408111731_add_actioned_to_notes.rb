class AddActionedToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :actioned, :boolean, :null => false, :default => false
  end
end
