class PanelsController < ApplicationController
  before_filter :authenticated_user
  before_filter :dev_permission
  layout "admin"
  
  # GET /panels
  # GET /panels.json
  def index
    @panels = Panel.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @panels }
    end
  end

  # GET /panels/1
  # GET /panels/1.json
  def show
    @panel = Panel.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @panel }
    end
  end

  # GET /panels/new
  # GET /panels/new.json
  def new
    @panel = Panel.new
    @panel_layouts = PageLayout.where(:content_type => "PANEL").map{|p| [p.name,p.id]}
    @images = Image.all.map{|i| [i.name,i.id]}

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @panel }
    end
  end

  # GET /panels/1/edit
  def edit
    @panel = Panel.find(params[:id])
    @panel_layouts = PageLayout.where(:content_type => "PANEL").map{|p| [p.name,p.id]}
    @images = Image.all.map{|i| [i.name,i.id]}
  end

  # POST /panels
  # POST /panels.json
  def create
    images = params[:panel][:images]
    @panel = Panel.new(params[:panel].except!(:images))

    respond_to do |format|
      if @panel.save
        images.split(",").each do |image|
          unless image == "0"
            ImageMapping.create({
              panel_id: @panel.id,
              image_id: image
            })
          end
        end
        format.html { redirect_to @panel, notice: 'Panel was successfully created.' }
        format.json { render json: @panel, status: :created, location: @panel }
      else
        format.html { render action: "new" }
        format.json { render json: @panel.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /panels/1
  # PUT /panels/1.json
  def update
    images = params[:panel][:images]
    @panel = Panel.find(params[:id])

    respond_to do |format|
      if @panel.update_attributes(params[:panel].except!(:images))
        @panel.image_mappings.destroy_all
        images.split(",").each do |image|
          unless image == "0"
            ImageMapping.create({
              panel_id: @panel.id,
              image_id: image
            })
          end
        end
        format.html { redirect_to @panel, notice: 'Panel was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @panel.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /panels/1
  # DELETE /panels/1.json
  def destroy
    @panel = Panel.find(params[:id])
    @panel.image_mappings.destroy_all
    @panel.destroy
    render nothing: true
  end
end
