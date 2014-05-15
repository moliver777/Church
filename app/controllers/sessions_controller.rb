class SessionsController < ApplicationController
  def login
    raise "Username cannot be blank" if params[:username].blank?
    raise "Password cannot be blank" if params[:password].blank?
    user = User.where(:username => params[:username]).first
    raise "User does not exist" unless user
    raise "Password incorrect" unless params[:password] == User.decrypt(user.password)
    session[:username] = params[:username]
    render :json => {:success => true, :message => "Login successful!"}
  rescue StandardError => e
    render :json => {:success => false, :message => e.message}
  end
  
  def logout
    session[:username] = nil
    redirect_to "/admin"
  end
end