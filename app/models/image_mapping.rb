class ImageMapping < ActiveRecord::Base
	belongs_to :content
	belongs_to :diary
	belongs_to :news_article
	belongs_to :panel
	belongs_to :image
end