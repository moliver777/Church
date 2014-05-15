class Diary < ActiveRecord::Base
  has_many :image_mappings
  has_many :images, through: :image_mappings
end
