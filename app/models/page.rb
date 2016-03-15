class Page < ActiveRecord::Base
  belongs_to :page_layout

  RENDER_ERROR = '<div class="panel" id="render_error">Specified content could not be found for this panel</div>'
  PREVIEW_ERROR = 'Panel not found! Click to create it'

  def build session
    content = self.page_layout.html_content
    content.gsub!(/@panel_1/, (Panel.where(:id => self.panel_1).first.build(session)))
    content.gsub!(/@panel_2/, (Panel.where(:id => self.panel_2).first.build(session) rescue RENDER_ERROR)) if self.page_layout.num_panels > 1
    content.gsub!(/@panel_3/, (Panel.where(:id => self.panel_3).first.build(session) rescue RENDER_ERROR)) if self.page_layout.num_panels > 2
    content.gsub!(/@panel_4/, (Panel.where(:id => self.panel_4).first.build(session) rescue RENDER_ERROR)) if self.page_layout.num_panels > 3
    content.gsub!(/@panel_5/, (Panel.where(:id => self.panel_5).first.build(session) rescue RENDER_ERROR)) if self.page_layout.num_panels > 4
    return content.html_safe
  end
  
  def preview
    content = self.page_layout.preview_content
    content.gsub!(/@id1/, "1_#{self.panel_1}")
    content.gsub!(/@id2/, "2_#{self.panel_2}") if self.page_layout.num_panels > 1
    content.gsub!(/@id3/, "3_#{self.panel_3}") if self.page_layout.num_panels > 2
    content.gsub!(/@id4/, "4_#{self.panel_4}") if self.page_layout.num_panels > 3
    content.gsub!(/@id5/, "5_#{self.panel_5}") if self.page_layout.num_panels > 4
    content.gsub!(/@title1/, (Panel.where(:id => self.panel_1).first.name rescue PREVIEW_ERROR))
    content.gsub!(/@title2/, (Panel.where(:id => self.panel_2).first.name rescue PREVIEW_ERROR)) if self.page_layout.num_panels > 1
    content.gsub!(/@title3/, (Panel.where(:id => self.panel_3).first.name rescue PREVIEW_ERROR)) if self.page_layout.num_panels > 2
    content.gsub!(/@title4/, (Panel.where(:id => self.panel_4).first.name rescue PREVIEW_ERROR)) if self.page_layout.num_panels > 3
    content.gsub!(/@title5/, (Panel.where(:id => self.panel_5).first.name rescue PREVIEW_ERROR)) if self.page_layout.num_panels > 4
    return content.html_safe
  end
  
  def sub_links ignore_publish=false
		if ignore_publish
			return Page.where(:menu_position => self.menu_position, :menu_link => false).order("sub_menu_position ASC")
		else
			return Page.where(:publish => true, :menu_position => self.menu_position, :menu_link => false).order("sub_menu_position ASC")
		end
  end
end
