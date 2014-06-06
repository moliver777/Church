class Page < ActiveRecord::Base
  belongs_to :page_layout

  RENDER_ERROR = '<div class="panel" id="render_error">Specified content could not be found for this panel</div>'

  def build
    content = self.page_layout.html_content
    content.gsub!(/@panel_1/, (Panel.where(:id => self.panel_1).first.build rescue RENDER_ERROR))
    content.gsub!(/@panel_2/, (Panel.where(:id => self.panel_2).first.build rescue RENDER_ERROR)) if self.page_layout.num_panels > 1
    content.gsub!(/@panel_3/, (Panel.where(:id => self.panel_3).first.build rescue RENDER_ERROR)) if self.page_layout.num_panels > 2
    content.gsub!(/@panel_4/, (Panel.where(:id => self.panel_4).first.build rescue RENDER_ERROR)) if self.page_layout.num_panels > 3
    content.gsub!(/@panel_5/, (Panel.where(:id => self.panel_5).first.build rescue RENDER_ERROR)) if self.page_layout.num_panels > 4
    return content.html_safe
  end
  
  def sub_links
    Page.where(:menu_position => self.menu_position, :menu_link => false).order("sub_menu_position ASC")
  end
end
