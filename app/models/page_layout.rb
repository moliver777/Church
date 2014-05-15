class PageLayout < ActiveRecord::Base
  has_many :pages
  has_many :panels

  DIARY = "DIARY"
  PAGE = "PAGE"
  PANEL = "PANEL"
  TYPES = [DIARY, PAGE, PANEL]
end
