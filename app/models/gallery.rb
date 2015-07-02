class Gallery < ActiveRecord::Base
  has_many :images, :order => "image_order ASC"
end
