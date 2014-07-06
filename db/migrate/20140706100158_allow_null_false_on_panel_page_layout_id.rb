class AllowNullFalseOnPanelPageLayoutId < ActiveRecord::Migration
  def change
    change_column :panels, :page_layout_id, :integer, :null => false
  end
end
