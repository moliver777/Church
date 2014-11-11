class Newsletter < ActiveRecord::Base
  def article_file=(input_data)
    self.binary_content = input_data.read
    self.original_filename = input_data.original_filename
  end
end
