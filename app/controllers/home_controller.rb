class HomeController < ApplicationController
  skip_before_filter :setup, only: [:get_diary, :get_news, :get_article, :image]
  skip_before_filter :shared_content, only: [:get_diary, :get_news, :get_article, :image]
  
  def index
    @page = Page.where(link: "/").first || render_404
    @page_link = "/"
  end
  
  def page
    link = params.include?(:sub_link) ? "#{params[:link]}/#{params[:sub_link]}" : params[:link]
    @page = Page.where(link: link, publish: true).first || render_404
    @page_link = params[:link]
    @sub_link = params[:sub_link]
    redirect_to "/#{@page.sub_links.first.link}" if @page.page_layout_id == 0 rescue nil
  end
  
  def diary
    redirect_to "/" unless Page.where(link: "diary", publish: true).first
    @page_link = "diary"
    @diaries = params.include?(:page) ? Diary.order("date DESC").page(params[:page]) : Diary.order("date DESC").page("")
  end
  
  def galleries
    @page_link = "gallery"
    @galleries = Gallery.order("gallery_order ASC")
  end
  
  def gallery
    @page_link = "gallery"
    @gallery = Gallery.find(params[:id])
  end

  def newsletter
    redirect_to "/" unless Page.where(link: "programme", publish: true).first
    @page_link = "programme"
    @newsletter = Newsletter.order("id DESC").first
  end

  def validated? params
    errors = Array.new
    errors << "Sorry. You can only message us twice in any 24 hour period." if Note.where("ip_address = ? AND created_at > ?", request.remote_ip, Time.now.advance(days: -1)).count > 1
    errors << "Name is required." unless params[:name].length > 0
    errors << "Message is required." unless params[:message].length > 0
    errors << "Email address or phone number is required" unless (params[:email_address].length > 0 || params[:phone_number].length > 0)
    return errors
  end

  def embed_newsletter
    newsletter = Newsletter.where(filename: params[:filename]).first
    send_data newsletter.binary_content, :filename => params[:filename], :type => "application/pdf", :disposition => 'inline' 
  end

  def newsletter_download
    newsletter = Newsletter.where(filename: params[:filename]).first
    send_data newsletter.binary_content
  end

  def download
    article = Article.where(filename: params[:filename]).first
    send_data article.binary_content
  end

  def image
    image = Image.where(id: params[:id]).first
    send_data image.binary_content, :disposition => 'inline'
  end
  
  def thumb
    image = Image.where(id: params[:id]).first
    send_data image.thumb_content, :disposition => 'inline'
  end
  
  def unsubscribe
  end
end