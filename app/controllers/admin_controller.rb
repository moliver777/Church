class AdminController < ApplicationController
  before_filter :authenticated_user, :except => [:admin]
  
  def admin
    Session.where("created_at < ?", Time.now.advance(days: -1)).destroy_all
    @guide_downloads = Setting.where(key: "guide_counter").first.value
    @reflections_downloads = Setting.where(key: "reflections_counter").first.value
    @stations_downloads = Setting.where(key: "stations_counter").first.value
  end
  
  def notes
    @notes = params.include?(:page) ? Note.order("is_read ASC, created_at DESC").page(params[:page]).per(20) : Note.order("is_read ASC, created_at DESC").page("").per(20)
  end
  
  def note
    @note = Note.find(params[:id])
    @note.update_attribute(:is_read, true)
    @unread = Note.where(is_read: false).count
  end
  
  def action_note
    @note = Note.find(params[:note_id])
    @note.update_attribute(:actioned, (params[:actioned] == "true"))
    render nothing: true
  end
  
  def prayers
    @month = params.include?(:month) ? params[:month] : Date.today.month
    @days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    @prayers = Hash[*Periodical.all.map{|prayer| [prayer.date.strftime("%m%d"), prayer]}.flatten(1)]
  end
  
  def prayer
    @date = "2000-#{params[:date][0..1]}-#{params[:date][2..-1]}"
    @prayer = Periodical.where(date: @date).first
    @prayer = Periodical.new unless @prayer
  end
  
  def update_prayer
    prayer = Periodical.where(date: params[:date]).first
    prayer = Periodical.new unless prayer
    prayer.date = params[:date]
    prayer.text = params[:text]
    prayer.save
    render nothing: true
  end
  
  def destroy_prayer
    prayer = Periodical.where(date: params[:date]).first
    prayer.destroy if prayer
    render nothing: true
  end
  
  def pages
    @pages = Page.where(menu_link: true).order("menu_position ASC")
    @prerendered = PageLayout.where(content_type: PageLayout::PAGE, num_panels: 0).first.id
  end
  
  def publish_page
    page = Page.find(params[:page_id])
    page.update_attribute(:publish, (params[:publish] == "true"))
    render nothing: true
  end
  
  def publish_news_article
    news_article = NewsArticle.find(params[:news_article_id])
    news_article.update_attribute(:publish, params[:publish])
    render nothing: true
  end
  
  def panels
    @page = Page.find(params[:page_id])
  end
  
  def panel
    @page = Page.find(params[:page_id])
		@panel_number = params[:panel_number]
		@panel = Panel.new
		@url = "/admin/pages/#{params[:page_id]}"
		if params[:panel_id] != "new"
    	@panel = Panel.find(params[:panel_id])
			@url += "/#{params[:panel_id]}"
		end
    @panel_layouts = PageLayout.where(:content_type => "PANEL").map{|p| [p.name,p.id]}
    @images = Image.order("created_at DESC").map{|i| [i.name,i.id]}
  end
  
	def create_panel
    images = JSON.parse(params[:panel][:images]) rescue []
		@page = Page.find(params[:page_id])
    @panel = Panel.new(params[:panel].except!(:images))
		raise StandardError unless params[:panel][:name].length > 0
		
    if @panel.save
      images.each do |image|
        unless image == "0"
          ImageMapping.create({
            panel_id: @panel.id,
            image_id: image
          })
        end
      end
			@page.send("panel_#{params[:panel_number]}=", @panel.id)
			@page.save
			render json: {success: true}
    else
			render json: {success: false}
    end
	rescue StandardError => e
		render json: {success: false}
	end
	
  def update_panel
    images = JSON.parse(params[:panel][:images]) rescue []
    @panel = Panel.find(params[:id])
		raise StandardError unless params[:panel][:name].length > 0
		
    if @panel.update_attributes(params[:panel].except!(:images))
      @panel.image_mappings.destroy_all
      images.each do |image|
        unless image == "0"
          ImageMapping.create({
            panel_id: @panel.id,
            image_id: image
          })
        end
      end
			render json: {success: true}
    else
			render json: {success: false}
    end
	rescue StandardError => e
		render json: {success: false}
  end
	
	def wysiwyg_content
		render json: {images: Image.order("created_at DESC").select([:id, :name]), articles: Article.order("created_at DESC").select([:filename, :original_filename])}
	end
end
