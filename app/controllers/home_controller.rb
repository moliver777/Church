class HomeController < ApplicationController
  skip_before_filter :setup, only: [:get_diary, :get_news, :get_article, :image]
  skip_before_filter :shared_content, only: [:get_diary, :get_news, :get_article, :image]
  
  def index
    @page = Page.where(link: "/").first || render_404
    @page_link = "/"
  end
  
  def page
    link = params.include?(:sub_link) ? "#{params[:link]}/#{params[:sub_link]}" : params[:link]
    @page = Page.where(link: link).first || render_404
    @page_link = params[:link]
    @sub_link = params[:sub_link]
    redirect_to "/#{@page.sub_links.first.link}" if @page.page_layout_id == 0
  end
  
  def diary
    @page_link = "events"
    @sub_link = "diary"
    @diaries = params.include?(:page) ? Diary.page(params[:page]) : Diary.page("")
  end
  
  def news
    @page_link = "news"
  end
  
  def articles
    @page_link = "articles"
  end
  
  def get_article
    article = Article.where(filename: params[:filename]).first
    send_data article.binary_content
  end
  
  def unsubscribe
  end
  
  def image
    image = Image.where(id: params[:id]).first
    send_data image.binary_content, :disposition => 'inline'
  end
end