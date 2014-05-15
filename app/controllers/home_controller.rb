class HomeController < ApplicationController
  def index
    if cookies[:splash]
      @page = Page.where(link: "/").first || render_404
      @page_link = "/"
    else
      cookies[:splash] = {:value => true, :expires => Time.now.advance(days: 1)}
      render "splash", :layout => false
    end
  end
  
  def page
    @page = Page.where(link: params[:link]).first || render_404
    @page_link = params[:link]
  end
  
  def diary
    # @page_link = "/diary"
  end
  
  def get_diary
  end
  
  def news
    # @page_link = "/news"
  end
  
  def get_news
  end
  
  def articles
    # @page_link = "/articles"
  end
  
  def get_article
    article = Article.where(filename: params[:filename]).first
    send_data article.binary_content
  end
  
  def image
    image = Image.where(id: params[:id]).first
    send_data image.binary_content, :disposition => 'inline'
  end
end