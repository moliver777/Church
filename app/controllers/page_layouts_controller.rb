class PageLayoutsController < ApplicationController
  before_action :authenticated_user
  before_action :dev_permission
  layout "admin"
  
  # GET /page_layouts
  # GET /page_layouts.json
  def index
    @page_layouts = PageLayout.order("id ASC")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @page_layouts }
    end
  end

  # GET /page_layouts/1
  # GET /page_layouts/1.json
  def show
    @page_layout = PageLayout.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @page_layout }
    end
  end

  # GET /page_layouts/new
  # GET /page_layouts/new.json
  def new
    @page_layout = PageLayout.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @page_layout }
    end
  end

  # GET /page_layouts/1/edit
  def edit
    @page_layout = PageLayout.find(params[:id])
  end

  # POST /page_layouts
  # POST /page_layouts.json
  def create
    @page_layout = PageLayout.new(params[:page_layout])

    respond_to do |format|
      if @page_layout.save
        format.html { redirect_to @page_layout, notice: 'Page layout was successfully created.' }
        format.json { render json: @page_layout, status: :created, location: @page_layout }
      else
        format.html { render action: "new" }
        format.json { render json: @page_layout.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /page_layouts/1
  # PUT /page_layouts/1.json
  def update
    @page_layout = PageLayout.find(params[:id])

    respond_to do |format|
      if @page_layout.update_attributes(params[:page_layout])
        format.html { redirect_to @page_layout, notice: 'Page layout was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @page_layout.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /page_layouts/1
  # DELETE /page_layouts/1.json
  def destroy
    @page_layout = PageLayout.find(params[:id])
    @page_layout.destroy
    render nothing: true
  end
end
