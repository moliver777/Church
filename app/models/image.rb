class Image < ActiveRecord::Base
  has_many :image_mappings
  belongs_to :gallery
  
  validate :binary_content_validation
  validate :thumb_content_validation
  
  def image_file=(input_data)
    self.binary_content = input_data.read
  end
  
  def thumb_file=(input_data)
    self.thumb_content = input_data.read
  end
  
  def binary_content_validation
    if self.binary_content.length > 2097152
      errors.add(:binary_content, ": Image file must be less than 2mb")
    end
  end
  
  def thumb_content_validation
    if self.thumb_content
      if self.thumb_content.length > 20480
        errors.add(:thumb_content, ": Thumbnail must be less than 20kb")
      end
    end
  end
end
