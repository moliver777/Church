class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :setup
  before_filter :shared_content
  layout "application"
  
  def accessibility
    session[:size] = params[:accessibility]
    render nothing: true
  end
  
  private
  
  def render_404
    render file: 'public/404.html', status: :not_found, layout: false
  end
  
  def setup
    @site_title = Setting.where(key: "site_title").first.value rescue ""
    @body_class = session.include?(:size) ? session[:size] : "";
    @render_error = '<div class="panel" id="render_error">Specified content could not be found for this panel</div>'
    @unread = Note.where(is_read: false).count
  end
  
  def shared_content
    @header = Content.where(content_type: "HEADER").first.html_content.gsub(/@site_title/, @site_title) || @render_error
    @footer = Content.where(content_type: "FOOTER").first.html_content || @render_error
    menu_pages = Page.where(:publish => true, :menu_link => true).order("menu_position ASC")
    @menu = menu_pages.select{|page| page.menu_position != 0} + menu_pages.select{|page| page.menu_position == 0} # put position 0 items to end
  end
  
  def authenticated_user
    redirect_to "/admin" unless current_user
  end
  
  def dev_permission
    if current_user
      redirect_to "/admin" unless current_user.level == "DEVELOPER"
    end
  end
  
  def user_permission
    current_user.level == "DEVELOPER" rescue false
  end
  helper_method :user_permission
  
  def current_user
    @current_user ||= User.where(username: session[:username]).first
  end
  helper_method :current_user
end
