class Panel < ActiveRecord::Base
  belongs_to :page_layout
  belongs_to :page
  has_many :image_mappings
  has_many :images, through: :image_mappings
  
  def build
    content = ActiveRecord::Base.connection.execute("SELECT SQL_NO_CACHE html_content FROM page_layouts WHERE id = #{self.page_layout_id}").first[0]
    images = self.images
    image_splits, text_splits = get_splits
    classes = self.classes.split(" ") rescue []
    
    # if our panel is a horizontal image split, use special population logic
    if self.page_layout.name == "Half Image Split"
      begin
      if image_splits[1][0]
        content.gsub!(/@splitimages1/, image_splits[0].map{|image| "<img src=\"/image/#{image.id}\" />"}.join())
        content.gsub!(/@splitimages2/, image_splits[1].map{|image| "<img src=\"/image/#{image.id}\" />"}.join())
        classes << "slideshow" if image_splits[0][1]
      elsif image_splits[0][0]
        content.gsub!(/@splitimages1/, "<img src=\"/image/#{image_splits[0][0].id}\" />")
        content.gsub!(/@splitimages2/, "<img src=\"/image/#{image_splits[0][0].id}\" />")
      else
        content.gsub!(/@splitimages1/, "")
        content.gsub!(/@splitimages2/, "")
      end
      rescue StandardError => e
        puts e.message
        puts e.backtrace
      end
    # all other panels image logic
    else
      if images[1]
        content.gsub!(/@images/, images.map{|image| "<img src=\"/image/#{image.id}\" />"}.join())
        classes << "slideshow"
      elsif images[0]
        content.gsub!(/@images/, "<img src=\"/image/#{images[0].id}\" />")
      else
        content.gsub!(/@images/, "")
      end
    end
    
    content.gsub!(/@id/, "panel#{self.id}")
    content.gsub!(/@classes/, classes.join(" "))
    content.gsub!(/@text/, "#{self.text}")
    content.gsub!(/@splittext1/, "#{text_splits[0]}")
    content.gsub!(/@splittext2/, "#{text_splits[1]}")
    return content
  end
  
  def get_splits
    # share images between two arrays
    image_splits = [Array.new, Array.new]
    self.images.each_with_index do |image,i|
      image_splits[i%2] << image
    end
    # split text in half
    text_splits = [self.text, ""]
    if self.text.length > 15 && self.text.split(" ").count > 5
      index = (self.text.length/2).floor
      index += 1 until self.text[index] == " "
      text_splits = [self.text[0..index-1], self.text[index+1..-1]]
    end
    return [image_splits, text_splits]
  end
end
