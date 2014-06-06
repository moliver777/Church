class HomeController < ApplicationController
  skip_before_filter :setup, only: [:get_diary, :get_news, :get_article, :image]
  skip_before_filter :shared_content, only: [:get_diary, :get_news, :get_article, :image]
  
  def index
    @page = Page.where(link: "/").first || render_404
    @page_link = "/"
  end
  
  def page
    @page = Page.where(link: params[:link]).first || render_404
    @page_link = params[:link]
  end
  
  def diary
    @page_link = "diary"
    @diaries = Diary.page("")
  end
  
  def ajax_diary
    @diaries = Diary.page(params[:page])
    respond_to do |format|
        format.js
      end
  end
  
  def news
    @page_link = "news"
  end
  
  def ajax_news
  end
  
  def articles
    @page_link = "articles"
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