require "encryptor"

class User < ActiveRecord::Base
  REGULAR = "REGULAR"
  DEVELOPER = "DEVELOPER"
  LEVELS = [REGULAR,DEVELOPER]
  
  def self.encrypt password
    Encryptor::Aes256.new.digest password, 0
  end
  
  def self.decrypt password
    Encryptor::Aes256.new.decrypt password
  end
  
  def old_username
    self.username
  end
  
  def confirm_password; end
end
