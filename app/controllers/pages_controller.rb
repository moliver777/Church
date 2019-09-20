class PagesController < ApplicationController
  before_action :authenticated_user
  before_action :dev_permission
  layout "admin"
  
  # GET /pages
  # GET /pages.json
  def index
    @pages = Page.order("id ASC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @pages }
    end
  end

  # GET /pages/1
  # GET /pages/1.json
  def show
    @page = Page.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @page }
    end
  end

  # GET /pages/new
  # GET /pages/new.json
  def new
    @page = Page.new
    @page_layouts = PageLayout.where(:content_type => "PAGE").map{|p| [p.name,p.id]}
    @page_layouts.unshift(["None",0])
    @panel_counts = PageLayout.where(:content_type => "PAGE").each_with_object({}){|p,h| h[p.id] = p.num_panels;h[0] = 0}.to_json
    @panels = Panel.all.map{|p| [p.name,p.id]}

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @page }
    end
  end

  # GET /pages/1/edit
  def edit
    @page = Page.find(params[:id])
    @page_layouts = PageLayout.where(:content_type => "PAGE").map{|p| [p.name,p.id]}
    @page_layouts.unshift(["None",0])
    @panel_counts = PageLayout.where(:content_type => "PAGE").each_with_object({}){|p,h| h[p.id] = p.num_panels;h[0] = 0}.to_json
    @panels = Panel.all.map{|p| [p.name,p.id]}
  end

  # POST /pages
  # POST /pages.json
  def create
    @page = Page.new(params[:page])

    respond_to do |format|
      if @page.save
        format.html { redirect_to @page, notice: 'Page was successfully created.' }
        format.json { render json: @page, status: :created, location: @page }
      else
        format.html { render action: "new" }
        format.json { render json: @page.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /pages/1
  # PUT /pages/1.json
  def update
    @page = Page.find(params[:id])

    respond_to do |format|
      if @page.update_attributes(params[:page])
        format.html { redirect_to @page, notice: 'Page was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @page.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pages/1
  # DELETE /pages/1.json
  def destroy
    @page = Page.find(params[:id])
    @page.destroy
    render nothing: true
  end
end
