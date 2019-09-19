require "nokogiri"
require "nori"
require "open-uri"

class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :setup
  before_filter :universalis
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
  
  def universalis
    unless session[:universalis] && session[:universalis_date] == Date.today
      xml = Nori.new(:parser => :nokogiri).parse(Nokogiri::XML(open("http://www.universalis.com/atommass1.xml")).to_s)
      raise "No summary found" unless xml["feed"]["entry"]["summary"]
      session[:universalis] = xml["feed"]["entry"]["summary"]
      session[:universalis_date] = Date.today
    end
  rescue StandardError => e
    puts "Couldn't parse Universalis xml feed"
    puts e.message
  end
  
  def setup
    @site_title = Setting.where(key: "site_title").first.value rescue ""
    @body_class = session.include?(:size) ? session[:size] : "";
    @render_error = '<div class="panel" id="render_error">Specified content could not be found for this panel</div>'
    @analytics = Setting.where(key: "analytics_enabled").first.value == "true" rescue false
    @news_tickers = NewsArticle.where(publish: true)
    @unread = Note.where(is_read: false).count
  end
  
  def shared_content
    @header = Content.where(content_type: "HEADER").first.html_content.gsub(/@site_title/, @site_title).gsub(/@date/, Date.today.strftime("%^A %B")+" "+Date.today.day.ordinalize).gsub(/@universalis/, (session[:universalis] rescue "")) || @render_error
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
