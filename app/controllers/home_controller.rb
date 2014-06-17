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
  
  def contact
    errors = validated? params[:note]
    if errors.empty?
      params[:note][:category] = "Contact"
      params[:note][:ip_address] = request.remote_ip
      Note.create(params[:note])
      render json: {success: true}
    else
      render json: {success: false, error: errors[0]}
    end
  end

  def validated? params
    errors = Array.new
    errors << "Sorry. You can only message us twice in any 24 hour period." if Note.where("ip_address = ? AND created_at > ?", request.remote_ip, Time.now.advance(days: -1)).count > 2
    errors << "Name is required." unless params[:name].length > 0
    errors << "Message is required." unless params[:message].length > 0
    errors << "The phone number provided appears to be invalid." if params[:phone_number].length > 0 && params[:phone_number] =~ /[^0-9\+]/
    return errors
  end
  
  def article
    article = Article.where(filename: params[:filename]).first
    send_data article.binary_content
  end
  
  def image
    image = Image.where(id: params[:id]).first
    send_data image.binary_content, :disposition => 'inline'
  end
  
  def unsubscribe
  end
end