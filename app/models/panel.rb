class Panel < ActiveRecord::Base
  belongs_to :page_layout
  belongs_to :page
  has_many :image_mappings
  has_many :images, through: :image_mappings
  
  def build
    content = ActiveRecord::Base.connection.execute("SELECT SQL_NO_CACHE html_content FROM page_layouts WHERE id = #{self.page_layout_id}").first[0]
    images = self.images
    splits = self.text.split("-----")
    classes = self.classes.split(" ") rescue []
    if images[1]
      content.gsub!(/@images/, images.map{|image| "<img src=\"/image/#{image.id}\" />"}.join())
      classes << "slideshow"
    elsif images[0]
      content.gsub!(/@images/, "<img src=\"/image/#{images[0].id}\" />")
    else
      content.gsub!(/@images/, "")
    end
    content.gsub!(/@id/, "panel#{self.id}")
    content.gsub!(/@classes/, classes.join(" "))
    content.gsub!(/@text/, "#{self.text}")
    content.gsub!(/@split1/, "#{splits[0]}")
    content.gsub!(/@split2/, "#{splits[1]}")
    return content
  end
end
