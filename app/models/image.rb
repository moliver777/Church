class Image < ActiveRecord::Base
  has_many :image_mappings

  def image_file=(input_data)
    self.binary_content = input_data.read
  end
end
