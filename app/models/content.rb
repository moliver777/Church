class Content < ActiveRecord::Base
  attr_accessible :content_type, :html_content

  has_many :image_mappings
  has_many :images, through: :image_mappings
end
