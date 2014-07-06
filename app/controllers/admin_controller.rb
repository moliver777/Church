class AdminController < ApplicationController
  before_filter :authenticated_user, :except => [:admin]
  
  def admin
  end
  
  def notes
    @notes = params.include?(:page) ? Note.order("is_read ASC, created_at DESC").page(params[:page]).per(20) : Note.order("is_read ASC, created_at DESC").page("").per(20)
  end
  
  def note
    @note = Note.find(params[:id])
    @note.update_attribute(:is_read, true)
    @unread = Note.where(is_read: false).count
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
    @images = Image.all.map{|i| [i.name,i.id]}
  end
  
	def create_panel
    images = params[:panel][:images]
		@page = Page.find(params[:page_id])
    @panel = Panel.new(params[:panel].except!(:images))
		raise StandardError unless params[:panel][:name].length > 0
		
    if @panel.save
      images.split(",").each do |image|
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
    images = params[:panel][:images]
    @panel = Panel.find(params[:id])
		raise StandardError unless params[:panel][:name].length > 0
		
    if @panel.update_attributes(params[:panel].except!(:images))
      @panel.image_mappings.destroy_all
			puts images
      images.split(",").each do |image|
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
  
  def diary
    @diaries = Diary.all
  end
  
  def new_diary
    @diary = Diary.new
    @images = Image.all.map{|i| [i.name,i.id]}
  end
  
  def edit_diary
    @diary = Diary.find(params[:id])
    @images = Image.all.map{|i| [i.name,i.id]}
  end
  
  def create_diary
    images = params[:diary][:images]
    @diary = Diary.new(params[:diary].except!(:images))
    if @diary.save
      images.split(",").each do |image|
        unless image == "0"
          ImageMapping.create({
            diary_id: @diary.id,
            image_id: image
          })
        end
      end
      render json: {success: true}
    else
      render json: {success: false, errors: @diary.errors}
    end
  end
  
  def update_diary
    images = params[:diary][:images]
    @diary = Diary.find(params[:id])
    if @diary.update_attributes(params[:diary].except!(:images))
      @diary.image_mappings.destroy_all
      images.split(",").each do |image|
        unless image == "0"
          ImageMapping.create({
            diary_id: @diary.id,
            image_id: image
          })
        end
      end
      render json: {success: true}
    else
      render json: {success: false, errors: @diary.errors}
    end
  end
  
  def destroy_diary
    @diary = Diary.find(params[:id])
    @diary.image_mappings.destroy_all
    @diary.destroy
    render nothing: true
  end
	
	def wysiwyg_images
		render json: {images: Image.select([:id, :name])}
	end
end
