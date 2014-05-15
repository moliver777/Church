class Article < ActiveRecord::Base
  def article_file=(input_data)
    self.binary_content = input_data.read
  end
end
