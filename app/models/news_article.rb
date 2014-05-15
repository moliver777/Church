class NewsArticle < ActiveRecord::Base
  has_one :image_mapping
  has_one :image, through: :image_mapping
end
